// Returns all nodes in the order in which they were visited.
// Make nodes point back to their previous node so that we can compute the shortest path
// by backtracking from the finish node.

export async function dfs({ gridSize, tiles, setVisited, setPath, setIsAnimating, setNoSolution }) {
  setIsAnimating(true);
  setVisited([]);
  setPath([]);
  if (setNoSolution) setNoSolution(false);

  const stack = [[0, 0]];
  const visitedSet = Array(gridSize).fill(null).map(() => Array(gridSize).fill(false));
  const prev = Array(gridSize).fill(null).map(() => Array(gridSize).fill(null));

  while (stack.length > 0) {
    const [y, x] = stack.pop();
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
        stack.push([ny, nx]);
        if (!prev[ny][nx]) prev[ny][nx] = [y, x];
      }
    });
  }
  
  setIsAnimating(false);
  if (setNoSolution) setNoSolution(true);
}