import { type Resources, ResourceType } from '../types/game';

interface ResourceDisplayProps {
  resources: Resources;
}

const ResourceDisplay: React.FC<ResourceDisplayProps> = ({ resources }) => {
  return (
    <div className="flex space-x-4 text-white">
      <div className="flex items-center">
        <span className="text-xl mr-1">🪵</span>
        <span className="font-bold">{resources[ResourceType.WOOD]}</span>
      </div>
      <div className="flex items-center">
        <span className="text-xl mr-1">🪨</span>
        <span className="font-bold">{resources[ResourceType.STONE]}</span>
      </div>
      <div className="flex items-center">
        <span className="text-xl mr-1">⚡</span>
        <span className="font-bold">{resources[ResourceType.ENERGY]}</span>
      </div>
    </div>
  );
};

export default ResourceDisplay;