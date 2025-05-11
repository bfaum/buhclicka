import { type GameState } from '../types/game';

const STORAGE_KEY = 'resource-clicker-save';

// Save game state to localStorage
export const saveGameState = (state: GameState): void => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem(STORAGE_KEY, serializedState);
  } catch (error) {
    console.error('Failed to save game state:', error);
  }
};

// Load game state from localStorage
export const loadGameState = (): GameState | null => {
  try {
    const serializedState = localStorage.getItem(STORAGE_KEY);
    if (!serializedState) {
      return null;
    }
    return JSON.parse(serializedState);
  } catch (error) {
    console.error('Failed to load game state:', error);
    return null;
  }
};

// Clear saved game state
export const clearGameState = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear game state:', error);
  }
};