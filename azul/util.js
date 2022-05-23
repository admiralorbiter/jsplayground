function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
  }

const rowZero = [0, 1, 2, 3, 4];

function findCol(rowIndex, color){
    return (rowZero.indexOf(color)+rowIndex)%5;
}

  export {getRandomInt, findCol};