const VALID_MODES = ['mock', 'http'];

/**
 * Lee y valida la configuración de entorno.
 * @param {Record<string, string|undefined>} raw
 * @returns {{ dataMode: 'mock'|'http', apiBaseUrl: string }}
 */
export function readEnv(raw = import.meta.env) {
  const dataMode = raw.VITE_DATA_MODE || 'mock';
  if (!VALID_MODES.includes(dataMode)) {
    throw new Error(`VITE_DATA_MODE inválido: ${dataMode}. Use: ${VALID_MODES.join(', ')}`);
  }
  const apiBaseUrl = (raw.VITE_API_BASE_URL || '').replace(/\/+$/, '');
  if (dataMode === 'http' && !apiBaseUrl) {
    throw new Error('VITE_API_BASE_URL es obligatorio en modo http');
  }
  return { dataMode, apiBaseUrl };
}
