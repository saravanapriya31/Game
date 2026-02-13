import React, { useState, useEffect } from "react";
import "../App.css"
const questionsData = [
  { question: "The Earth is flat.", answer: false },
  { question: "React is an Javascript Frmework.", answer: true },
  { question: "The sun rises in the west.", answer: false },
  { question: "Tailwind CSS is a utility-first CSS framework.", answer: true },
  { question: "2 + 2 equals 5.", answer: false },
  { question: "Water boils at 100°C.", answer: true },
  { question: "HTML is a programming language.", answer: false },
];

export default function RapidFireGame() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(5);
  const [gameOver, setGameOver] = useState(false);

  const currentQuestion = questionsData[currentIndex];

  useEffect(() => {
    if (gameOver) return;

    if (timeLeft === 0) {
      nextQuestion();
      return;
    }

    const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, gameOver]);

  const handleAnswer = (selected) => {
    if (selected === currentQuestion.answer) {
      setScore(score + 1);
    }
    nextQuestion();
  };

  const nextQuestion = () => {
    if (currentIndex + 1 < questionsData.length) {
      setCurrentIndex(currentIndex + 1);
      setTimeLeft(5);
    } else {
      setGameOver(true);
    }
  };

  const restartGame = () => {
    setCurrentIndex(0);
    setScore(0);
    setTimeLeft(5);
    setGameOver(false);
  };

  return (
    <div className="min-h-screen bg-blue-300 flex items-center justify-center p-4">
      <div className="bg-yellow-500 shadow-2xl rounded-2xl p-8 w-full max-w-md text-center transition-all duration-300">
        <h1 className="text-3xl font-bold mb-4">⚡ Rapid Fire: True or False</h1>

        {!gameOver && (
          <>
            <div className="mb-4 text-gray-600 font-semibold">
              Time Left: <span className="text-red-500">{timeLeft}s</span>
            </div>

            <div className="text-xl font-medium mb-6 transition-all duration-300">
              {currentQuestion.question}
            </div>

            <div className="flex gap-4 justify-center">
              <button
                onClick={() => handleAnswer(true)}
                className="px-6 py-2 rounded-xl  text-black font-semibold hover:bg-green-600 transition"
              >
                True
              </button>
              <button
                onClick={() => handleAnswer(false)}
                className="px-6 py-2 rounded-xl bg-red-500 text-black font-semibold hover:bg-red-600 transition"
              >
                False
              </button>
            </div>

            <div className="mt-6 text-lg font-semibold">
              Score: {score}
            </div>
          </>
        )}

        {gameOver && (
          <div className="transition-all duration-300">
            <h2 className="text-2xl font-bold mb-4">🎉 Game Over!</h2>
            <p className="text-lg mb-6">Your Score: {score}</p>
            <button
              onClick={restartGame}
              className="px-6 py-2 rounded-xl bg-blue-500 text-black font-semibold hover:bg-blue-600 transition"
            >
              Play Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
