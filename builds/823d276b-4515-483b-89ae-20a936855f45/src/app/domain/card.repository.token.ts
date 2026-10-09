import { InjectionToken } from '@angular/core';
import { CardRepository } from './card.repository';

export const CARD_REPOSITORY = new InjectionToken<CardRepository>('CARD_REPOSITORY');
