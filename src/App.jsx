import React, { useState, useEffect, useRef, useCallback } from 'react'
import './App.css'
import styled from 'styled-components'
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-min-noconflict/ext-language_tools";
import "ace-builds/src-noconflict/snippets/javascript";
import { Flipper, Flipped } from "react-flip-toolkit";
import useOutsideClick from './hooks/useOutsideClick';
import { GrPowerReset } from 'react-icons/gr';

const GRID_SIZE = 20;

const log = (s) => console.log(s);

// formats and used as a global function
function rgba(r,g,b,a) {
  return {
    r,
    g,
    b,
    a: a || 1
  }
}

function renderRgbaString(color){
  const { r, g, b, a } = color; 
  return `rgba(${r},${g},${b},${a})`
}

// globally available colors
const COLORS = {
  black: rgba(0,0,0),
  white: rgba(255,255,255),
  blue: rgba(0,122,255),
  green: rgba(52,199,89),
  indigo: rgba(88,86,214),
  orange: rgba(255,149,0),
  pink: rgba(255,45,85),
  purple: rgba(175,82,222),
  red: rgba(255,59,48),
  teal: rgba(90,200,250),
  yellow: rgba(255,204,0),
}

function getValidNeighborCoords(x,y) {
  const allNeighbors = {
      top: [x, y-1],
      topRight: [x+1, y-1],
      right: [x+1,y],
      bottomRight: [x+1,y+1],
      bottom: [x, y+1],
      bottomLeft: [x-1, y+1],
      left: [x-1, y],
      topLeft: [x-1, y-1]
  }
  // Only returns neighbors that are in the bounds of the grid for every cell.
  return Object.fromEntries(
          Object.entries(allNeighbors)
                  .filter(e =>
                    e[1].every(v => v > -1 && v < GRID_SIZE)
            )
        );
}

function CellModel(x = 0, y = 0) {
  return {
    x,
    y,
    // function source as a string
    source: '',
    // actual compiled function object
    func: null,
    neighborCoords: getValidNeighborCoords(x,y),
    neighbors: {},
    data: {
      color: {
        r: 255,
        g: 255,
        b: 255,
        a: 1
      }
    }
  }
}

function createGrid(size, model) {
  return [...Array(size)]
  // create the rows
  // ri = row index, maps to y values
  .map((row, ri) => Array(size) 
  // fill up with empty values
    .fill(0)
  // map each row to fill up columns
  // ci = column index, maps to x values
    .map((v, ci) => model ? 
    // if there's no cell model passed in, fill in with coordinate objects. 
    new model(ci,ri) : { x: ci, y: ri } )
  )
}

const GridWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  width: 100%;
  padding: 0;
  margin: 0;
`

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  flex: 1;
  flex-wrap: nowrap;
`

const CellWrapper = styled.div`
    display: flex;
    flex: 1;
    width: auto;
    height: auto;
    align-items: center;
    justify-content: center;
    border: 1px solid rgba(0,0,0,0.05);
    height: 100%;
    cursor: pointer;

    &:hover {
      transform: scale(1.1);
      box-shadow: 0 0 16px 0 rgba(0,0,0,0.2);
      border-color: black;
    }
`

function getCellId(cell){
  return `cell-${cell.x}-${cell.y}`
}

function Cell({ cell, onClick, isSelected }) {
  const { data } = cell;
  let color;
  if(data.hasOwnProperty("color")) {
    color = data.color;
  }
  return (
    <Flipped flipId={getCellId(cell)}>
      <CellWrapper isEdited={cell.isEdited} onClick={onClick} style={{backgroundColor: color ? renderRgbaString(color): 'transparent'}}/>
    </Flipped>
  )
}

const CellEditorPageWrapper = styled.div`
  display: flex;
  position: absolute;
  top: 0;
  left: 0;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.5);
`

const CellEditorWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
  width: 75%;
  height: 75%;
  max-height: 750px;
  max-width: 750px;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 0 16px 0 rgba(0,0,0,0.2);
`

const CellEditorHeader = styled.div`
  display: flex;
  padding: 16px;
  width: 100%;
  justify-content: space-between;
  align-items: start;
`

function CellEditor({ grid, selectedCell, isEditing, onClose, onApplyToAll, onCodeSync, isCodeSynced }) {
  const ref = useRef();
  const [x, y] = selectedCell
  const cell = grid[y][x];
  
  // TODO: set an initial value based on the base function.
  const [value, setValue] = useState(grid[y][x].source);

  useOutsideClick(ref, () => {
    isEditing && onClose(value);
  });

  return (
    <CellEditorPageWrapper isEditing={isEditing}>
        <Flipped flipId={isEditing ? getCellId(cell) : null}>
          <CellEditorWrapper ref={ref}>
            <CellEditorHeader>
              <div style={{display: 'flex', flexDirection: 'column', alignItems: 'start', justifyContent: 'center', textAlign: 'start'}}>
              <h1>{cell.x},{cell.y}</h1>
              <h4>Input: <code>grid</code>, <code>rows</code>, <code>cols</code>, <code>cells</code>, <code>cell</code>,
              <code>time</code>,
              <code>colors</code>
              </h4>
              </div>

              <div style={{display:'flex', alignItems: 'flex-end', flexDirection: 'column', textAlign: 'end', whiteSpace:'nowrap'}}>
                <span className="input-title">Sync to all cells</span>
                <input className="checkbox" onChange={onCodeSync} checked={isCodeSynced} type="checkbox"/>
              </div>

            </CellEditorHeader>
            <AceEditor
              onChange={(val) => setValue(val)}
              value={value}
              mode="javascript"
              theme="github"
              wrapEnabled
              name="cell-editor"
              fontSize={14}
              editorProps={{ $blockScrolling: false }}
              style={{width: '100%', height: '100%'}}
              enableBasicAutocompletion={true}
              enableLiveAutocompletion={true}
              enableSnippets={true}
            />
          </CellEditorWrapper>
        </Flipped>
    </CellEditorPageWrapper>
  );
}


// creates a base function for each cell, just pass in the source.
function createCellFunction(source) {
  return new Function("grid",
                      "rows",
                      "cols",
                      "cells",
                      "cell",
                      "time",
                      "colors",
                      "log",
                      "rgba",
                      "map",
                      source);
}

function map(val, in_min, in_max, out_min, out_max) {
  return (val - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

function getNeighborData(grid, x,y) {
  const cell = grid[y][x];
  return Object.fromEntries(
          Object.entries(cell.neighborCoords)
                .map(e => {
                      return {
                      name: e[0],
                      coords: e[1]
                      }
                })
                .map(o => [
                      o.name,
                      grid[o.coords[1]][o.coords[0]]]
                    )
          )
}

function useAsyncState(initialValue) {
  const [value, setValue] = useState(initialValue);
  const setter = x =>
    new Promise(resolve => {
      setValue(x);
      resolve(x);
    });
  return [value, setter];
}


function App() {
  const [grid, setGrid] = useState(()=>createGrid(GRID_SIZE, CellModel))
  const [selectedCell, setSelectedCell] = useState([0,0]);
  const [isEditing, setIsEditing] = useState(false);
  const [runCount, setRunCount] = useState(10);
  const [runsLeft, setRunsLeft] = useState(0);
  const [delayTime, setDelayTime] = useState(50);
  const [isCodeSynced, setIsCodeSynced] = useState(true);

  // Globally available values for the function to call.
  // calculated form the base grid
  const rows = [...grid]
  const cols = grid.map((_,i) => grid.map(r => r[i]))
  const cells = grid.flatMap(r => r)
  const [x,y] = selectedCell;

  function runCells() {
    // go through every cell and run its function
    // run the cells, grab the state changes
    // var t0 = performance.now()
    const updates = []
    // first filter which ones have funcs
    // then map the func outputs

    // one time for each cell run.
    const time = new Date().getTime();

    cells.forEach(cell => {
      if(cell.func !== null) {
        const { x, y, func } = cell;

        // Add a random color to each cell.
        const colors = {
          ...COLORS,
          random: rgba(Math.random()*255,
                       Math.random()*255,
                       Math.random()*255)
        };

        const output = func(grid, rows, cols, cells, cell, time, colors, log, rgba, map);

        //provide defaults while destructuring
        if (output &&
            output.constructor === Object) {
              const newCell = {
                ...cell,
                data: output
              }
              updates.push(newCell);
        }
      }
    })
    
    // once you grab all the changes, set the new state of the grid.
    if(updates.length > 0) {
      const newGrid = [...grid];    
      
      // after each cell is updated, go and update its neighbors data
      updates.forEach(uCell => {

        const neighbors = getNeighborData(grid, uCell.x,uCell.y);
        newGrid[uCell.y][uCell.x] = {
          ...uCell,
          neighbors: neighbors
        }
      })
      return newGrid;
    }

    return grid;
  }

  React.useEffect( () => {

    // validate the parameters
    // const intRun = parseInt(runCount);
    // const intDelay = parseInt(delayTime);
    // const validDelay = !Number.isNaN(intDelay) ? intDelay : 1;
    // if(!Number.isNaN(intRun) && intRun <= 1000 && validDelay) {

    function start(counter){
      // if the current runs left is still less 
      if(counter < runCount){
        setTimeout(function(){
          setGrid(runCells())
          setRunsLeft(counter+1)
        }, delayTime);
      }
    }
    start(runsLeft);
  },[runsLeft]);

  return (
    <Flipper flipKey={isEditing}>
    <div className="App">
      
      <div style={{display: 'flex', width: '100%', alignItems: 'center', justifyContent: 'center', padding: '8px' }}>

      <button
        className="run-button"
        onClick={()=>setRunsLeft(1)}>
        Run
      </button>
      

        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '8px' }}>
          <span className="input-title">Repeat</span>
          <input className="run-time" placeholder="1" value={runCount} onChange={(e)=> setRunCount(e.target.value)}/>
        </div>

        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '8px' }}>
          <span className="input-title">Delay (ms)</span>
          <input className="run-time" placeholder="1" value={delayTime} onChange={(e)=> setDelayTime(e.target.value)}/>
        </div>

        <button
          className="reset"
          onClick={()=>setGrid(createGrid(GRID_SIZE, CellModel))}>
            <GrPowerReset/>
        </button>

      </div>
      <GridWrapper>
        {
          grid.map((row, ri) => 
            <Row key={`row-${ri}`}>{
              row.map((cell, ci) =>  
                  <Cell
                    key={`cell-${ci}`}
                    onClick={()=>{
                      setIsEditing(true);
                      setSelectedCell([cell.x, cell.y]);
                    }}
                    cell={cell}
                  />
              )
            }
            </Row>
          )
        }
        </GridWrapper>
        {
          isEditing && (
          <CellEditor
            isEditing={isEditing}
            grid={grid}
            selectedCell={selectedCell}
            onCodeSync={(e) => setIsCodeSynced(e.target.checked)}
            isCodeSynced={isCodeSynced}
            // you can't presend the neighbor data. you need to grab it from the grid at runtime to get the latest data and do the calculation.
            onClose={(value)=> {
                setIsEditing(false);
                if(isCodeSynced) {
                  // set the same function everywhere if its synced
                  const newGrid = grid.map(r =>
                                    r.map(c => { 
                                      return {
                                        ...c,
                                        source: value,
                                        func: createCellFunction(value),
                                      }
                                    })
                                  );
                  setGrid(newGrid);
                } else {
                  // only apply to that cell
                  const newGrid = [...grid];
                  const [x, y] = selectedCell;

                  newGrid[y][x].source = value;
                  newGrid[y][x].func = createCellFunction(value);
                  setGrid(newGrid)
                }
              }
            }/>
          )
        }
     
    </div>
    </Flipper>
  )
}

export default App
