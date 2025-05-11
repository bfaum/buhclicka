import { type GameState, type Tile, TileType, ResourceType, UpgradeType, type Resources, type Upgrade, getTileKey } from '../types/game';

// Initialize a new game state
export const initializeGameState = (): GameState => {
  const gameState: GameState = {
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
        effect: 1,
        cost: {
          [ResourceType.WOOD]: 10,
          [ResourceType.STONE]: 5,
          [ResourceType.ENERGY]: 0,
        },
      },
      [UpgradeType.AUTO_GATHER]: {
        type: UpgradeType.AUTO_GATHER,
        level: 0,
        effect: 0,
        cost: {
          [ResourceType.WOOD]: 50,
          [ResourceType.STONE]: 25,
          [ResourceType.ENERGY]: 10,
        },
      },
      [UpgradeType.GATHER_SPEED]: {
        type: UpgradeType.GATHER_SPEED,
        level: 1,
        effect: 1.0, // Multiplier for regrowth time (lower is faster)
        cost: {
          [ResourceType.WOOD]: 20,
          [ResourceType.STONE]: 20,
          [ResourceType.ENERGY]: 5,
        },
      },
      [UpgradeType.VIEW_RANGE]: {
        type: UpgradeType.VIEW_RANGE,
        level: 1,
        effect: 3, // Default view range
        cost: {
          [ResourceType.WOOD]: 30,
          [ResourceType.STONE]: 30,
          [ResourceType.ENERGY]: 20,
        },
      },
    },
    viewRange: 3,
    position: { x: 0, y: 0 },
    lastTick: Date.now(),
  };

  // Generate initial tiles
  generateTiles(gameState);

  return gameState;
};

// Generate tiles around the current position
const generateTiles = (gameState: GameState): void => {
  const { position, viewRange } = gameState;
  const expandedRange = viewRange + 5; // Generate a bit beyond view range

  for (let y = position.y - expandedRange; y <= position.y + expandedRange; y++) {
    for (let x = position.x - expandedRange; x <= position.x + expandedRange; x++) {
      const key = getTileKey(x, y);
      if (!gameState.tiles[key]) {
        gameState.tiles[key] = generateTile(x, y);
      }
    }
  }
};

// Generate a single tile based on position
const generateTile = (x: number, y: number): Tile => {
  // Use a simple pseudo-random function based on coordinates
  const hash = Math.abs((x * 12345 + y * 54321) % 1000) / 1000;
  
  let type: TileType;
  if (hash < 0.4) {
    type = TileType.FOREST;
  } else if (hash < 0.7) {
    type = TileType.ROCK;
  } else if (hash < 0.85) {
    type = TileType.ENERGY;
  } else {
    type = TileType.EMPTY;
  }

  return {
    type,
    x,
    y,
    depleted: false,
    regrowthTime: null,
    lastHarvested: null,
  };
};

// Harvest a tile
export const harvestTile = (gameState: GameState, x: number, y: number): void => {
  const key = getTileKey(x, y);
  const tile = gameState.tiles[key];

  if (!tile || tile.depleted) {
    return;
  }

  // Get resource based on tile type
  let resourceType: ResourceType | null = null;
  switch (tile.type) {
    case TileType.FOREST:
      resourceType = ResourceType.WOOD;
      break;
    case TileType.ROCK:
      resourceType = ResourceType.STONE;
      break;
    case TileType.ENERGY:
      resourceType = ResourceType.ENERGY;
      break;
    default:
      break;
  }

  if (resourceType) {
    // Add resources based on click power
    const clickPower = gameState.upgrades[UpgradeType.CLICK_POWER].effect;
    gameState.resources[resourceType] += clickPower;

    // Deplete the tile
    tile.depleted = true;
    tile.lastHarvested = Date.now();
    
    // Set regrowth time based on gather speed upgrade
    const baseRegrowthTime = 10000; // 10 seconds
    const speedMultiplier = gameState.upgrades[UpgradeType.GATHER_SPEED].effect;
    tile.regrowthTime = baseRegrowthTime * speedMultiplier;
  }
};

// Update game state on each tick
export const updateGameState = (gameState: GameState): void => {
  const now = Date.now();
  const elapsed = now - gameState.lastTick;
  gameState.lastTick = now;

  // Update depleted tiles
  Object.values(gameState.tiles).forEach(tile => {
    if (tile.depleted && tile.lastHarvested && tile.regrowthTime) {
      const timeSinceHarvest = now - tile.lastHarvested;
      if (timeSinceHarvest >= tile.regrowthTime) {
        tile.depleted = false;
        tile.lastHarvested = null;
        tile.regrowthTime = null;
      }
    }
  });

  // Auto gathering logic
  const autoGatherLevel = gameState.upgrades[UpgradeType.AUTO_GATHER].effect;
  if (autoGatherLevel > 0) {
    // Find non-depleted tiles to harvest automatically
    const availableTiles = Object.values(gameState.tiles).filter(
      tile => !tile.depleted && tile.type !== TileType.EMPTY
    );

    // Sort by distance to current position for more sensible auto-gathering
    availableTiles.sort((a, b) => {
      const distA = Math.abs(a.x - gameState.position.x) + Math.abs(a.y - gameState.position.y);
      const distB = Math.abs(b.x - gameState.position.x) + Math.abs(b.y - gameState.position.y);
      return distA - distB;
    });

    // Auto-harvest up to the auto-gather level number of tiles
    for (let i = 0; i < Math.min(autoGatherLevel, availableTiles.length); i++) {
      harvestTile(gameState, availableTiles[i].x, availableTiles[i].y);
    }
  }

  // Generate new tiles if needed as player moves
  generateTiles(gameState);

  // Update view range based on upgrade
  gameState.viewRange = Math.floor(gameState.upgrades[UpgradeType.VIEW_RANGE].effect);
};

// Check if player can afford an upgrade
export const canAffordUpgrade = (gameState: GameState, upgradeType: UpgradeType): boolean => {
  const upgrade = gameState.upgrades[upgradeType];
  const { cost } = upgrade;

  return (
    gameState.resources[ResourceType.WOOD] >= cost[ResourceType.WOOD] &&
    gameState.resources[ResourceType.STONE] >= cost[ResourceType.STONE] &&
    gameState.resources[ResourceType.ENERGY] >= cost[ResourceType.ENERGY]
  );
};

// Purchase an upgrade
export const purchaseUpgrade = (gameState: GameState, upgradeType: UpgradeType): void => {
  if (!canAffordUpgrade(gameState, upgradeType)) {
    return;
  }

  const upgrade = gameState.upgrades[upgradeType];
  
  // Deduct resources
  gameState.resources[ResourceType.WOOD] -= upgrade.cost[ResourceType.WOOD];
  gameState.resources[ResourceType.STONE] -= upgrade.cost[ResourceType.STONE];
  gameState.resources[ResourceType.ENERGY] -= upgrade.cost[ResourceType.ENERGY];

  // Increase upgrade level
  upgrade.level += 1;

  // Update upgrade effect based on type
  switch (upgradeType) {
    case UpgradeType.CLICK_POWER:
      upgrade.effect = upgrade.level;
      break;
    case UpgradeType.AUTO_GATHER:
      upgrade.effect = upgrade.level;
      break;
    case UpgradeType.GATHER_SPEED:
      // Decrease regrowth time (faster regrowth)
      upgrade.effect = Math.max(0.2, 1.0 - (upgrade.level - 1) * 0.1);
      break;
    case UpgradeType.VIEW_RANGE:
      // Increase view range
      upgrade.effect = 3 + (upgrade.level - 1);
      break;
  }

  // Increase cost for next level
  const costMultiplier = 1.5;
  upgrade.cost = {
    [ResourceType.WOOD]: Math.floor(upgrade.cost[ResourceType.WOOD] * costMultiplier),
    [ResourceType.STONE]: Math.floor(upgrade.cost[ResourceType.STONE] * costMultiplier),
    [ResourceType.ENERGY]: Math.floor(upgrade.cost[ResourceType.ENERGY] * costMultiplier),
  };
};

// Move player position
export const movePosition = (gameState: GameState, deltaX: number, deltaY: number): void => {
  gameState.position.x += deltaX;
  gameState.position.y += deltaY;
  
  // Generate new tiles around the new position
  generateTiles(gameState);
};