# ffi-adapter

Foreign Function Interface Adapter for TypeScript

## Requirement

1. Node.js v11 for [ffi](https://github.com/node-ffi) (neither v12 nor v13, see [#554](https://github.com/node-ffi/node-ffi/pull/544))


## Features

1. `sync/async` supported automatically by specify the return value for @API decorated method.
1. singleton-ed

## Usage

## Example

```ts
import {
  LIBRARY,
  API,
  RETURN,
}             from 'ffi-adapter'

@LIBRARY('C:\\my-library.dll')
export class MyLibrary {
  @API() VX_Init (cbFunc: Buffer, initKey: number): number { return RETURN(cbFunc, initKey) }
  @API() VX_LoginByStorage (): number { return RETURN() }
  @API() VX_SetMoodPath (moodPath: string): number { return RETURN(moodPath) }
  @API() VX_SetCallBackMsgOutType (type: number): number { return RETURN(type) }
  @API('int') VX_SendTextMsg (accWxid: string, toWxid: string, msg: string): Promise<number> { return RETURN(accWxid, toWxid, msg) }

}

```

## Refference

All you need is the following two decorators and one function:

1. `LIBRARY(libraryAbsFilePath: string)` - Class decorator
1. `API(returnType?: FfiReturnType)` - Method decorator
1. `RETURN(...args: any[])` - Method need to return this function to confirm the bridging/binding/replacing.

### 1 `LIBRARY(libraryAbsFilePath: string)`

- `libraryFilePath`: `string` - The shared library file absulute path, which will be bridged with the class.

Specify the where the shared library file is, and bridge it with the decorated class.

```ts
@LIBRARY('C:\\MyLibrary.dll')
class MyLibrary {
}
```

That's it.

### 2 `API(returnType?: FfiReturnType)`

- `returnType`: `FfiReturnType` - Optional. Specify the library function return type. Can be refered from the TypeScript if the method return is not a `Promise`.

Specific the library function return type, and bridge the same name function from library to the decorated class method.

```ts
class MyLibrary {
  @API('int') MyMethod(param: string): Promise<int> { ... }
}
```

### 3 `RETURN(...args: any[]): any`

- `args`: `any[]` - The method args. Just place every args of the method, to th RETURN function.

```ts
class MyLibrary {
  @API('int') MyMethod(param: string): Promise<int> { return RETURN(param) }
}
```

## ES6/TypeScript Decorator

### 1. No Decorator, No Metadata

> decorator metadata is emitted only on decorated members [link](https://stackoverflow.com/a/51493888/1123955)

### 2. Decorator Execute Sequence

```ts
@LIBRARY('./1.dll')
class Klass1 {
  @API() func1 (): void { return RETURN() }
  @API() func2 (): void { return RETURN() }
}

@LIBRARY('./2.dll')
class Klass2 {
  @API() func1 (): void { return RETURN() }
  @API() func2 (): void { return RETURN() }
}
```

The executing sequence will be:

1. Class will be decorated one by one in order.
1. For each class, the property decorator will be executed first, then the class decorator: API() will be executed on all properties first, then LIBRARY() will be executed on the class.

TODO: write a unit test for this to make sure the behavior is expected.

## Links

- [TypeScript - Class Decorators](https://www.typescriptlang.org/docs/handbook/decorators.html#class-decorators)
- [Generate ffi bindings from header files](https://github.com/tjfontaine/node-ffi-generate)
- [node-ffi使用指南](https://juejin.im/post/5b58038d5188251b186bc902)

## Resources

- [Node FFI Tutorial](https://github.com/node-ffi/node-ffi/wiki/Node-FFI-Tutorial)
- [Use the Microsoft C++ toolset from the command line - To open a developer command prompt window](https://docs.microsoft.com/en-us/cpp/build/building-on-the-command-line?view=vs-2019#developer_command_prompt_shortcuts)
- [FFI Definitions of Windows win32 api for node-ffi-napi](https://github.com/waitingsong/node-win32-api)
- [Decorators & metadata reflection in TypeScript: From Novice to Expert - PART IV: Types serialization & The metadata reflection API](http://blog.wolksoftware.com/decorators-metadata-reflection-in-typescript-from-novice-to-expert-part-4)

## AUTHOR

<!-- markdownlint-disable MD033 -->

Huan LI \<zixia@zixia.net\> (<http://linkedin.com/in/zixia>)

<a href="http://stackoverflow.com/users/1123955/zixia">
  <img src="http://stackoverflow.com/users/flair/1123955.png" width="208" height="58" alt="profile for zixia at Stack Overflow, Q&amp;A for professional and enthusiast programmers" title="profile for zixia at Stack Overflow, Q&amp;A for professional and enthusiast programmers">
</a>

## COPYRIGHT & LICENSE

- Code & Docs © 2020-now Huan LI \<zixia@zixia.net\>
- Code released under the Apache-2.0 License
- Docs released under Creative Commons
