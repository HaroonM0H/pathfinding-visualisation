import React, { useState } from 'react';
import Grid from './Grid';
import { bfs } from '../algorithms/bfs';
import './pathfinding.css';

const gridSize = 20;
const tileSize = 22;

const algorithms = {
  BFS: bfs,
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

  const updateTile = (x, y, value) => {
    setTiles((prev) =>
      prev.map((row, i) =>
        row.map((tile, j) => (i === y && j === x ? value : tile))
      )
    );
  };

  const toggleDrawMode = () => setDrawMode((prev) => !prev);

  const runAlgorithm = () => {
    algorithms[selectedAlgorithm]({
      gridSize,
      tiles,
      setVisited,
      setPath,
      setIsAnimating,
    });
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