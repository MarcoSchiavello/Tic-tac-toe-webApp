class Matrix {
    #matrix;

    constructor(rows, cols, initVal = 0) {
        this.#matrix = [];
        for(let i = 0; i < rows; i++)
            this.#matrix.push(Array.apply(null, Array(cols)).map(_ => initVal));
    }

    get matrix() {
        return this.#matrix;
    }

    set matrix(matrix) {
        this.#matrix = matrix;
    }
    
    clear(initVal = 0) {
        this.#matrix = this.#matrix.map(row => row.map(_ => initVal));
    }
}

export default Matrix;