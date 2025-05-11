import { type Resources, type Upgrade as UpgradeType, UpgradeType as UpgradeTypes, ResourceType } from '../types/game';

interface UpgradePanelProps {
  upgrades: Record<UpgradeTypes, UpgradeType>;
  resources: Resources;
  canAfford: (upgradeType: UpgradeTypes) => boolean;
  onPurchase: (upgradeType: UpgradeTypes) => void;
}

const UpgradePanel: React.FC<UpgradePanelProps> = ({ 
  upgrades, 
  resources, 
  canAfford, 
  onPurchase 
}) => {
  const getUpgradeDescription = (upgradeType: UpgradeTypes): string => {
    switch (upgradeType) {
      case UpgradeTypes.CLICK_POWER:
        return `Harvest ${upgrades[upgradeType].effect} resources per click`;
      case UpgradeTypes.AUTO_GATHER:
        return `Auto-harvest ${upgrades[upgradeType].effect} tile${upgrades[upgradeType].effect !== 1 ? 's' : ''} per second`;
      case UpgradeTypes.GATHER_SPEED:
        return `Tiles regrow ${Math.round((1 - upgrades[upgradeType].effect) * 100)}% faster`;
      case UpgradeTypes.VIEW_RANGE:
        return `See ${upgrades[upgradeType].effect * 2 + 1}x${upgrades[upgradeType].effect * 2 + 1} tiles`;
      default:
        return '';
    }
  };

  const getUpgradeName = (upgradeType: UpgradeTypes): string => {
    switch (upgradeType) {
      case UpgradeTypes.CLICK_POWER:
        return 'Harvester Strength';
      case UpgradeTypes.AUTO_GATHER:
        return 'Auto Harvester';
      case UpgradeTypes.GATHER_SPEED:
        return 'Regrowth Speed';
      case UpgradeTypes.VIEW_RANGE:
        return 'View Range';
      default:
        return '';
    }
  };

  const getUpgradeIcon = (upgradeType: UpgradeTypes): string => {
    switch (upgradeType) {
      case UpgradeTypes.CLICK_POWER:
        return '🔨';
      case UpgradeTypes.AUTO_GATHER:
        return '🤖';
      case UpgradeTypes.GATHER_SPEED:
        return '⏱️';
      case UpgradeTypes.VIEW_RANGE:
        return '👁️';
      default:
        return '';
    }
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg text-white">
      <h2 className="text-xl font-bold mb-3">Upgrades</h2>
      <div className="space-y-3">
        {Object.values(UpgradeTypes).map((upgradeType) => (
          <div key={upgradeType} className="bg-gray-700 p-3 rounded">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center">
                <span className="text-xl mr-2">{getUpgradeIcon(upgradeType)}</span>
                <span className="text-lg">{getUpgradeName(upgradeType)}</span>
              </div>
              <span className="text-sm bg-gray-600 px-2 py-1 rounded">Lvl {upgrades[upgradeType].level}</span>
            </div>
            
            <p className="text-sm text-gray-300 mb-2">{getUpgradeDescription(upgradeType)}</p>
            
            <div className="flex justify-between items-center">
              <div className="flex space-x-2 text-sm">
                <span className="bg-gray-600 px-2 py-1 rounded flex items-center">
                  🪵 {upgrades[upgradeType].cost[ResourceType.WOOD]}
                </span>
                <span className="bg-gray-600 px-2 py-1 rounded flex items-center">
                  🪨 {upgrades[upgradeType].cost[ResourceType.STONE]}
                </span>
                <span className="bg-gray-600 px-2 py-1 rounded flex items-center">
                  ⚡ {upgrades[upgradeType].cost[ResourceType.ENERGY]}
                </span>
              </div>
              
              <button
                className={`px-3 py-1 rounded font-bold ${
                  canAfford(upgradeType)
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-gray-500 cursor-not-allowed'
                }`}
                onClick={() => onPurchase(upgradeType)}
                disabled={!canAfford(upgradeType)}
              >
                Upgrade
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UpgradePanel;