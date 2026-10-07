import type { InjectionKey } from 'vue';
import type { AccountRepository } from './AccountRepository';

export const AccountRepositoryKey: InjectionKey<AccountRepository> = Symbol('AccountRepository');
