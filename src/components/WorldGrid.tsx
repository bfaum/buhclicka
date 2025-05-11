import { useRef, useEffect } from 'react';
import { Tile as TileType, getTileKey } from '../types/game';
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
      if (e.button === 1 || e.button === 2) { // Middle or right click
        e.preventDefault();
        isDragging.current = true;
        lastPosition.current = { x: e.clientX, y: e.clientY };
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging.current) {
        const deltaX = (lastPosition.current.x - e.clientX) / 24; // Adjusted for tile size
        const deltaY = (lastPosition.current.y - e.clientY) / 24;
        
        if (Math.abs(deltaX) > 0.5 || Math.abs(deltaY) > 0.5) {
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

    const gridElement = gridRef.current;
    if (gridElement) {
      gridElement.addEventListener('mousedown', handleMouseDown);
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      gridElement.addEventListener('contextmenu', handleContextMenu);
    }

    return () => {
      if (gridElement) {
        gridElement.removeEventListener('mousedown', handleMouseDown);
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
        gridElement.removeEventListener('contextmenu', handleContextMenu);
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
        <div>Drag with right mouse button to move</div>
      </div>
      <div 
        ref={gridRef}
        className="grid gap-1 cursor-grab"
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
    </div>
  );