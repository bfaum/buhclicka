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
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto p-4">
        <header className="mb-6 text-center">
          <h1 className="text-4xl font-bold mb-2">Resource Clicker</h1>
          <p className="text-gray-300">Click to gather resources and upgrade your kingdom!</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <WorldGrid
              tiles={gameState.tiles}
              viewRange={gameState.viewRange}
              position={gameState.position}
              onTileClick={handleTileClick}
              onMove={handleMove}
            />
          </div>
          
          <div className="space-y-6">
            <ResourceDisplay resources={gameState.resources} />
            
            <div className="flex gap-4">
              <Minimap 
                tiles={gameState.tiles}
                position={gameState.position}
                viewRange={gameState.viewRange}
              />
              
              <div className="bg-gray-800 p-3 rounded-lg flex-1 flex flex-col justify-between">
                <h2 className="text-white text-xl font-bold">Controls</h2>
                <div className="text-sm text-gray-300">
                  <p>• Click on tiles to harvest resources</p>
                  <p>• Right-click and drag to move around</p>
                  <p>• Buy upgrades to progress faster</p>
                </div>
              </div>
            </div>
            
            <GameControls onReset={handleReset} />
            
            <UpgradePanel
              upgrades={gameState.upgrades}
              resources={gameState.resources}
              canAfford={checkCanAfford}
              onPurchase={handleUpgradePurchase}
            />
          </div>
        </div>
      </div>
      
      <GameInfo />
      
      <footer className="text-center text-gray-500 mt-8 text-sm">
        Resource Clicker v1.0.0 | Created with React & Tailwind CSS
      </footer>
    </div>
  );
};

export default Game;