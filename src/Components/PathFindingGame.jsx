import React, { useState } from "react";

const SIZE = 7;

// 🧩 sample puzzle (like your image)
const initialGrid = [
  [0,0,0,0,0,0,0],
  [0,10,15,16,8,9,0],
  [0,11,0,0,0,4,0],
  [0,14,0,0,0,3,0],
  [0,13,0,0,0,5,0],
  [0,12,7,1,2,6,0],
  [0,0,0,0,0,0,0],
];

export default function NumberPathPuzzle() {
  const [path, setPath] = useState([]);
  const [currentNumber, setCurrentNumber] = useState(1);
  const [isDrawing, setIsDrawing] = useState(false);

  const isAdjacent = (r1, c1, r2, c2) => {
    const dx = Math.abs(r1 - r2);
    const dy = Math.abs(c1 - c2);
    return dx + dy === 1;
  };

  const handleMouseDown = (row, col, value) => {
    if (value === 1) {
      setIsDrawing(true);
      setPath([{ row, col }]);
      setCurrentNumber(1);
    }
  };

  const handleMouseEnter = (row, col, value) => {
    if (!isDrawing) return;

    const last = path[path.length - 1];

    if (!isAdjacent(last.row, last.col, row, col)) return;

    // next number OR empty
    if (value !== 0 && value !== currentNumber + 1) return;

    // prevent reuse
    if (path.some(p => p.row === row && p.col === col)) return;

    setPath([...path, { row, col }]);

    if (value === currentNumber + 1) {
      setCurrentNumber(currentNumber + 1);
    }
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  const isInPath = (row, col) => {
    return path.some(p => p.row === row && p.col === col);
  };

  return (
    <div
      className="min-h-screen bg-gray-100 flex items-center justify-center"
      onMouseUp={handleMouseUp}
    >
      <div className="grid grid-cols-7 gap-1 bg-white p-4 rounded-2xl">
        {initialGrid.map((row, r) =>
          row.map((cell, c) => (
            <div
              key={`${r}-${c}`}
              onMouseDown={() => handleMouseDown(r, c, cell)}
              onMouseEnter={() => handleMouseEnter(r, c, cell)}
              className={`
                w-12 h-12 flex items-center justify-center
                border rounded-lg cursor-pointer
                ${isInPath(r,c) ? "bg-orange-400" : "bg-gray-200"}
              `}
            >
              {cell !== 0 && (
                <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm font-bold">
                  {cell}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}