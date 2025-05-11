import { GameState } from '../types/game';

const STORAGE_KEY = 'resource-clicker-save';

export const saveGameState = (state: GameState): void => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem(STORAGE_KEY, serializedState);
  } catch (err) {
    console.error('Could not save game state:', err);
  }
};

export const loadGameState = (): GameState | null => {
  try {
    const serializedState = localStorage.getItem(STORAGE_KEY);
    if (!serializedState) return null;
    return JSON.parse(serializedState);
  } catch (err) {
    console.error('Could not load saved game state:', err);
    return null;
  }
};

export const clearGameState = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error('Could not clear game state:', err);
  }
};