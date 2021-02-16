Visual pixel spreadsheet

You can query cells through:
1. Single coordinates (x,y)
2. By references to direction ( special keywords named left, right, top, bottom, topRight, topLeft), etc
3. Rows, columns
4. Can filter and map over row and column selections

Every cell has an input, which contains:
1. Global time
2. The output of a query of cells

Every cell has a function that can perform an arbitrary calculation

Every cell can output an object with metadata, one property of which must be its color. 

Using this method for querying cells for input, performing arbitrary calculation, and outputting a data object and color, you can visualize and nearly anything



// Any live cell with fewer than two live neighbours dies, as if by underpopulation.
// Any live cell with two or three live neighbours lives on to the next generation.
// Any live cell with more than three live neighbours dies, as if by overpopulation.
// Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.

// default to dead
let isAlive = false;
const liveNeighborCount = cell.neighbors.filter(n => n.isAlive);

if(cell.isAlive && (liveNeighborCount === 2 || liveNeighborCount === 3)) {
	isAlive = true
} else if(!cell.isAlive && liveNeighborCount === 3) {
	isAlive = true
}