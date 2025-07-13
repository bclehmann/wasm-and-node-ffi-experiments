This is just some experiments with WASM and FFI to see what can easily be done to make Javascript faster. The benchmark is the naive matrix multiplication algorithm (i.e. cubic complexity).

# How to use this

run `setup.sh` to install any node dependencies

run `build.sh` to build everything

run `node index.js` to run the benchmark

Note that the emscripten and and FFI implementations may benefit from `-ffast-math`, but this flag is evil and should only be used with caution.
