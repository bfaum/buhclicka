import { useState } from 'react';

const GameInfo: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-4 right-4 z-10">
      {isOpen ? (
        <div className="bg-gray-800 p-4 rounded-lg shadow-lg max-w-md">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-xl font-bold text-white">How to Play</h3>
            <button
              className="text-gray-400 hover:text-white"
              onClick={() => setIsOpen(false)}
            >
              ✕
            </button>
          </div>
          <div className="text-gray-300 space-y-2 text-sm">
            <p><strong>Getting Started:</strong></p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Click on tiles to gather resources based on their type:</li>
              <li className="pl-2">🌲 Forest tiles give Wood</li>
              <li className="pl-2">🪨 Rock tiles give Stone</li>
              <li className="pl-2">⚡ Energy tiles give Energy</li>
            </ul>
            <p><strong>Navigation:</strong></p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Right-click and drag to move around the world</li>
              <li>The world is infinite and procedurally generated</li>
              <li>Use the minimap to see your surroundings</li>
            </ul>
            <p><strong>Upgrades:</strong></p>
            <ul className="list-disc pl-5 space-y-1">
              <li>🔨 Harvester Strength: Get more resources per click</li>
              <li>🤖 Auto Harvester: Automatically collect resources</li>
              <li>⏱️ Regrowth Speed: Tiles replenish faster</li>
              <li>👁️ View Range: See more of the world at once</li>
            </ul>
            <p className="text-gray-400 italic mt-4">Your progress is automatically saved every 10 seconds.</p>
          </div>
        </div>
      ) : (
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full shadow-lg"
          onClick={() => setIsOpen(true)}
        >
          ?
        </button>
      )}
    </div>
  );
};

export default GameInfo;