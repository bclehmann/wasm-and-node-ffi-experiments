import { naiveMatrixMultiplication as naiveMatrixMultiplicationAssemblyScript } from './assembly-script/build/release.js';
import * as emscriptenModule from './emscripten/a.out.js';
import * as ffi from './ffi/lib/binding.js';

const naiveMatrixMultiplicationFfi = ffi.default;

function mallocAndAssignMatrices(matrices) {
    return matrices.map(matrix => {
        const ptr = emscriptenModule.default._malloc(matrix.length * Float32Array.BYTES_PER_ELEMENT)
        emscriptenModule.default.HEAPF32.set(matrix, ptr / Float32Array.BYTES_PER_ELEMENT);
        return ptr;
    });
}

function freeMatrices(matrices) {
    matrices.forEach(ptr => emscriptenModule.default._free(ptr));
}

function naiveMatrixMultiplicationEmscripten(a, b, c, n, m, p) {
    emscriptenModule.default.ccall('naiveMatrixMultiplication', 'void', ['number', 'number', 'number', 'number', 'number', 'number'], [a, b, c, n, m, p]);
}

function getIndex(i, j, m, n) {
	return i * n + j;
}

export function naiveMatrixMultiplication(a, b, n, m, p) {
	let c = Array(n * p).fill(0);
	for (let i = 0; i < n; i++) {
		for (let j = 0; j < p; j++) {
			let sum = 0;
			for (let k = 0; k < m; k++) {
				sum += a[getIndex(i, k, n, m)] * b[getIndex(k, j, m, p)];
			}
			c[getIndex(i, j, n, p)] = sum;
		}
	}
	
	return c;
}

function assemblyScriptFib(nth) {
    const start = performance.now();
    const A = new Float32Array([1, 1, 1, 0]);
    let B = new Float32Array([1, 0]); 
    const [m, n, p] = [2, 2, 1];
    for (let i = 0; i < nth - 1; i++) {
        B = naiveMatrixMultiplicationAssemblyScript(A, B, n, m, p);
    }

    const end = performance.now();
    console.log(B);
    console.log(`AssemblyScript fib(${nth}): Execution time: ${end - start} ms`);
}

function emscriptenFib(nth) {
    const start = performance.now();

    const A = [1, 1, 1, 0];
    const B = [1, 0];
    const C = [0, 0];
    const [a_ptr, b_ptr, c_ptr] = mallocAndAssignMatrices([A, B, C]);

    const [m, n, p] = [2, 2, 1];

    for (let i = 0; i < nth - 1; i++) {
        naiveMatrixMultiplicationEmscripten(a_ptr, b_ptr, c_ptr, n, m, p);
        
        emscriptenModule.default.HEAPF32.set(emscriptenModule.default.HEAPF32.subarray(c_ptr / Float32Array.BYTES_PER_ELEMENT, (c_ptr + C.length * Float32Array.BYTES_PER_ELEMENT) / Float32Array.BYTES_PER_ELEMENT), b_ptr / Float32Array.BYTES_PER_ELEMENT);
    }

    const result = emscriptenModule.default.HEAPF32.subarray(b_ptr / Float32Array.BYTES_PER_ELEMENT, b_ptr / Float32Array.BYTES_PER_ELEMENT + B.length);
    freeMatrices([a_ptr, b_ptr, c_ptr]);
    const end = performance.now();
    console.log(result);
    console.log(`Emscripten fib(${nth}): Execution time: ${end - start} ms`);
}

function jsFib(nth) {
    const start = performance.now();
    const A = [1, 1, 1, 0];
    let B = [1, 0];
    const [m, n, p] = [2, 2, 1];
    for (let i = 0; i < nth - 1; i++) {
        B = naiveMatrixMultiplication(A, B, n, m, p);
    }

    const end = performance.now();
    console.log(B);
    console.log(`JS fib(${nth}): Execution time: ${end - start} ms`);
}

function ffiFib(nth) {
    const start = performance.now();
    const A = new Float32Array([1, 1, 1, 0]);
    let B = new Float32Array([1, 0]);
    const [m, n, p] = [2, 2, 1];
    for (let i = 0; i < nth - 1; i++) {
        B = naiveMatrixMultiplicationFfi(A, B, n, m, p);
    }
    const end = performance.now();
    console.log(B);
    console.log(`FFI fib(${nth}): Execution time: ${end - start} ms`);
}

function getSquareMatrix(N) {
    const A = Array.from({ length: N * N }, () => Math.random());
    const B = Array.from({ length: N * N }, () => Math.random());

    return { A, B }
}

function squareMatrixAssemblyScript(N) {
    const { A: aarr, B: barr } = getSquareMatrix(N);
    const a = new Float32Array(aarr);
    const b = new Float32Array(barr);
    const start = performance.now();
    const c = naiveMatrixMultiplicationAssemblyScript(a, b, N, N, N);
    const end = performance.now();
    console.log(`AssemblyScript square matrix multiplication (${N}x${N}): Execution time: ${end - start} ms`);
}

function squareMatrixJS(N) {
    const { A, B} = getSquareMatrix(N);
    const start = performance.now();
    const c = naiveMatrixMultiplicationAssemblyScript(A, B, N, N, N);
    const end = performance.now();
    console.log(`JS square matrix multiplication (${N}x${N}): Execution time: ${end - start} ms`);
}

function squareMatrixEmscripten(N) {
    const { A, B } = getSquareMatrix(N);
    const C = Array(N * N).fill(0);
    const [a_ptr, b_ptr, c_ptr] = mallocAndAssignMatrices([A, B, C]);

    const start = performance.now();
    const c = naiveMatrixMultiplicationEmscripten(a_ptr, b_ptr, c_ptr, N, N, N);

    freeMatrices([a_ptr, b_ptr, c_ptr]);
    const end = performance.now();
    console.log(`Emscripten square matrix multiplication (${N}x${N}): Execution time: ${end - start} ms`);
}

function squareMatrixFfi(N) {
    const { A: aarr, B: barr } = getSquareMatrix(N);
    const A = new Float32Array(aarr);
    const B = new Float32Array(barr);

    const start = performance.now();
    const c = naiveMatrixMultiplicationFfi(A, B, N, N, N);
    const end = performance.now();
    console.log(`FFI square matrix multiplication (${N}x${N}): Execution time: ${end - start} ms`);
}

console.log('Fibonacci Tests:');
console.log('------------------');

// NOTE: Past fib(36) the f32 variants will lose enough precision that they are wrong when rounded to integers
// Still, I want to test iterated small matrix multiplication, so its a fine benchmark
for (let i = 0; i < 100; i++) {
    assemblyScriptFib(i);
    jsFib(i);
    emscriptenFib(i);
    ffiFib(i);
    console.log('---');
}

console.log('Square Matrix Multiplication Tests:');
console.log('-----------------------------------');

for (const i of [10, 50, 100, 200, 500, 1000]) {
    squareMatrixAssemblyScript(i);
    squareMatrixJS(i);
    squareMatrixEmscripten(i);
    squareMatrixFfi(i);
    console.log('---');
}
