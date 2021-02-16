import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'


// import ReactDataSheet from 'react-datasheet';
// // Be sure to include styles at some point, probably during your bootstrapping
// import 'react-datasheet/lib/react-datasheet.css';

// <ReactDataSheet
//   data={grid}
//   valueRenderer={(cell, i, j) => cell.value}
//   dataRenderer={(cell, i, j) => cell.value}
//   onCellsChanged={onCellsChanged}
// />

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
)
