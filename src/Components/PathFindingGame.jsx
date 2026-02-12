import React, { useState, useEffect } from "react";

const SIZE = 15;

export default function App() {
  const [grid, setGrid] = useState([]);

  useEffect(() => {
    createGrid();
  }, []);

  const createGrid = () => {
    const newGrid = [];
    for (let r = 0; r < SIZE; r++) {
      const row = [];
      for (let c = 0; c < SIZE; c++) {
        row.push({
          row: r,
          col: c,
          type: "empty",
          visited: false,
          previous: null,
        });
      }
      newGrid.push(row);
    }

    newGrid[0][0].type = "start";
    newGrid[SIZE - 1][SIZE - 1].type = "end";

    setGrid(newGrid);
  };

  const toggleWall = (row, col) => {
    const newGrid = [...grid];
    const node = newGrid[row][col];

    if (node.type === "start" || node.type === "end") return;

    node.type = node.type === "wall" ? "empty" : "wall";
    setGrid(newGrid);
  };

  const findPath = () => {
    const newGrid = grid.map(row =>
      row.map(node => ({
        ...node,
        visited: false,
        previous: null,
        type:
          node.type === "path" ? "empty" : node.type,
      }))
    );

    const queue = [];
    const start = newGrid[0][0];
    const end = newGrid[SIZE - 1][SIZE - 1];

    queue.push(start);

    while (queue.length > 0) {
      const current = queue.shift();
      current.visited = true;

      if (current === end) break;

      const neighbors = getNeighbors(current, newGrid);

      for (let neighbor of neighbors) {
        if (!neighbor.visited && neighbor.type !== "wall") {
          neighbor.visited = true;
          neighbor.previous = current;
          queue.push(neighbor);
        }
      }
    }

    // Build shortest path
    let current = end;
    while (current.previous) {
      if (current.type !== "end")
        current.type = "path";
      current = current.previous;
    }

    setGrid(newGrid);
  };

  const getNeighbors = (node, grid) => {
    const { row, col } = node;
    const neighbors = [];

    if (row > 0) neighbors.push(grid[row - 1][col]);
    if (row < SIZE - 1) neighbors.push(grid[row + 1][col]);
    if (col > 0) neighbors.push(grid[row][col - 1]);
    if (col < SIZE - 1) neighbors.push(grid[row][col + 1]);

    return neighbors;
  };

  const getColor = (type) => {
    switch (type) {
      case "start":
        return "bg-green-500";
      case "end":
        return "bg-red-500";
      case "wall":
        return "bg-gray-800";
      case "path":
        return "bg-yellow-400";
      default:
        return "bg-white";
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center p-6 text-white">
      <h1 className="text-2xl font-bold mb-4">
        Easy Pathfinding Game
      </h1>

      <button
        onClick={findPath}
        className="mb-4 px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
      >
        Find Path
      </button>

      <button
        onClick={createGrid}
        className="mb-6 px-4 py-2 bg-yellow-500 text-black rounded hover:bg-yellow-400"
      >
        Reset
      </button>

      <div
        className="grid"
        style={{
          gridTemplateColumns: `repeat(${SIZE}, 30px)`,
        }}
      >
        {grid.map((row, r) =>
          row.map((node, c) => (
            <div
              key={`${r}-${c}`}
              onClick={() => toggleWall(r, c)}
              className={`w-7 h-7 border border-gray-400 cursor-pointer ${getColor(
                node.type
              )}`}
            />
          ))
        )}
      </div>

      <p className="mt-4 text-sm text-gray-300">
        Click cells to create walls. Green → Start, Red → End.
      </p>
    </div>
  );
}