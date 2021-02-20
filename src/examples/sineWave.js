const sineWave = `const initialY = Math.sin((cell.x + time/1000)*7)*0.5*grid.length;
const mappedY = map(initialY, -1*grid.length, grid.length, Math.ceil(grid.length*0.25), Math.ceil(grid.length*0.75));

if(cell.y > Math.ceil(mappedY)) {
  return {
    color: colors.blue
  }
}

return {
  color: colors.white
}
`

export default sineWave;