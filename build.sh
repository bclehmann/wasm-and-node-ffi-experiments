#!/bin/sh

pushd assembly-script
npm run asbuild
popd

emcc ./emscripten/main.c -o ./emscripten/a.out.js -sEXPORTED_FUNCTIONS=_naiveMatrixMultiplication,_malloc,_free -sEXPORTED_RUNTIME_METHODS=ccall,HEAPF32 -O3
