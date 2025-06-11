export class MathUtils {
    static dot(a, b) {
        return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
    }

    static length(a) {
        return Math.sqrt(this.dot(a, a));
    }

    static reflectRay(R, N) {
        const dotProduct = this.dot(N, R);
        const reflectedRay = [
            2 * dotProduct * N[0] - R[0],
            2 * dotProduct * N[1] - R[1],
            2 * dotProduct * N[2] - R[2]
        ];
        return reflectedRay;
    }

    static rotateVector(D, R) {
        return [
            D[0] * R[0][0] + D[1] * R[0][1] + D[2] * R[0][2],
            D[0] * R[1][0] + D[1] * R[1][1] + D[2] * R[1][2],
            D[0] * R[2][0] + D[1] * R[2][1] + D[2] * R[2][2]
        ];
    }

    static subtract(A, B) {
        return [
            A[0] - B[0],
            A[1] - B[1],
            A[2] - B[2]
        ];
    }

    static multiply3x3Matrices(A, B) {
        return [
            [A[0][0] * B[0][0] + A[0][1] * B[1][0] + A[0][2] * B[2][0], A[0][0] * B[0][1] + A[0][1] * B[1][1] + A[0][2] * B[2][1], A[0][0] * B[0][2] + A[0][1] * B[1][2] + A[0][2] * B[2][2]],
            [A[1][0] * B[0][0] + A[1][1] * B[1][0] + A[1][2] * B[2][0], A[1][0] * B[0][1] + A[1][1] * B[1][1] + A[1][2] * B[2][1], A[1][0] * B[0][2] + A[1][1] * B[1][2] + A[1][2] * B[2][2]],
            [A[2][0] * B[0][0] + A[2][1] * B[1][0] + A[2][2] * B[2][0], A[2][0] * B[0][1] + A[2][1] * B[1][1] + A[2][2] * B[2][1], A[2][0] * B[0][2] + A[2][1] * B[1][2] + A[2][2] * B[2][2]]
        ]
    }

    static createPitchMatrix(angle) {
        const c = Math.cos(angle);
        const s = Math.sin(angle);
        return [
            [1, 0, 0],
            [0, c, -s],
            [0, s, c]
        ];
    }  
    
    static createYawMatrix(angle) {
        const c = Math.cos(angle);
        const s = Math.sin(angle);
        return [
            [c, 0, s],
            [0, 1, 0],
            [-s, 0, c]
        ];
    }
}
