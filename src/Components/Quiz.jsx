import React from 'react';

const Quiz = ({ puzzle, onComplete }) => {
  const handleAnswer = (selectedIndex) => {
    const isCorrect = selectedIndex === puzzle.correctAnswer;
    
    if (isCorrect) {
      onComplete();
    } else {
      // Handle wrong answer - you can add feedback here
      alert('Wrong answer, try again!');
    }
  };

  return (
    <div className="bg-white rounded-lg p-8 max-w-md w-full">
      <h3 className="text-2xl font-bold mb-6 text-gray-800">{puzzle.question}</h3>
      <div className="space-y-4">
        {puzzle.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleAnswer(index)}
            className="w-full py-3 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200 font-medium"
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Quiz;