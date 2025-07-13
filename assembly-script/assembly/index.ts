
// Row major for m x n matrix
@inline
function getIndex(i: u32, j: u32, m: u32, n: u32): u32 {
	return i * n + j;
}

// A is n x m, B is m x p, C is n x p
export function naiveMatrixMultiplication(a: Float32Array, b: Float32Array, n: u32, m: u32, p: u32): Float32Array {
	let c = new Float32Array(n * p);
	for (let i: u32 = 0; i < n; i++) {
		for (let j: u32 = 0; j < p; j++) {
			let sum: f32 = 0;
			for (let k: u32 = 0; k < m; k++) {
				sum += unchecked(a[getIndex(i, k, n, m)]) * unchecked(b[getIndex(k, j, m, p)]);
			}
			unchecked(c[getIndex(i, j, n, p)] = sum);
		}
	}
	
	return c;
}

