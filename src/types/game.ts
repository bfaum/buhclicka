// Tile types
export enum TileType {
    EMPTY = 'empty',
    FOREST = 'forest',
    ROCK = 'rock',
    ENERGY = 'energy',
  }
  
  // Tile state interface
  export interface Tile {
    type: TileType;
    x: number;
    y: number;
    depleted: boolean;
    regrowthTime: number | null;
    lastHarvested: number | null;
  }
  
  // Resource types
  export enum ResourceType {
    WOOD = 'wood',
    STONE = 'stone',
    ENERGY = 'energy',
  }
  
  // Resources interface
  export interface Resources {
    [ResourceType.WOOD]: number;
    [ResourceType.STONE]: number;
    [ResourceType.ENERGY]: number;
  }
  
  // Upgrade types
  export enum UpgradeType {
    CLICK_POWER = 'clickPower',
    AUTO_GATHER = 'autoGather',
    GATHER_SPEED = 'gatherSpeed',
    VIEW_RANGE = 'viewRange',
  }
  
  // Upgrade interface
  export interface Upgrade {
    type: UpgradeType;
    level: number;
    cost: Resources;
    effect: number;
  }
  
  // Game state interface
  export interface GameState {
    tiles: Record<string, Tile>;
    resources: Resources;
    upgrades: Record<UpgradeType, Upgrade>;
    viewRange: number;
    position: { x: number, y: number };
    lastTick: number;
  }
  
  // Utility function to get key for a position
  export const getTileKey = (x: number, y: number): string => `${x},${y}`;