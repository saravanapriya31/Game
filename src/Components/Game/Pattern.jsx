import React, { useState, useEffect } from 'react';
import { Card, Button, Modal, notification, Progress } from 'antd';
import { 
  TrophyOutlined, 
  RocketOutlined, 
  WarningOutlined,
  SoundOutlined,
  EyeOutlined 
} from '@ant-design/icons';

const NavalPatternGame = () => {
  // Game state
  const [currentLevel, setCurrentLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [pattern, setPattern] = useState([]);
  const [userPattern, setUserPattern] = useState([]);
  const [isShowingPattern, setIsShowingPattern] = useState(true);
  const [gameStatus, setGameStatus] = useState('waiting'); // waiting, showing, input, success, failed
  const [timeLeft, setTimeLeft] = useState(5);
  const [showTutorial, setShowTutorial] = useState(true);

  // Naval vessel types with their symbols and colors
  const navalVessels = [
    { id: 1, name: 'Aircraft Carrier', symbol: '🚢', color: 'bg-blue-500', pattern: 'CVN' },
    { id: 2, name: 'Destroyer', symbol: '⛴️', color: 'bg-gray-500', pattern: 'DDG' },
    { id: 3, name: 'Submarine', symbol: '⚓', color: 'bg-green-700', pattern: 'SSN' },
    { id: 4, name: 'Patrol Boat', symbol: '🛥️', color: 'bg-yellow-500', pattern: 'PC' },
    { id: 5, name: 'Amphibious Ship', symbol: '🚤', color: 'bg-red-500', pattern: 'LHD' },
    { id: 6, name: 'Supply Ship', symbol: '⛵', color: 'bg-purple-500', pattern: 'AOE' }
  ];

  // Generate pattern based on level
  const generatePattern = (level) => {
    const patternLength = Math.min(3 + Math.floor(level / 2), 8);
    const newPattern = [];
    for (let i = 0; i < patternLength; i++) {
      const randomIndex = Math.floor(Math.random() * navalVessels.length);
      newPattern.push(navalVessels[randomIndex]);
    }
    return newPattern;
  };

  // Initialize game
  useEffect(() => {
    startNewLevel();
  }, [currentLevel]);

  // Timer effect
  useEffect(() => {
    let timer;
    if (gameStatus === 'showing' && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0 && gameStatus === 'showing') {
      setIsShowingPattern(false);
      setGameStatus('input');
      notification.info({
        message: 'Pattern Hidden',
        description: 'Now recreate the pattern you saw!',
        placement: 'topRight',
      });
    }
    return () => clearTimeout(timer);
  }, [timeLeft, gameStatus]);

  const startNewLevel = () => {
    const newPattern = generatePattern(currentLevel);
    setPattern(newPattern);
    setUserPattern([]);
    setIsShowingPattern(true);
    setGameStatus('showing');
    setTimeLeft(Math.max(3, 7 - Math.floor(currentLevel / 2)));
  };

  const handleVesselClick = (vessel) => {
    if (gameStatus !== 'input') return;

    const newUserPattern = [...userPattern, vessel];
    setUserPattern(newUserPattern);

    // Check if pattern is correct so far
    const currentIndex = newUserPattern.length - 1;
    if (newUserPattern[currentIndex].id !== pattern[currentIndex].id) {
      // Wrong selection
      setGameStatus('failed');
      notification.error({
        message: 'Incorrect Pattern!',
        description: 'That vessel doesn\'t match the pattern. Try again!',
        placement: 'topRight',
      });
      return;
    }

    // Check if pattern is complete
    if (newUserPattern.length === pattern.length) {
      // Success!
      const newScore = score + (currentLevel * 10) + (timeLeft * 2);
      setScore(newScore);
      setGameStatus('success');
      
      if (currentLevel === 10) {
        notification.success({
          message: '🎉 Congratulations!',
          description: 'You\'ve completed all levels! You\'re a Naval Pattern Recognition Expert!',
          duration: 5,
          placement: 'topRight',
        });
      } else {
        notification.success({
          message: 'Pattern Correct!',
          description: `Level ${currentLevel} completed! Advancing to level ${currentLevel + 1}`,
          placement: 'topRight',
        });
      }
    }
  };

  const nextLevel = () => {
    if (currentLevel < 10) {
      setCurrentLevel(currentLevel + 1);
    }
  };

  const resetGame = () => {
    setCurrentLevel(1);
    setScore(0);
    setGameStatus('waiting');
    setShowTutorial(true);
  };

  const retryLevel = () => {
    startNewLevel();
  };

  // Calculate progress percentage
  const progressPercentage = (currentLevel / 10) * 100;

  return (
    // <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-700 p-8">
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-700 flex items-center justify-center p-4">
      {/* Tutorial Modal */}
      <Modal
        title="Naval Pattern Recognition Training"
        open={showTutorial}
        onOk={() => setShowTutorial(false)}
        onCancel={() => setShowTutorial(false)}
        okText="Start Mission"
        cancelText="Close"
        className="bg-white rounded-lg"
      >
        <div className="space-y-4">
          <div className="flex items-center space-x-2 text-blue-600">
            <EyeOutlined className="text-2xl" />
            <span className="font-bold">Mission Briefing:</span>
          </div>
          <p>As a naval officer, you must recognize and recall vessel patterns to identify enemy formations.</p>
          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="font-semibold">How to play:</p>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Watch the pattern of vessels carefully</li>
              <li>Remember the sequence of ship types</li>
              <li>Click the vessels in the same order after they disappear</li>
              <li>Complete patterns faster for bonus points</li>
            </ul>
          </div>
        </div>
      </Modal>

      {/* Header */}
      <div className="w-full max-w-4xl">
        <Card className="mb-6 bg-white/90 backdrop-blur">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <RocketOutlined className="text-3xl text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Naval Pattern Recognition</h1>
                <p className="text-gray-600">Level {currentLevel}/10 • Score: {score}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Progress 
                type="circle" 
                percent={progressPercentage} 
                width={60} 
                format={() => `${currentLevel}/10`}
              />
              <Button onClick={resetGame} className="bg-blue-500 text-white hover:bg-blue-600">
                New Mission
              </Button>
            </div>
          </div>
        </Card>

        {/* Game Area */}
        <Card className="mb-6 bg-white/90 backdrop-blur">
          {/* Status Bar */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                {gameStatus === 'showing' && (
                  <>
                    <WarningOutlined className="text-yellow-500 animate-pulse" />
                    <span className="font-semibold">Memorize the pattern... {timeLeft}s</span>
                  </>
                )}
                {gameStatus === 'input' && (
                  <>
                    <SoundOutlined className="text-green-500" />
                    <span className="font-semibold">
                      Your turn! Select vessels: {userPattern.length}/{pattern.length}
                    </span>
                  </>
                )}
                {gameStatus === 'success' && (
                  <>
                    <TrophyOutlined className="text-yellow-500" />
                    <span className="font-semibold text-green-600">Pattern matched! Well done!</span>
                  </>
                )}
                {gameStatus === 'failed' && (
                  <>
                    <WarningOutlined className="text-red-500" />
                    <span className="font-semibold text-red-600">Pattern broken! Try again.</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Pattern Display */}
          <div className="mb-8">
            <h3 className="text-center text-gray-600 mb-3">
              {isShowingPattern ? 'Current Pattern' : 'Pattern Hidden - Recall Sequence'}
            </h3>
            <div className="flex justify-center space-x-3">
              {(isShowingPattern ? pattern : userPattern).map((vessel, index) => (
                <div
                  key={index}
                  className={`w-16 h-16 ${vessel.color} rounded-lg flex items-center justify-center text-3xl shadow-lg transform hover:scale-110 transition-transform`}
                >
                  {vessel.symbol}
                </div>
              ))}
            </div>
          </div>

          {/* Vessel Selection Grid */}
          <div>
            <h3 className="text-center text-gray-600 mb-3">Select Vessels</h3>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
              {navalVessels.map((vessel) => (
                <button
                  key={vessel.id}
                  onClick={() => handleVesselClick(vessel)}
                  disabled={gameStatus !== 'input'}
                  className={`
                    ${vessel.color} p-4 rounded-lg text-center text-white
                    hover:opacity-90 transform hover:scale-105 transition-all
                    ${gameStatus !== 'input' ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer shadow-lg'}
                    flex flex-col items-center
                  `}
                >
                  <span className="text-3xl mb-1">{vessel.symbol}</span>
                  <span className="text-xs font-semibold">{vessel.pattern}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          {(gameStatus === 'success' || gameStatus === 'failed') && (
            <div className="mt-6 flex justify-center space-x-4">
              {gameStatus === 'success' && currentLevel < 10 && (
                <Button 
                  type="primary" 
                  onClick={nextLevel}
                  className="bg-green-500 hover:bg-green-600"
                  size="large"
                >
                  Next Level ➔
                </Button>
              )}
              {gameStatus === 'failed' && (
                <Button 
                  type="primary" 
                  onClick={retryLevel}
                  className="bg-blue-500 hover:bg-blue-600"
                  size="large"
                >
                  Retry Level
                </Button>
              )}
              {currentLevel === 10 && gameStatus === 'success' && (
                <Button 
                  type="primary" 
                  onClick={resetGame}
                  className="bg-yellow-500 hover:bg-yellow-600"
                  size="large"
                >
                  Play Again
                </Button>
              )}
            </div>
          )}
        </Card>

        {/* Instructions Card */}
        <Card className="bg-white/80 backdrop-blur">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="p-2">
              <div className="text-2xl mb-1">👁️</div>
              <div className="font-semibold">Observe</div>
              <div className="text-xs text-gray-600">Watch the vessel sequence carefully</div>
            </div>
            <div className="p-2">
              <div className="text-2xl mb-1">🧠</div>
              <div className="font-semibold">Memorize</div>
              <div className="text-xs text-gray-600">Remember the order of ships</div>
            </div>
            <div className="p-2">
              <div className="text-2xl mb-1">🎯</div>
              <div className="font-semibold">Recreate</div>
              <div className="text-xs text-gray-600">Click vessels in correct sequence</div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default NavalPatternGame;