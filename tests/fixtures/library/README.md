# How To Compile a Shared Library

## Linux

```sh
gcc -shared -o libfactorial.so factorial.c
```

## Windows

```sh
cl.exe /LD factorial.c
```
