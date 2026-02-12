import React, { useState, useEffect } from "react";

const GRID_SIZE = 4; 

export default function VisualMemory() {
  const [level, setLevel] = useState(1);
  const [grid, setGrid] = useState([]);
  const [showPattern, setShowPattern] = useState(false);
  const [selected, setSelected] = useState([]);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    startLevel();
  }, [level]);

  const startLevel = () => {
    const totalCells = GRID_SIZE * GRID_SIZE;
    const patternCount = level + 2; 
    const randomIndexes = [];

    while (randomIndexes.length < patternCount) {
      const rand = Math.floor(Math.random() * totalCells);
      if (!randomIndexes.includes(rand)) {
        randomIndexes.push(rand);
      }
    }

    setGrid(randomIndexes);
    setSelected([]);
    setShowPattern(true);

    setTimeout(() => {
      setShowPattern(false);
    }, 1000);
  };

  const handleClick = (index) => {
    if (showPattern || gameOver) return;

    if (grid.includes(index)) {
      if (!selected.includes(index)) {
        const newSelected = [...selected, index];
        setSelected(newSelected);

        if (newSelected.length === grid.length) {
          setTimeout(() => {
            setLevel(level + 1);
          }, 500);
        }
      }
    } else {
      setGameOver(true);
    }
  };

  const resetGame = () => {
    setLevel(1);
    setGameOver(false);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-4">🧠 Visual Memory Game</h1>

      <p className="mb-4 text-lg">Level: {level}</p>

      {gameOver && (
        <div className="mb-4 text-center">
          <p className="text-red-400 text-xl mb-2">Game Over!</p>
          <button
            onClick={resetGame}
            className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
          >
            Restart
          </button>
        </div>
      )}

      <div
        className="grid gap-3"
        style={{
          gridTemplateColumns: `repeat(${GRID_SIZE}, 70px)`,
        }}
      >
        {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, index) => {
          const isPattern = grid.includes(index);
          const isSelected = selected.includes(index);

          return (
            <div
              key={index}
              onClick={() => handleClick(index)}
              className={`w-16 h-16 rounded-lg cursor-pointer transition-all duration-200
              ${
                showPattern && isPattern
                  ? "bg-green-500"
                  : isSelected
                  ? "bg-blue-500"
                  : "bg-gray-300"
              }
              ${!showPattern && !gameOver ? "hover:scale-105" : ""}
              `}
            />
          );
        })}
      </div>
    </div>
  );
}