import { type Tile as TileInterface, TileType } from '../types/game';

interface TileProps {
  tile: TileInterface;
  onClick: () => void;
}

const Tile: React.FC<TileProps> = ({ tile, onClick }) => {
  // Determine tile color and content based on type and depletion
  const getTileStyle = () => {
    if (tile.depleted) {
      return 'bg-gray-300 hover:bg-gray-400';
    }

    switch (tile.type) {
      case TileType.FOREST:
        return 'bg-green-600 hover:bg-green-700';
      case TileType.ROCK:
        return 'bg-gray-600 hover:bg-gray-700';
      case TileType.ENERGY:
        return 'bg-blue-500 hover:bg-blue-600';
      case TileType.EMPTY:
      default:
        return 'bg-gray-200 hover:bg-gray-300';
    }
  };

  const getTileSymbol = () => {
    if (tile.depleted) {
      return '◦';
    }

    switch (tile.type) {
      case TileType.FOREST:
        return '🌲';
      case TileType.ROCK:
        return '🪨';
      case TileType.ENERGY:
        return '⚡';
      case TileType.EMPTY:
      default:
        return '';
    }
  };

  return (
    <div
      className={`w-full h-full aspect-square ${getTileStyle()} flex items-center justify-center cursor-pointer rounded-sm text-lg transition-colors duration-200`}
      onClick={onClick}
    >
      {getTileSymbol()}
    </div>
  );
};

export default Tile;