import React, { useState, useEffect } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Card, Button, message, Progress, Modal } from 'antd';
import { 
  DragOutlined, 
  CheckOutlined, 
  ReloadOutlined,
  TrophyOutlined,
  QuestionCircleOutlined
} from '@ant-design/icons';

// Draggable Item Component
const DraggableItem = ({ item, index, moveItem, isCorrect }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'ITEM',
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: 'ITEM',
    hover: (draggedItem) => {
      if (draggedItem.index !== index) {
        moveItem(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  return (
    <div
      ref={(node) => drag(drop(node))}
      className={`
        p-4 mb-3 rounded-lg border-2 cursor-move
        transition-all duration-200
        ${isDragging ? 'opacity-50 scale-105' : 'opacity-100'}
        ${isCorrect 
          ? 'bg-green-50 border-green-500 shadow-green-200' 
          : 'bg-white border-gray-200 hover:border-blue-400 hover:shadow-md'
        }
        shadow-sm hover:shadow
      `}
    >
      <div className="flex items-center space-x-3">
        <DragOutlined className="text-gray-400 text-lg" />
        <span className="text-base font-medium">{item.text}</span>
        {isCorrect && (
          <CheckOutlined className="text-green-500 ml-auto" />
        )}
      </div>
    </div>
  );
};

// Main Puzzle Component
const SequencePuzzle = ({ puzzleData: customPuzzleData }) => {
  // Default puzzle data if none provided
  const defaultPuzzleData = {
    title: "Damage Control - Fire Party Response",
    description: "Arrange the steps for responding to a fire at sea",
    correctSequence: [
      { id: 1, text: "Fire detected - sound alarm" },
      { id: 2, text: "Report fire to Central Control Station" },
      { id: 3, text: "Damage control team assembles" },
      { id: 4, text: "Don firefighting gear (turnout gear, SCBA)" },
       { id: 5, text: "Secure ventilation to affected space" },
      { id: 6, text: "Attack fire with appropriate extinguisher" },
      { id: 7, text: "Establish hose team and boundary cooling" },
      { id: 8, text: "Overhaul fire scene to prevent reflash" },
      { id: 9, text: "Investigate cause and preserve evidence" }
    ]
  };
  
  


  const puzzleData = customPuzzleData || defaultPuzzleData;
  const [items, setItems] = useState([]);
  const [attempts, setAttempts] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showHint, setShowHint] = useState(false);

  // Initialize shuffled items
  useEffect(() => {
    shuffleItems();
  }, []);

  const shuffleItems = () => {
    const shuffled = [...puzzleData.correctSequence]
      .sort(() => Math.random() - 0.5);
    setItems(shuffled);
    setAttempts(0);
    setShowSuccess(false);
  };

  const moveItem = (fromIndex, toIndex) => {
    const updatedItems = [...items];
    const [movedItem] = updatedItems.splice(fromIndex, 1);
    updatedItems.splice(toIndex, 0, movedItem);
    setItems(updatedItems);
    setAttempts(prev => prev + 1);
  };

  const checkSequence = () => {
    const isCorrect = items.every(
      (item, index) => item.id === puzzleData.correctSequence[index].id
    );

    if (isCorrect) {
      setShowSuccess(true);
      message.success(' Perfect! You solved the puzzle!', 3);
    } else {
      message.error('Not quite right. Keep trying!', 2);
    }
  };

  const getProgress = () => {
    let correctCount = 0;
    items.forEach((item, index) => {
      if (item.id === puzzleData.correctSequence[index].id) {
        correctCount++;
      }
    });
    return (correctCount / items.length) * 100;
  };

  const getHint = () => {
    const firstIncorrect = items.findIndex(
      (item, index) => item.id !== puzzleData.correctSequence[index].id
    );
    
    if (firstIncorrect !== -1) {
      return `Check position ${firstIncorrect + 1}. It should be "${puzzleData.correctSequence[firstIncorrect].text}"`;
    }
    return "Everything looks correct! Try checking your answer.";
  };

  return (
    // <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-8 max-w-full items-center justify-center">
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header Card */}
        <Card className="mb-6 shadow-lg rounded-xl border-0 overflow-hidden">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              {puzzleData.title}
            </h1>
            <p className="text-gray-600 mb-4">{puzzleData.description}</p>
            
            {/* Progress Bar */}
            <div className="mb-4">
              <Progress 
                percent={getProgress()} 
                status={getProgress() === 100 ? "success" : "active"}
                strokeColor={{
                  '0%': '#108ee9',
                  '100%': '#87d068',
                }}
                format={(percent) => `${Math.round(percent)}% Correct`}
              />
            </div>

            {/* Stats */}
            <div className="flex justify-center space-x-6 text-sm text-gray-500">
              <span>Attempts: {attempts}</span>
              <span>•</span>
              <span>Items: {items.length}</span>
            </div>
          </div>
        </Card>

        {/* Puzzle Area */}
        <Card className="shadow-lg rounded-xl border-0">
          <div className="p-4">
            {items.map((item, index) => (
              <DraggableItem
                key={item.id}
                item={item}
                index={index}
                moveItem={moveItem}
                isCorrect={item.id === puzzleData.correctSequence[index].id}
              />
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center space-x-4 p-4 border-t border-gray-100">
            <Button
              type="primary"
              icon={<CheckOutlined />}
              onClick={checkSequence}
              className="bg-blue-500 hover:bg-blue-600 border-none shadow-md"
              size="large"
            >
              Check Answer
            </Button>
            
            <Button
              icon={<ReloadOutlined />}
              onClick={shuffleItems}
              size="large"
              className="shadow-md"
            >
              Shuffle
            </Button>

            <Button
              icon={<QuestionCircleOutlined />}
              onClick={() => setShowHint(true)}
              size="large"
              className="shadow-md"
            >
              Hint
            </Button>
          </div>
        </Card>

        {/* Success Modal */}
        <Modal
          title={
            <div className="text-center">
              <TrophyOutlined className="text-yellow-500 text-2xl mb-2" />
              <h2 className="text-xl font-bold">Congratulations!</h2>
            </div>
          }
          open={showSuccess}
          onOk={() => setShowSuccess(false)}
          onCancel={() => setShowSuccess(false)}
          footer={[
            <Button key="playAgain" type="primary" onClick={shuffleItems}>
              Play Again
            </Button>,
            <Button key="close" onClick={() => setShowSuccess(false)}>
              Close
            </Button>
          ]}
        >
          <div className="text-center py-4">
            <p className="text-lg mb-2">You've solved the puzzle!</p>
            <p className="text-gray-600">
              It took you {attempts} attempts to arrange the sequence correctly.
            </p>
          </div>
        </Modal>

        {/* Hint Modal */}
        <Modal
          title="Hint"
          open={showHint}
          onOk={() => setShowHint(false)}
          onCancel={() => setShowHint(false)}
          footer={[
            <Button key="close" onClick={() => setShowHint(false)}>
              Got it
            </Button>
          ]}
        >
          <div className="py-2">
            <p className="text-gray-700">{getHint()}</p>
          </div>
        </Modal>
      </div>
    </div>
  );
};

// Wrapper component with DndProvider
const SequencePuzzleWrapper = (props) => {
  return (
    <DndProvider backend={HTML5Backend}>
      <SequencePuzzle {...props} />
    </DndProvider>
  );
};

export default SequencePuzzleWrapper;