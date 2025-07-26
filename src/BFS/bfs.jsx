import React, { useRef, useEffect, useState } from 'react';
import './bfs.css';

const gridSize = 20;
const tileSize = 35;

function BFS() {
  const canvasRef = useRef(null);
  const [tiles, setTiles] = useState(
    Array(gridSize)
      .fill(null)
      .map(() => Array(gridSize).fill(false))
  );
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawMode, setDrawMode] = useState(true); 

  // Draw grid and tiles
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        ctx.fillStyle = tiles[i][j] ? '#61dafb' : '#f5f5f5';
        ctx.fillRect(j * tileSize, i * tileSize, tileSize, tileSize);
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(j * tileSize, i * tileSize, tileSize, tileSize);
      }
    }
  }, [tiles]);

  // Get tile from mouse position
  const getTileCoords = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / tileSize);
    const y = Math.floor((e.clientY - rect.top) / tileSize);
    if (x >= 0 && x < gridSize && y >= 0 && y < gridSize) {
      return { x, y };
    }
    return null;
  };

  // Mouse events
  const handleMouseDown = (e) => {
    const coords = getTileCoords(e);
    if (!coords) return;
    setIsDrawing(true);
    updateTile(coords.x, coords.y, drawMode);
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  const handleMouseMove = (e) => {
    if (!isDrawing) return;
    const coords = getTileCoords(e);
    if (!coords) return;
    updateTile(coords.x, coords.y, drawMode);
  };

  // Update tile state
  const updateTile = (x, y, value) => {
    setTiles((prev) =>
      prev.map((row, i) =>
        row.map((tile, j) => (i === y && j === x ? value : tile))
      )
    );
  };

  // Toggle draw/erase mode
  const toggleDrawMode = () => setDrawMode((prev) => !prev);

  return (
    <div className="bfs">
      <h1>Pathfinding Visualisation - BFS (Canvas)</h1>
      <div className="bfs-content">
        <button
          className={`draw-erase-btn ${drawMode ? 'draw' : 'erase'}`}
          onClick={toggleDrawMode}
        >
          {drawMode ? 'Draw Mode (Click to Erase)' : 'Erase Mode (Click to Draw)'}
        </button>
        <canvas
          ref={canvasRef}
          width={gridSize * tileSize}
          height={gridSize * tileSize}
          className="bfs-canvas"
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onMouseMove={handleMouseMove}
        />
      </div>
    </div>
  );
}

export default BFS;