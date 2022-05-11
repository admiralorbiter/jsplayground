function range(start, end, step=1) {
    const array = [];
    for(let i = start; i <= end; i += step) {
        array.push(i);
    }
    return array;
}

function sum(array) {
    let sum = 0;
    for(let i = 0; i < array.length; i++) {
        sum += array[i];
    }
    return sum;
}

console.log(sum(range(1, 10)));