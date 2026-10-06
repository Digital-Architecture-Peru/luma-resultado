import { readEnv } from '../config/env.js';
import { createMockTaskRepository } from './mockTaskRepository.js';
import { createHttpTaskRepository } from './httpTaskRepository.js';

/**
 * Fábrica según VITE_DATA_MODE.
 * @param {{ dataMode: string, apiBaseUrl: string }} config
 */
export function createRepository(config = readEnv()) {
  if (config.dataMode === 'http') {
    return createHttpTaskRepository(config.apiBaseUrl);
  }
  return createMockTaskRepository();
}
