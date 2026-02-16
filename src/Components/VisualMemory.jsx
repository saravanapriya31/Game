
import React, { useState, useEffect } from "react";

const GRID_SIZE = 4; 

export default function VisualMemory({ onComplete, initialLevel = 1 }) {
  const [level, setLevel] = useState(initialLevel);
  const [grid, setGrid] = useState([]);
  const [showPattern, setShowPattern] = useState(false);
  const [selected, setSelected] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    startLevel();
  }, [level]);

  const startLevel = () => {
    const totalCells = GRID_SIZE * GRID_SIZE;
    const patternCount = level + 2; // Level 1 = 3 cells, Level 2 = 4 cells, etc.
    const randomIndexes = [];

    while (randomIndexes.length < patternCount) {
      const rand = Math.floor(Math.random() * totalCells);
      if (!randomIndexes.includes(rand)) {
        randomIndexes.push(rand);
      }
    }

    setGrid(randomIndexes);
    setSelected([]);
    setCompleted(false);
    setGameOver(false);
    setShowPattern(true);

    // Hide the pattern after 2 seconds
    setTimeout(() => {
      setShowPattern(false);
    }, 2000);
  };

  const handleClick = (index) => {
    if (showPattern || gameOver || completed) return;

    if (grid.includes(index)) {
      if (!selected.includes(index)) {
        const newSelected = [...selected, index];
        setSelected(newSelected);

        if (newSelected.length === grid.length) {
          setCompleted(true);
          
          // Start countdown
          let count = 3;
          setCountdown(count);
          
          const timer = setInterval(() => {
            count -= 1;
            setCountdown(count);
            
            if (count === 0) {
              clearInterval(timer);
              // Pass the current level to onComplete and auto-play
              onComplete?.(level, true); // true indicates auto-play
            }
          }, 1000);
        }
      }
    } else {
      setGameOver(true);
    }
  };

  const resetGame = () => {
    setLevel(1);
    setGameOver(false);
    startLevel();
  };

  const retryLevel = () => {
    setGameOver(false);
    startLevel();
  };

  return (
    <div className="w-full h-full bg-slate-900 text-white flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-2">Visual Memory Game</h1>
      
      {/* Level display - LARGE and prominent */}
      <div className="mb-2 text-center">
        <div className="text-6xl font-bold text-yellow-400 mb-2">
          LEVEL {level}
        </div>
        <div className="text-xl text-gray-300">
          {patternCount => level + 2} cells to remember
        </div>
      </div>
      
      {/* Game status */}
      <div className="mb-4 text-center">
        {showPattern && (
          <div className="text-green-400 text-xl animate-pulse">
            🔵 MEMORIZE THE PATTERN!
          </div>
        )}
        {!showPattern && !completed && !gameOver && (
          <div className="text-blue-400 text-xl">
            ⚡ NOW RECALL THE PATTERN
          </div>
        )}
        {completed && (
          <div className="text-green-400">
            <div className="text-2xl mb-2">✅ LEVEL COMPLETE!</div>
            <div className="text-lg text-yellow-400">
              Continuing in {countdown}...
            </div>
          </div>
        )}
      </div>

      {gameOver && (
        <div className="mb-4 text-center bg-red-900/50 p-4 rounded-lg">
          <p className="text-red-400 text-2xl mb-2">❌ GAME OVER!</p>
          <p className="text-gray-300 mb-3">You clicked the wrong cell!</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={retryLevel}
              className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 transition-colors"
            >
              Try Level {level} Again
            </button>
            <button
              onClick={resetGame}
              className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-700 transition-colors"
            >
              Start Over
            </button>
          </div>
        </div>
      )}

      {/* Game grid */}
      <div
        className="grid gap-3 mb-4"
        style={{
          gridTemplateColumns: `repeat(${GRID_SIZE}, 80px)`,
        }}
      >
        {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, index) => {
          const isPattern = grid.includes(index);
          const isSelected = selected.includes(index);
          let bgColor = "bg-gray-700";
          let borderColor = "";
          
          if (showPattern && isPattern) {
            bgColor = "bg-green-500"; // Pattern shown in green
            borderColor = "ring-4 ring-yellow-300";
          } else if (isSelected) {
            bgColor = "bg-blue-500"; // User's correct selections in blue
            borderColor = "ring-2 ring-white";
          } else if (gameOver && isPattern && !isSelected) {
            bgColor = "bg-green-500 opacity-50"; // Show correct pattern after game over
          } else if (gameOver && !isPattern && !isSelected) {
            bgColor = "bg-gray-700";
          }

          return (
            <div
              key={index}
              onClick={() => handleClick(index)}
              className={`
                w-20 h-20 rounded-lg cursor-pointer transition-all duration-200
                ${bgColor} ${borderColor}
                ${!showPattern && !gameOver && !completed && !isSelected ? "hover:bg-gray-500 hover:scale-105" : ""}
                ${gameOver ? "cursor-not-allowed" : ""}
                ${completed ? "cursor-not-allowed" : ""}
              `}
            />
          );
        })}
      </div>

      {/* Progress indicator */}
      {!showPattern && !gameOver && !completed && (
        <div className="mt-2 text-center">
          <div className="text-lg text-gray-300">
            Progress: {selected.length} / {grid.length}
          </div>
          <div className="w-64 h-2 bg-gray-700 rounded-full mt-2">
            <div 
              className="h-2 bg-blue-500 rounded-full transition-all duration-300"
              style={{ width: `${(selected.length / grid.length) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Pattern reminder after game over */}
      {gameOver && (
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-400 mb-2">The correct pattern was:</p>
          <div className="flex gap-2 justify-center">
            {grid.map((index, i) => (
              <div
                key={i}
                className="w-6 h-6 bg-green-500 rounded-sm flex items-center justify-center text-xs font-bold"
                title={`Cell ${index + 1}`}
              >
                {index + 1}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}