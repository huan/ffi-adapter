# ffi-adapter

[![Build Status](https://travis-ci.com/huan/ffi-adapter.svg?branch=master)](https://travis-ci.com/huan/ffi-adapter)
[![NPM Version](https://badge.fury.io/js/ffi-adapter.svg)](https://www.npmjs.com/package/ffi-adapter)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-blue.svg)](https://www.typescriptlang.org/)

![Rainbow Colors Electronic](docs/images/rainbow.png)

> Credit: [Rainbow Colors Electronic](https://www.needpix.com/photo/19769/rainbow-colors-electronic-diodes-electronics-lights-curve-colorful-spectrum)

Foreign Function Interface Adapter Powered by Decorator & TypeScript

## Features

1. Binding shared library(`.dll`/`.so`/`.dylib`) to a TypeScript class by decorators.
1. Support `async` mode when a class method defined with a return type of `Promise`.
1. Supports Windows(`.dll`), Linux(`.so`), and MacOS(`.dylib`).
1. The class will be forced singleton.

## Requirement

1. Node.js v10 or v11 for [ffi](https://github.com/node-ffi) (neither v12 nor v13, see [#554](https://github.com/node-ffi/node-ffi/issues/554))
1. TypeScript with `--target ES5`, `--experimentalDecorators`, and `--emitDecoratorMetadata` options on.

## Example

For example, say:

1. We have a shared library file `libfactorial.so` (`.dll`/`.dylib` as well)
1. the library has a function `uint64_t factorial(int)`
1. We want to use `factorial()` in TypeScript.

### Talk is cheap, show me the code

```ts
import {
  LIBRARY,
  API,
  RETURN,
}             from 'ffi-adapter'

@LIBRARY('./libfactorial')
export class LibFactorial {
  @API() factorial (n: number): number { return RETURN(n) }
}

const lib = new LibFactorial()
console.log('factorial(5) =', lib.factorial(5))
// Output: factorial(5) = 120
```

That's it! Use it is that easy!

## Reference

```ts
import {
  LIBRARY,
  API,
  RETURN,
}           from 'ffi-adapter'
```

All you need is the above two decorators and one function:

1. `LIBRARY(libraryFile: string)` - Class decorator
1. `API(returnType?: FfiReturnType)` - Method decorator
1. `RETURN(...args: any[])` - Method need to return this function to confirm the adapting.

### 1 `LIBRARY(libraryFile: string)`

- `libraryFile`: `string` - The shared library file path, which will be adapted and binding to the class.

```ts
@LIBRARY('./libfactorial')
class LibFactorial { /* ... */ }
```

### 2 `API(returnType?: FfiReturnType)`

- `returnType`: `FfiReturnType` - Optional. Specify the library function return type. Can be refered automatically by the TypeScript if the method return is not a `Promise`.

Specific the library function return type, and bind the same name function from library to the decorated class method.

```ts
@API('uint64') factorial(n: number): Promise<number> { ... }
```

### 3 `RETURN(...args: any[]): any`

- `args`: `any[]` - The method args. Just place every args of the method, to th RETURN function.

```ts
@API() factorial(...args: any[]) { return RETURN(...args) }
```

The actual return value will be take care by the `@API` decorator.

## Tutorial

> Credit: https://github.com/node-ffi/node-ffi/tree/master/example/factorial

### 1 For the belowing C source code: `factorial.c`

```c
#include <stdint.h>

#if defined(WIN32) || defined(_WIN32)
#define EXPORT __declspec(dllexport)
#else
#define EXPORT
#endif

EXPORT uint64_t factorial(int max) {
  int i = max;
  uint64_t result = 1;

  while (i >= 2) {
    result *= i--;
  }

  return result;
}
```

### 2 We can build a shared library `libfactorial` based on it

#### 2.1 To compile `libfactorial.dylib` on OS X

``` bash
gcc -dynamiclib -undefined suppress -flat_namespace factorial.c -o libfactorial.dylib
```

#### 2.2 To compile `libfactorial.so` on Linux/Solaris/etc

``` bash
gcc -shared -fpic factorial.c -o libfactorial.so
```

#### 2.3 To compile `libfactorial.dll` on Windows (<http://stackoverflow.com/a/2220213>)

``` bash
cl.exe /D_USRDLL /D_WINDLL factorial.c /link /DLL /OUT:libfactorial.dll
```

### 3 We can adapte the shared library into TypeScript as a Class

Save the following code to file `lib-factorial.ts`:

```ts
import {
  LIBRARY,
  API,
  RETURN,
}             from 'ffi-adapter'

@LIBRARY('./libfactorial')
export class LibFactorial {

  @API() factorial (n: number): number { return RETURN(n) }

}
```

### 4 Let's use it

```ts
import { LibFactorial } from './lib-factorial.ts'

const lib = new LibFactorial()
console.log('factorial(5) =', lib.factorial(5))
// Output: factorial(5) = 120
```

That's it! super clean, beautiful, and easy to maintain!

## Resources

- [TypeScript - Class Decorators](https://www.typescriptlang.org/docs/handbook/decorators.html#class-decorators)
- [Generate ffi bindings from header files](https://github.com/tjfontaine/node-ffi-generate)
- [node-ffi使用指南](https://juejin.im/post/5b58038d5188251b186bc902)
- [Node FFI Tutorial](https://github.com/node-ffi/node-ffi/wiki/Node-FFI-Tutorial)
- [Use the Microsoft C++ toolset from the command line - To open a developer command prompt window](https://docs.microsoft.com/en-us/cpp/build/building-on-the-command-line?view=vs-2019#developer_command_prompt_shortcuts)
- [FFI Definitions of Windows win32 api for node-ffi-napi](https://github.com/waitingsong/node-win32-api)
- [Decorators & metadata reflection in TypeScript: From Novice to Expert - PART IV: Types serialization & The metadata reflection API](http://blog.wolksoftware.com/decorators-metadata-reflection-in-typescript-from-novice-to-expert-part-4)
- [decorator metadata is emitted only on decorated members](https://stackoverflow.com/a/51493888/1123955)

## Knowned Issues

1. Node.js v12/13 is not supported yet. (see [#554](https://github.com/node-ffi/node-ffi/issues/554))

## History

### master

### v0.2 Feb 4, 2020

The fist version.

1. Use `@LIBRARY()`, `@API()`, and `RETURN()` to bind a shared library to a TypeScript Class.

## Author

[Huan LI](https://github.com/huan) ([李卓桓](http://linkedin.com/in/zixia)) zixia@zixia.net

[![Profile of Huan LI (李卓桓) on StackOverflow](https://stackexchange.com/users/flair/265499.png)](https://stackexchange.com/users/265499)

## Copyright & License

- Code & Docs © 2020-now Huan LI \<zixia@zixia.net\>
- Code released under the Apache-2.0 License
- Docs released under Creative Commons
