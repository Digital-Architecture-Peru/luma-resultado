import '@angular/compiler';
import { describe, expect, it, vi } from 'vitest';
import { of } from 'rxjs';
import type { HttpClient } from '@angular/common/http';
import { CardService } from './card.service';
import { Card } from './card.model';

const sample: Card = {
  id: 'a0000000-0000-4000-8000-000000000001',
  maskedNumber: '**** **** **** 1234',
  last4: '1234',
  brand: 'VISA',
  type: 'CREDIT',
  status: 'ACTIVE',
  holderName: 'ANA EJEMPLO',
  creditLimit: 5000,
  availableBalance: 3250.75,
  currency: 'USD',
};

function setup() {
  const get = vi.fn();
  const service = new CardService({ get } as unknown as HttpClient);
  return { get, service };
}

describe('CardService', () => {
  it('given list, when called, then GETs the cards collection', () => {
    const { get, service } = setup();
    get.mockReturnValue(of([sample]));

    let received: Card[] = [];
    service.list().subscribe((cards) => (received = cards));

    expect(get).toHaveBeenCalledWith('/api/v1/cards');
    expect(received).toEqual([sample]);
  });

  it('given an id, when get, then GETs the encoded detail url', () => {
    const { get, service } = setup();
    get.mockReturnValue(of(sample));

    service.get('a/b').subscribe();

    expect(get).toHaveBeenCalledWith('/api/v1/cards/a%2Fb');
  });
});
