const randomColor = `// Using the random color getter
// return {
//     color: colors.random
// }

// Using rgba function
// accepts 3 or 4 params
// return {
//   color: rgba(Math.random()*255, Math.random()*255, Math.random()*255)
// }

// Manually
return {
  color: {
    r: Math.random()*255,
    g: Math.random()*255,
    b: Math.random()*255,
    a: 1
  }
}
`

export default randomColor;