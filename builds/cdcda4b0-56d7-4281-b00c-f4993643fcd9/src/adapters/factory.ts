import type { ItemGateway } from '../ports/ItemGateway'
import { MockItemGateway } from './mockItemGateway'
import { HttpItemGateway } from './httpItemGateway'

export function createGateway(env: { VITE_GATEWAY?: string; VITE_API_BASE_URL?: string }): ItemGateway {
  if (env.VITE_GATEWAY === 'http' && env.VITE_API_BASE_URL) {
    return new HttpItemGateway(env.VITE_API_BASE_URL)
  }
  return new MockItemGateway()
}
