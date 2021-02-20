const gameOfLife = `// FIRST, give each cell a random isAlive value to populate the board
const isAlive = Math.random() < 0.5;
return {
    isAlive,
    color: isAlive ? colors.black : colors.white
}

// THEN, run this logic below for the cells to respond to each other
// const liveNeighbors = Object.entries(cell.neighbors).filter(([_, n]) => n.data.isAlive);

// let isAlive = false;

// if(cell.data.isAlive &&
//   liveNeighbors.length === 2 ||
//   liveNeighbors.length === 3) {
// 	isAlive = true
// } else if(!cell.data.isAlive &&
//            liveNeighbors.length === 3) {
// 	isAlive = true
// }

// // Return a filled cell if it's alive!
// return {
//     isAlive,
//     color: isAlive ? colors.black : colors.white
// }
`

export default gameOfLife;