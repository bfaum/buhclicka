import { Tile as TileType } from '../types/game';

interface TileProps {
  tile: TileType;
  onClick: () => void;
}

const Tile: React.FC<TileProps> = ({ tile, onClick }) => {
  // Determine tile color and content based on type and depletion
  const getTileStyle = () => {
    if (tile.depleted) {
      return 'bg-gray-300 hover:bg-gray-400';
    }

    switch (tile.type) {
      case 'forest':
        return 'bg-green-600 hover:bg-green-700';
      case 'rock':
        return 'bg-gray-600 hover:bg-gray-700';
      case 'energy':
        return 'bg-blue-500 hover:bg-blue-600';
      case 'empty':
      default:
        return 'bg-gray-200 hover:bg-gray-300';
    }
  };

  const getTileSymbol = () => {
    if (tile.depleted) {
      return '◦';
    }

    switch (tile.type) {
      case 'forest':
        return '🌲';
      case 'rock':
        return '🪨';
      case 'energy':
        return '⚡';
      case 'empty':
      default:
        return '';
    }
  };

  return (
    <div
      className={`w-12 h-12 ${getTileStyle()} flex items-center justify-center cursor-pointer rounded-sm text-lg transition-colors duration-200`}
      onClick={onClick}
    >
      {getTileSymbol()}
    </div>
  );
};

export default Tile;