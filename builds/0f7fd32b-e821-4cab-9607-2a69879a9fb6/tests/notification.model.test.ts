import { describe, it, expect } from 'vitest';
import {
  applyFilter,
  countUnread,
  maskCard,
  sortByRecent,
  type CardNotification,
} from '../src/lib/model/notification';

const make = (id: string, over: Partial<CardNotification> = {}): CardNotification => ({
  id,
  cardLast4: '1234',
  type: 'purchase',
  message: 'm',
  createdAt: '2026-10-01T00:00:00Z',
  read: false,
  ...over,
});

describe('modelo de notificación', () => {
  it('given 4 dígitos when se enmascara then oculta el resto', () => {
    expect(maskCard('4321')).toBe('•••• 4321');
  });

  it('given un valor inválido when se enmascara then lanza error', () => {
    expect(() => maskCard('12')).toThrow();
  });

  it('given mezcla when se cuentan no leídas then solo suma las no leídas', () => {
    expect(countUnread([make('a'), make('b', { read: true })])).toBe(1);
  });

  it('given fechas distintas when se ordena then las recientes van primero sin mutar', () => {
    const input = [make('a'), make('b', { createdAt: '2026-10-05T00:00:00Z' })];
    expect(sortByRecent(input).map((n) => n.id)).toEqual(['b', 'a']);
    expect(input[0].id).toBe('a');
  });

  it('given filtros when se aplican then filtra por no leídas y por tipo', () => {
    const items = [make('a'), make('b', { read: true, type: 'limit' })];
    expect(applyFilter(items, 'unread').map((n) => n.id)).toEqual(['a']);
    expect(applyFilter(items, 'limit').map((n) => n.id)).toEqual(['b']);
    expect(applyFilter(items, 'all')).toHaveLength(2);
  });
});
