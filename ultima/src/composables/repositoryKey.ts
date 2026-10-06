import type { InjectionKey } from 'vue'
import type { CardRepository } from '../domain/cardRepository'

export const cardRepositoryKey: InjectionKey<CardRepository> = Symbol('cardRepository')
