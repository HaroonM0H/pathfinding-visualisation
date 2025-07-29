export async function dijkstra({ gridSize, tiles, setVisited, setPath, setIsAnimating, setNoSolution }) {
  setIsAnimating(true);
  setVisited([]);
  setPath([]);
  if (setNoSolution) setNoSolution(false);

  const distances = Array(gridSize).fill(null).map(() => Array(gridSize).fill(Infinity));
  const visitedSet = Array(gridSize).fill(null).map(() => Array(gridSize).fill(false));
  const prev = Array(gridSize).fill(null).map(() => Array(gridSize).fill(null));
  distances[0][0] = 0;

  const queue = [[0, [0, 0]]];

  while (queue.length > 0) {
    // Sort by distance to get minimum
    queue.sort((a, b) => a[0] - b[0]);
    const [distance, [y, x]] = queue.shift();

    if (visitedSet[y][x]) continue;
    visitedSet[y][x] = true;
    setVisited(v => [...v, [y, x]]);
    await new Promise(res => setTimeout(res, 15));

    if (y === gridSize - 1 && x === gridSize - 1) {
      let curr = [y, x], pathArr = [];
      while (curr) {
        pathArr.push(curr);
        curr = prev[curr[0]][curr[1]];
      }
      setPath(pathArr.reverse());
      setIsAnimating(false);
      return;
    }

    [[0,1],[1,0],[0,-1],[-1,0]].forEach(([dy, dx]) => {
      const ny = y + dy, nx = x + dx;
      if (ny >= 0 && ny < gridSize && nx >= 0 && nx < gridSize && !visitedSet[ny][nx] && !tiles[ny][nx]) {
        const newDist = distance + 1;  // Using 1 as weight for all edges
        if (newDist < distances[ny][nx]) {
          distances[ny][nx] = newDist;
          prev[ny][nx] = [y, x];
          queue.push([newDist, [ny, nx]]);
        }
      }
    });
  }

  setIsAnimating(false);
  if (setNoSolution) setNoSolution(true);
}