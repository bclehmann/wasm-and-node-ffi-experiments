This is just some experiments with WASM and FFI to see what can easily be done to make Javascript faster. The benchmark is the naive matrix multiplication algorithm (i.e. cubic complexity). The non-js implementations use float32, unlike the JS implementation. This may skew the results (especially if you aren't on x86, where the cost is almost identical save for memory/cache usage and vectorization), however I mostly wanted to test what could be done when single precision floats were sufficient.

# How to use this

Ensure you have emscripten installed.

run `setup.sh` to install any node dependencies

run `build.sh` to build everything

run `node index.js` to run the benchmark

Note that the emscripten and and FFI implementations may benefit from `-ffast-math`, but this flag is evil and should only be used with caution.

# Findings

It appears that in this workload AssemblyScript doesn't offer any benefit over plain JS. However other workloads may benefit more. It was by far the easiest to set up.

Emscripten and the Node Addons API were more competitive in terms of performance, at least on this workload. However it's relatively easy to make WASM run out of memory and it was still noticeably slower than NAPI. And using emscripten without any other libraries was by far the most difficult to set up.

That makes the Node Addons API my favourite. It was more code than anything else here, but it was extremely straight-forward and logical. However, it may be more difficult to distribute as a package on NPM (and of course it's not an option in the browser). It was also very nice to be able to just write C++ code which receives and returns JS objects, other node FFI options appear to have a conversion step which may not be as performant or as convenient.

I will note that the Node Addons API appears to be slower on an Arm Mac compared to emscripten. I'm unsure of the cause here, I will note that this Arm mac is much more powerful than the Intel Mac where I initially tested here, and it could just be that this is no longer a sufficiently difficult benchmark to expose meaningful performance differences, as emscripten is also not as far ahead of the JS implementation as it used to be.
