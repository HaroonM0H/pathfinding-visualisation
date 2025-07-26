import React, { useRef, useEffect } from 'react';

const Grid = ({
  gridSize,
  tileSize,
  tiles,
  visited,
  path,
  onTileUpdate,
  isDrawing,
  setIsDrawing,
  drawMode,
  isAnimating,
}) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        if (i === 0 && j === 0) ctx.fillStyle = '#ff5252';
        else if (i === gridSize - 1 && j === gridSize - 1) ctx.fillStyle = '#27ae60';
        else if (path.some(([y, x]) => y === i && x === j)) ctx.fillStyle = '#a259fa';
        else if (visited.some(([y, x]) => y === i && x === j)) ctx.fillStyle = '#ffe066';
        else if (tiles[i][j]) ctx.fillStyle = '#61dafb';
        else ctx.fillStyle = '#f5f5f5';

        ctx.fillRect(j * tileSize, i * tileSize, tileSize, tileSize);
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(j * tileSize, i * tileSize, tileSize, tileSize);
      }
    }
  }, [tiles, visited, path, gridSize, tileSize]);

  const getTileCoords = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / tileSize);
    const y = Math.floor((e.clientY - rect.top) / tileSize);
    if (x >= 0 && x < gridSize && y >= 0 && y < gridSize) return { x, y };
    return null;
  };

  const handleMouseDown = (e) => {
    if (isAnimating) return;
    const coords = getTileCoords(e);
    if (!coords) return;
    if ((coords.x === 0 && coords.y === 0) || (coords.x === gridSize - 1 && coords.y === gridSize - 1)) return;
    setIsDrawing(true);
    onTileUpdate(coords.x, coords.y, drawMode);
  };

  const handleMouseUp = () => setIsDrawing(false);

  const handleMouseMove = (e) => {
    if (!isDrawing || isAnimating) return;
    const coords = getTileCoords(e);
    if (!coords) return;
    if ((coords.x === 0 && coords.y === 0) || (coords.x === gridSize - 1 && coords.y === gridSize - 1)) return;
    onTileUpdate(coords.x, coords.y, drawMode);
  };

  return (
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
  );
};

export default Grid;