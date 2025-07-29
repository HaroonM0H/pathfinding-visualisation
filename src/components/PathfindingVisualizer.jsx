import React, { useState, useRef } from 'react';
import Grid from './Grid';
import { bfs } from '../algorithms/bfs';
import { dfs } from '../algorithms/dfs';
import { dijkstra } from '../algorithms/dijkstra';
import './pathfinding.css';

const gridSize = 20;
const tileSize = 22;

const algorithms = {
  BFS: bfs,
  DFS: dfs,
  Dijkstra: dijkstra,
  // Add more algorithms here
};

function PathfindingVisualizer() {
  const [tiles, setTiles] = useState(
    Array(gridSize).fill(null).map(() => Array(gridSize).fill(false))
  );
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawMode, setDrawMode] = useState(true);
  const [visited, setVisited] = useState([]);
  const [path, setPath] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('BFS');
  const [timer, setTimer] = useState(0);
  const timerRef = useRef(null);
  const [noSolution, setNoSolution] = useState(false);

  const updateTile = (x, y, value) => {
    setTiles((prev) =>
      prev.map((row, i) =>
        row.map((tile, j) => (i === y && j === x ? value : tile))
      )
    );
  };

  const toggleDrawMode = () => setDrawMode((prev) => !prev);

  const runAlgorithm = async () => {
    setNoSolution(false);
    setTimer(0);

    const start = performance.now();
    timerRef.current = setInterval(() => {
      setTimer(((performance.now() - start) / 1000).toFixed(2));
    }, 100);

    await algorithms[selectedAlgorithm]({
      gridSize,
      tiles,
      setVisited,
      setPath,
      setIsAnimating,
      setNoSolution,
    });

    // Stop timer and set final time
    clearInterval(timerRef.current);
    setTimer(((performance.now() - start) / 1000).toFixed(2));
  };

  const resetGrid = () => {
    setTiles(Array(gridSize).fill(null).map(() => Array(gridSize).fill(false)));
    setVisited([]);
    setPath([]);
    setIsAnimating(false);
  };

  return (
    <div className="pfv-root">
      <h1 className="pfv-title">Pathfinding Visualisation</h1>
      <div className="pfv-main-row">
        <div className="pfv-controls">
          <select
            value={selectedAlgorithm}
            onChange={(e) => setSelectedAlgorithm(e.target.value)}
            disabled={isAnimating}
            className="pfv-select"
          >
            {Object.keys(algorithms).map((alg) => (
              <option key={alg} value={alg}>{alg}</option>
            ))}
          </select>
          <button
            className={`pfv-btn ${drawMode ? 'draw' : 'erase'}`}
            onClick={toggleDrawMode}
            disabled={isAnimating}
          >
            {drawMode ? 'Draw Walls' : 'Erase Walls'}
          </button>
          <button
            className="pfv-btn start"
            onClick={runAlgorithm}
            disabled={isAnimating}
          >
            {isAnimating ? 'Running...' : 'Start'}
          </button>
          <button
            className="pfv-btn reset"
            onClick={resetGrid}
            disabled={isAnimating}
          >
            Reset Grid
          </button>
          <div style={{ marginTop: 20, fontWeight: 'bold', fontSize: '1.1rem' }}>
            Time: {timer}s
          </div>
          {noSolution && (
            <div style={{ color: '#ff5252', fontWeight: 'bold', marginTop: 8 }}>
              No solution found!
            </div>
          )}
        </div>
        <div className="pfv-grid-container">
          <Grid
            gridSize={gridSize}
            tileSize={tileSize}
            tiles={tiles}
            visited={visited}
            path={path}
            onTileUpdate={updateTile}
            isDrawing={isDrawing}
            setIsDrawing={setIsDrawing}
            drawMode={drawMode}
            isAnimating={isAnimating}
          />
        </div>
      </div>
    </div>
  );
}

export default PathfindingVisualizer;