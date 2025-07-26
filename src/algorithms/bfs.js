export async function bfs({ gridSize, tiles, setVisited, setPath, setIsAnimating }) {
  setIsAnimating(true);
  setVisited([]);
  setPath([]);
  const queue = [[0, 0]];
  const visitedSet = Array(gridSize).fill(null).map(() => Array(gridSize).fill(false));
  const prev = Array(gridSize).fill(null).map(() => Array(gridSize).fill(null));
  visitedSet[0][0] = true;

  while (queue.length > 0) {
    const [y, x] = queue.shift();
    setVisited((v) => [...v, [y, x]]);
    await new Promise((res) => setTimeout(res, 15));

    if (y === gridSize - 1 && x === gridSize - 1) {
      const pathArr = [];
      let curr = [y, x];
      while (curr) {
        pathArr.push(curr);
        curr = prev[curr[0]][curr[1]];
      }
      setPath(pathArr.reverse());
      setIsAnimating(false);
      return;
    }

    for (const [dy, dx] of [[0,1],[1,0],[0,-1],[-1,0]]) {
      const ny = y + dy, nx = x + dx;
      if (
        ny >= 0 && ny < gridSize &&
        nx >= 0 && nx < gridSize &&
        !visitedSet[ny][nx] &&
        !tiles[ny][nx]
      ) {
        queue.push([ny, nx]);
        visitedSet[ny][nx] = true;
        prev[ny][nx] = [y, x];
      }
    }
  }
  setIsAnimating(false);
}