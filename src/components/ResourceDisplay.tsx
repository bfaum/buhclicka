import { type Resources, ResourceType } from '../types/game';

interface ResourceDisplayProps {
  resources: Resources;
}

const ResourceDisplay: React.FC<ResourceDisplayProps> = ({ resources }) => {
  return (
    <div className="bg-gray-800 p-4 rounded-lg text-white">
      <h2 className="text-xl font-bold mb-3">Resources</h2>
      <div className="grid grid-cols-3 gap-3">
        <div className="flex flex-col items-center p-2 bg-gray-700 rounded">
          <span className="text-2xl mb-1">🪵</span>
          <span className="font-bold">{resources[ResourceType.WOOD]}</span>
          <span className="text-xs text-gray-300">Wood</span>
        </div>
        <div className="flex flex-col items-center p-2 bg-gray-700 rounded">
          <span className="text-2xl mb-1">🪨</span>
          <span className="font-bold">{resources[ResourceType.STONE]}</span>
          <span className="text-xs text-gray-300">Stone</span>
        </div>
        <div className="flex flex-col items-center p-2 bg-gray-700 rounded">
          <span className="text-2xl mb-1">⚡</span>
          <span className="font-bold">{resources[ResourceType.ENERGY]}</span>
          <span className="text-xs text-gray-300">Energy</span>
        </div>
      </div>
    </div>
  );
};

export default ResourceDisplay;