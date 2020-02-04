REM https://travis-ci.community/t/how-to-c-in-windows/3273/4?u=huan

call "C:\Program Files (x86)\Microsoft Visual Studio\2017\BuildTools\Common7\Tools\VsDevCmd.bat" -host_arch=amd64 -arch=amd64
call "C:\Program Files (x86)\Microsoft Visual Studio\2017\BuildTools\Common7\Tools\VsDevCmd.bat" -test

cl.exe /D_USRDLL /D_WINDLL tests\fixtures\library\factorial.c /link /DLL /OUT:tests\fixtures\library\libfactorial.dll
