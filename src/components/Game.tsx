import { useState, useEffect, useCallback } from 'react';
import { type GameState, UpgradeType } from '../types/game';
import WorldGrid from './WorldGrid';
import ResourceDisplay from './ResourceDisplay';
import UpgradePanel from './UpgradePanel';
import Minimap from './Minimap';
import GameControls from './GameControls';
import GameInfo from './GameInfo';
import { 
  initializeGameState, 
  harvestTile, 
  updateGameState,
  canAffordUpgrade,
  purchaseUpgrade,
  movePosition
} from '../utils/gameLogic';
import { saveGameState, loadGameState } from '../utils/storage';

const Game: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(() => {
    const savedState = loadGameState();
    return savedState || initializeGameState();
  });
  
  const [showPanel, setShowPanel] = useState(false);

  // Game tick update
  useEffect(() => {
    const gameInterval = setInterval(() => {
      setGameState(prevState => {
        const newState = { ...prevState };
        updateGameState(newState);
        return newState;
      });
    }, 1000); // Update every second

    return () => clearInterval(gameInterval);
  }, []);

  // Save game state whenever it changes
  useEffect(() => {
    const saveInterval = setInterval(() => {
      saveGameState(gameState);
    }, 10000); // Save every 10 seconds

    return () => clearInterval(saveInterval);
  }, [gameState]);

  // Handle tile click
  const handleTileClick = useCallback((x: number, y: number) => {
    setGameState(prevState => {
      const newState = { ...prevState };
      harvestTile(newState, x, y);
      return newState;
    });
  }, []);

  // Handle movement
  const handleMove = useCallback((deltaX: number, deltaY: number) => {
    setGameState(prevState => {
      const newState = { ...prevState };
      movePosition(newState, deltaX, deltaY);
      return newState;
    });
  }, []);

  // Handle upgrade purchase
  const handleUpgradePurchase = useCallback((upgradeType: UpgradeType) => {
    setGameState(prevState => {
      const newState = { ...prevState };
      purchaseUpgrade(newState, upgradeType);
      return newState;
    });
  }, []);

  // Check if an upgrade can be afforded
  const checkCanAfford = useCallback((upgradeType: UpgradeType) => {
    return canAffordUpgrade(gameState, upgradeType);
  }, [gameState]);
  
  // Handle game reset
  const handleReset = useCallback(() => {
    setGameState(initializeGameState());
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      {/* Compact header */}
      <header className="bg-gray-800 py-2 px-4 flex justify-between items-center shadow-lg z-10">
        <div>
          <h1 className="text-2xl font-bold">Resource Clicker</h1>
        </div>
        <ResourceDisplay resources={gameState.resources} />
        <button 
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded font-bold"
          onClick={() => setShowPanel(!showPanel)}
        >
          {showPanel ? "Hide Menu" : "Menu"}
        </button>
      </header>

      {/* Main content */}
      <div className="flex flex-grow">
        {/* World Grid - now takes up the full screen */}
        <div className="flex-grow">
          <WorldGrid
            tiles={gameState.tiles}
            viewRange={gameState.viewRange}
            position={gameState.position}
            onTileClick={handleTileClick}
            onMove={handleMove}
          />
        </div>
        
        {/* Side panel that can be toggled */}
        {showPanel && (
          <div className="w-80 bg-gray-800 p-4 space-y-4 overflow-y-auto shadow-xl">
            <div className="flex gap-4">
              <Minimap 
                tiles={gameState.tiles}
                position={gameState.position}
                viewRange={gameState.viewRange}
              />
            </div>
            
            <GameControls onReset={handleReset} />
            
            <UpgradePanel
              upgrades={gameState.upgrades}
              resources={gameState.resources}
              canAfford={checkCanAfford}
              onPurchase={handleUpgradePurchase}
            />
          </div>
        )}
      </div>
      
      <GameInfo />
      
      <footer className="bg-gray-800 py-1 text-center text-gray-500 text-xs">
        Resource Clicker v1.1.0 | Created with React & Tailwind CSS
      </footer>
    </div>
  );
};

export default Game;