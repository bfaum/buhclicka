import { TileType, Tile } from '../types/game';

interface MinimapProps {
  tiles: Record<string, Tile>;
  position: { x: number; y: number };
  viewRange: number;
}

const Minimap: React.FC<MinimapProps> = ({ tiles, position, viewRange }) => {
  const minimapSize = viewRange * 2 + 1;
  const minimapTileSize = 4; // Small pixel size for minimap tiles
  
  const getTileColor = (tile: Tile | undefined): string => {
    if (!tile || tile.depleted) {
      return 'bg-gray-500';
    }

    switch (tile.type) {
      case TileType.FOREST:
        return 'bg-green-600';
      case TileType.ROCK:
        return 'bg-gray-600';
      case TileType.ENERGY:
        return 'bg-blue-500';
      case TileType.EMPTY:
        return 'bg-gray-300';
      default:
        return 'bg-gray-300';
    }
  };

  const minimapTiles = [];
  for (let y = position.y - viewRange; y <= position.y + viewRange; y++) {
    for (let x = position.x - viewRange; x <= position.x + viewRange; x++) {
      const key = `${x},${y}`;
      const tile = tiles[key];
      minimapTiles.push({
        key,
        x,
        y,
        color: getTileColor(tile),
        isCenter: x === position.x && y === position.y,
      });
    }
  }

  return (
    <div className="bg-gray-800 p-3 rounded-lg">
      <h2 className="text-white text-xl font-bold mb-2">Minimap</h2>
      <div 
        className="relative grid gap-0 p-1 bg-gray-900 rounded"
        style={{ 
          gridTemplateColumns: `repeat(${minimapSize}, ${minimapTileSize}px)`,
          width: `${minimapSize * minimapTileSize}px`,
          height: `${minimapSize * minimapTileSize}px`,
        }}
      >
        {minimapTiles.map((tile) => (
          <div
            key={tile.key}
            className={`${tile.color} ${tile.isCenter ? 'ring-2 ring-red-500' : ''}`}
            style={{ width: `${minimapTileSize}px`, height: `${minimapTileSize}px` }}
          />
        ))}
      </div>
    </div>
  );
};

export default Minimap;