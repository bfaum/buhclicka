import { useState } from 'react';
import { clearGameState } from '../utils/storage';

interface GameControlsProps {
  onReset: () => void;
}

const GameControls: React.FC<GameControlsProps> = ({ onReset }) => {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleReset = () => {
    clearGameState();
    onReset();
    setShowConfirm(false);
  };

  return (
    <div className="bg-gray-800 p-3 rounded-lg">
      <h2 className="text-white text-xl font-bold mb-3">Game Controls</h2>
      
      {showConfirm ? (
        <div className="text-center">
          <p className="text-red-400 mb-2">Are you sure? All progress will be lost!</p>
          <div className="flex space-x-2 justify-center">
            <button 
              className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded font-bold"
              onClick={handleReset}
            >
              Yes, Reset
            </button>
            <button 
              className="bg-gray-600 hover:bg-gray-700 px-3 py-1 rounded font-bold"
              onClick={() => setShowConfirm(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button 
          className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded font-bold w-full"
          onClick={() => setShowConfirm(true)}
        >
          Reset Game
        </button>
      )}
    </div>
  );
};

export default GameControls;