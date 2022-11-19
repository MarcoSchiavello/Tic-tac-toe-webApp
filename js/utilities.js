function $(query) {
    return document.querySelector(query);
}

function $all(query) {
    return document.querySelectorAll(query);
}

function createMatrix(rows, cols, initVal = 0) {
    const newMatrix = [];

    for(let i = 0; i < rows; i++)
        newMatrix.push(Array.apply(null, Array(cols)).map(_ => initVal));
    
    return newMatrix;
}

export {
    $,
    $all,
    createMatrix
}