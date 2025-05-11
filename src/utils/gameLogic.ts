import { TileType, ResourceType, GameState, Tile, UpgradeType, getTileKey } from '../types/game';

// Constants
const INITIAL_VIEW_RANGE = 5;
const REGROWTH_TIME = 10000; // 10 seconds in ms

// Initialize a new game state
export const initializeGameState = (): GameState => {
  const initialState: GameState = {
    tiles: {},
    resources: {
      [ResourceType.WOOD]: 0,
      [ResourceType.STONE]: 0,
      [ResourceType.ENERGY]: 0,
    },
    upgrades: {
      [UpgradeType.CLICK_POWER]: {
        type: UpgradeType.CLICK_POWER,
        level: 1,
        cost: {
          [ResourceType.WOOD]: 10,
          [ResourceType.STONE]: 5,
          [ResourceType.ENERGY]: 2,
        },
        effect: 1,
      },
      [UpgradeType.AUTO_GATHER]: {
        type: UpgradeType.AUTO_GATHER,
        level: 0,
        cost: {
          [ResourceType.WOOD]: 50,
          [ResourceType.STONE]: 30,
          [ResourceType.ENERGY]: 20,
        },
        effect: 0,
      },
      [UpgradeType.GATHER_SPEED]: {
        type: UpgradeType.GATHER_SPEED,
        level: 1,
        cost: {
          [ResourceType.WOOD]: 30,
          [ResourceType.STONE]: 20,
          [ResourceType.ENERGY]: 10,
        },
        effect: 1,
      },
      [UpgradeType.VIEW_RANGE]: {
        type: UpgradeType.VIEW_RANGE,
        level: 1,
        cost: {
          [ResourceType.WOOD]: 20,
          [ResourceType.STONE]: 15,
          [ResourceType.ENERGY]: 25,
        },
        effect: INITIAL_VIEW_RANGE,
      },
    },
    viewRange: INITIAL_VIEW_RANGE,
    position: { x: 0, y: 0 },
    lastTick: Date.now(),
  };

  // Generate initial tiles
  generateTiles(initialState);
  
  return initialState;
};

// Pseudo-random number generator with seed
const mulberry32 = (seed: number) => {
  return () => {
    let t = seed += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
};

// Generate tile based on position
export const generateTile = (x: number, y: number): Tile => {
  const seed = x * 10000 + y;
  const random = mulberry32(seed);
  
  const value = random();
  let type: TileType;
  
  if (value < 0.4) {
    type = TileType.FOREST;
  } else if (value < 0.7) {
    type = TileType.ROCK;
  } else if (value < 0.85) {
    type = TileType.ENERGY;
  } else {
    type = TileType.EMPTY;
  }
  
  return {
    type,
    x,
    y,
    depleted: false,
    regrowthTime: type !== TileType.EMPTY ? REGROWTH_TIME : null,
    lastHarvested: null,
  };
};

// Generate tiles within view range
export const generateTiles = (state: GameState): void => {
  const { position, viewRange } = state;
  
  for (let y = position.y - viewRange; y <= position.y + viewRange; y++) {
    for (let x = position.x - viewRange; x <= position.x + viewRange; x++) {
      const key = getTileKey(x, y);
      if (!state.tiles[key]) {
        state.tiles[key] = generateTile(x, y);
      }
    }
  }
};

// Update tile state (regrowth)
export const updateTiles = (state: GameState): void => {
  const now = Date.now();
  
  Object.values(state.tiles).forEach(tile => {
    if (tile.depleted && tile.lastHarvested && tile.regrowthTime) {
      if (now - tile.lastHarvested >= tile.regrowthTime) {
        tile.depleted = false;
      }
    }
  });
};

// Get resource type from tile type
export const getResourceFromTile = (tileType: TileType): ResourceType | null => {
  switch (tileType) {
    case TileType.FOREST:
      return ResourceType.WOOD;
    case TileType.ROCK:
      return ResourceType.STONE;
    case TileType.ENERGY:
      return ResourceType.ENERGY;
    default:
      return null;
  }
};

// Harvest a tile
export const harvestTile = (state: GameState, x: number, y: number): boolean => {
  const key = getTileKey(x, y);
  const tile = state.tiles[key];
  
  if (!tile || tile.depleted || tile.type === TileType.EMPTY) {
    return false;
  }
  
  const resourceType = getResourceFromTile(tile.type);
  if (!resourceType) {
    return false;
  }
  
  // Add resources based on click power
  state.resources[resourceType] += state.upgrades[UpgradeType.CLICK_POWER].effect;
  
  // Update tile state
  tile.depleted = true;
  tile.lastHarvested = Date.now();
  
  return true;
};

// Auto-gather resources
export const autoGather = (state: GameState): void => {
  if (state.upgrades[UpgradeType.AUTO_GATHER].level === 0) {
    return;
  }
  
  const validTiles = Object.values(state.tiles).filter(
    tile => !tile.depleted && tile.type !== TileType.EMPTY
  );
  
  if (validTiles.length === 0) {
    return;
  }
  
  const autoGatherPower = state.upgrades[UpgradeType.AUTO_GATHER].effect;
  
  for (let i = 0; i < Math.min(autoGatherPower, validTiles.length); i++) {
    const randomIndex = Math.floor(Math.random() * validTiles.length);
    const tile = validTiles[randomIndex];
    
    if (tile) {
      harvestTile(state, tile.x, tile.y);
      validTiles.splice(randomIndex, 1);
    }
  }
};

// Check if player can afford upgrade
export const canAffordUpgrade = (
  state: GameState,
  upgradeType: UpgradeType
): boolean => {
  const upgrade = state.upgrades[upgradeType];
  
  return (
    state.resources[ResourceType.WOOD] >= upgrade.cost[ResourceType.WOOD] &&
    state.resources[ResourceType.STONE] >= upgrade.cost[ResourceType.STONE] &&
    state.resources[ResourceType.ENERGY] >= upgrade.cost[ResourceType.ENERGY]
  );
};

// Purchase an upgrade
export const purchaseUpgrade = (
  state: GameState,
  upgradeType: UpgradeType
): boolean => {
  if (!canAffordUpgrade(state, upgradeType)) {
    return false;
  }
  
  const upgrade = state.upgrades[upgradeType];
  
  // Reduce resources
  state.resources[ResourceType.WOOD] -= upgrade.cost[ResourceType.WOOD];
  state.resources[ResourceType.STONE] -= upgrade.cost[ResourceType.STONE];
  state.resources[ResourceType.ENERGY] -= upgrade.cost[ResourceType.ENERGY];
  
  // Increase level and effect
  upgrade.level += 1;
  
  // Increase costs for next level
  upgrade.cost[ResourceType.WOOD] = Math.floor(upgrade.cost[ResourceType.WOOD] * 1.5);
  upgrade.cost[ResourceType.STONE] = Math.floor(upgrade.cost[ResourceType.STONE] * 1.5);
  upgrade.cost[ResourceType.ENERGY] = Math.floor(upgrade.cost[ResourceType.ENERGY] * 1.5);
  
  // Update effects based on upgrade type
  switch (upgradeType) {
    case UpgradeType.CLICK_POWER:
      upgrade.effect = upgrade.level;
      break;
    case UpgradeType.AUTO_GATHER:
      upgrade.effect = upgrade.level;
      break;
    case UpgradeType.GATHER_SPEED:
      // Reduce regrowth time
      upgrade.effect = Math.max(0.5, 1 - (upgrade.level - 1) * 0.1);
      // Update all tiles with new regrowth time
      Object.values(state.tiles).forEach(tile => {
        if (tile.regrowthTime) {
          tile.regrowthTime = REGROWTH_TIME * upgrade.effect;
        }
      });
      break;
    case UpgradeType.VIEW_RANGE:
      upgrade.effect = INITIAL_VIEW_RANGE + (upgrade.level - 1);
      state.viewRange = upgrade.effect;
      // Generate new tiles based on increased view range
      generateTiles(state);
      break;
  }
  
  return true;
};

// Update game state (tick)
export const updateGameState = (state: GameState): void => {
  const now = Date.now();
  const deltaTime = now - state.lastTick;
  
  // Update tiles (regrowth)
  updateTiles(state);
  
  // Auto-gather if available
  if (state.upgrades[UpgradeType.AUTO_GATHER].level > 0 && deltaTime >= 1000) {
    autoGather(state);
    state.lastTick = now;
  }
};

// Move viewport
export const movePosition = (
  state: GameState,
  deltaX: number,
  deltaY: number
): void => {
  state.position.x += deltaX;
  state.position.y += deltaY;
  
  // Generate new tiles after moving
  generateTiles(state);
};