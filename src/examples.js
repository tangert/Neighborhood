/*
populate with random values
const isAlive = Math.random() < 0.5;
const color = isAlive ? {
    r: 0,
    g: 0,
    b: 0,
    a: 1
} : {
    r: 255,
    g: 255,
    b: 255,
    a: 1
}

return {
    isAlive,
    color
}
*/

/*
run the simulation

const neighborArr = Object.entries(cell.neighbors).map(e => e[1])
const neighborData = neighborArr.map(n => grid[n[1]][n[0]]);

const liveNeighborCount = neighborData.filter(n => n.data.isAlive).length;

let isAlive = false;

if(cell.data.isAlive && (liveNeighborCount === 2 || liveNeighborCount === 3)) {
	isAlive = true
} else if(!cell.data.isAlive && liveNeighborCount === 3) {
	isAlive = true
}

const color = isAlive ? {
    r: 0,
    g: 0,
    b: 0,
    a: 1
} : {
    r: 255,
    g: 255,
    b: 255,
    a: 1
}

return {
    isAlive,
    color
}

*/