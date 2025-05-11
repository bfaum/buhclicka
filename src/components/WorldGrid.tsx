import { useRef, useEffect } from 'react';
import { type Tile as TileType, getTileKey } from '../types/game';
import Tile from './Tile';

interface WorldGridProps {
  tiles: Record<string, TileType>;
  viewRange: number;
  position: { x: number; y: number };
  onTileClick: (x: number, y: number) => void;
  onMove: (deltaX: number, deltaY: number) => void;
}

const WorldGrid: React.FC<WorldGridProps> = ({
  tiles,
  viewRange,
  position,
  onTileClick,
  onMove,
}) => {
  const gridRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const lastPosition = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      // Accept left click for dragging to make navigation more intuitive
      if (e.button === 0 || e.button === 1 || e.button === 2) {
        e.preventDefault();
        isDragging.current = true;
        lastPosition.current = { x: e.clientX, y: e.clientY };
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging.current) {
        // Invert the deltas for more intuitive scrolling
        // When you drag right, the world should move left (negative x)
        const deltaX = -(e.clientX - lastPosition.current.x) / 18; 
        const deltaY = -(e.clientY - lastPosition.current.y) / 18;
        
        if (Math.abs(deltaX) > 0.25 || Math.abs(deltaY) > 0.25) {
          onMove(
            deltaX > 0 ? Math.ceil(deltaX) : Math.floor(deltaX), 
            deltaY > 0 ? Math.ceil(deltaY) : Math.floor(deltaY)
          );
          lastPosition.current = { x: e.clientX, y: e.clientY };
        }
      }
    };

    const handleMouseUp = () => {
      isDragging.current = false;
    };

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      return false;
    };

    // Add keyboard navigation for more control
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          onMove(0, -1);
          break;
        case 'ArrowDown':
          onMove(0, 1);
          break;
        case 'ArrowLeft':
          onMove(-1, 0);
          break;
        case 'ArrowRight':
          onMove(1, 0);
          break;
      }
    };

    const gridElement = gridRef.current;
    if (gridElement) {
      gridElement.addEventListener('mousedown', handleMouseDown);
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      gridElement.addEventListener('contextmenu', handleContextMenu);
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      if (gridElement) {
        gridElement.removeEventListener('mousedown', handleMouseDown);
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
        gridElement.removeEventListener('contextmenu', handleContextMenu);
        window.removeEventListener('keydown', handleKeyDown);
      }
    };
  }, [onMove]);

  const visibleTiles = [];
  for (let y = position.y - viewRange; y <= position.y + viewRange; y++) {
    for (let x = position.x - viewRange; x <= position.x + viewRange; x++) {
      const key = getTileKey(x, y);
      const tile = tiles[key];
      if (tile) {
        visibleTiles.push(tile);
      }
    }
  }

  // Sort tiles to ensure consistent rendering order
  visibleTiles.sort((a, b) => {
    if (a.y !== b.y) return a.y - b.y;
    return a.x - b.x;
  });

  const gridSize = viewRange * 2 + 1;

  return (
    <div className="relative overflow-hidden bg-gray-900 rounded-lg p-2">
      <div className="flex justify-between mb-2 text-white">
        <div>Position: ({position.x}, {position.y})</div>
        <div>Click and drag to move map | Use arrow keys for precise movement</div>
      </div>
      <div 
        ref={gridRef}
        className="grid gap-1 cursor-grab active:cursor-grabbing"
        style={{ 
          gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
        }}
      >
        {visibleTiles.map((tile) => (
          <Tile
            key={getTileKey(tile.x, tile.y)}
            tile={tile}
            onClick={() => onTileClick(tile.x, tile.y)}
          />
        ))}
      </div>
      
      {/* Add navigation controls */}
      <div className="absolute bottom-4 right-4 grid grid-cols-3 gap-1">
        <div></div>
        <button 
          className="bg-gray-700 hover:bg-gray-600 text-white p-2 rounded" 
          onClick={() => onMove(0, -1)}
        >
          ↑
        </button>
        <div></div>
        <button 
          className="bg-gray-700 hover:bg-gray-600 text-white p-2 rounded" 
          onClick={() => onMove(-1, 0)}
        >
          ←
        </button>
        <button 
          className="bg-gray-700 hover:bg-gray-600 text-white p-2 rounded" 
          onClick={() => onMove(0, 0)}
        >
          ●
        </button>
        <button 
          className="bg-gray-700 hover:bg-gray-600 text-white p-2 rounded" 
          onClick={() => onMove(1, 0)}
        >
          →
        </button>
        <div></div>
        <button 
          className="bg-gray-700 hover:bg-gray-600 text-white p-2 rounded" 
          onClick={() => onMove(0, 1)}
        >
          ↓
        </button>
        <div></div>
      </div>
    </div>
  );
};

export default WorldGrid;
