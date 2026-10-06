export interface Item {
  id: string
  name: string
  description: string
  createdAt: string
}

export interface NewItem {
  name: string
  description: string
}

export type ValidationErrors = Partial<Record<keyof NewItem, string>>

export const NAME_MAX = 60
export const DESCRIPTION_MAX = 200

/** Valida una entrada de alta. Devuelve un objeto vacío si es válida. */
export function validateItem(input: NewItem): ValidationErrors {
  const errors: ValidationErrors = {}
  const name = input.name.trim()
  if (!name) errors.name = 'El nombre es obligatorio.'
  else if (name.length > NAME_MAX) errors.name = `Máximo ${NAME_MAX} caracteres.`
  if (input.description.trim().length > DESCRIPTION_MAX) {
    errors.description = `Máximo ${DESCRIPTION_MAX} caracteres.`
  }
  return errors
}

export function normalizeItem(input: NewItem): NewItem {
  return { name: input.name.trim(), description: input.description.trim() }
}
