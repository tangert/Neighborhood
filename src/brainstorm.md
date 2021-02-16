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
