import { ref } from 'vue'
import type { Item, NewItem } from '../domain/item'
import { validateItem } from '../domain/item'
import type { ItemGateway } from '../ports/ItemGateway'

export function useItems(gateway: ItemGateway) {
  const items = ref<Item[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function load(): Promise<void> {
    loading.value = true
    error.value = null
    try {
      items.value = await gateway.list()
    } catch {
      error.value = 'No se pudo cargar la lista.'
    } finally {
      loading.value = false
    }
  }

  /** Devuelve true si se creó el item. */
  async function add(input: NewItem): Promise<boolean> {
    if (Object.keys(validateItem(input)).length > 0) {
      error.value = 'Los datos no son válidos.'
      return false
    }
    error.value = null
    try {
      const created = await gateway.create(input)
      items.value = [...items.value, created]
      return true
    } catch {
      error.value = 'No se pudo crear el item.'
      return false
    }
  }

  return { items, loading, error, load, add }
}
