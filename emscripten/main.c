#include <stdio.h>

#define getIndex(i, j, m, n) ((i) * (n) + (j))

extern void naiveMatrixMultiplication(float* a, float* b, float* c, int n, int m, int p) {
	for (int i = 0; i < n; i++) {
		for (int j = 0; j < p; j++) {
			float sum = 0.0f;
			for (int k = 0; k < m; k++) {
				sum += a[getIndex(i, k, n, m)] * b[getIndex(k, j, m, p)];
			}
			c[getIndex(i, j, n, p)] = sum;
		}
	}
}
