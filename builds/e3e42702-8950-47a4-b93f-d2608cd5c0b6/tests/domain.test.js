import { describe, it, expect } from 'vitest';
import {
  maskCard,
  sortByDate,
  unreadCount,
  markRead,
  markAllRead,
  isValidNotification
} from '../src/lib/domain/notification.js';

const base = { type: 'compra', cardLast4: '1234', title: 't', body: 'b' };
const list = () => [
  { ...base, id: 'a', createdAt: '2026-01-01T10:00:00Z', read: false },
  { ...base, id: 'b', createdAt: '2026-01-03T10:00:00Z', read: true },
  { ...base, id: 'c', createdAt: '2026-01-02T10:00:00Z', read: false }
];

describe('domain/notification', () => {
  it('given a full PAN when masking then only last 4 digits remain', () => {
    expect(maskCard('4111 1111 1111 1234')).toBe('•••• 1234');
  });

  it('given short input when masking then returns placeholder', () => {
    expect(maskCard('12')).toBe('•••• ----');
    expect(maskCard(undefined)).toBe('•••• ----');
  });

  it('given items when sorting then newest first and input not mutated', () => {
    const input = list();
    const sorted = sortByDate(input);
    expect(sorted.map((n) => n.id)).toEqual(['b', 'c', 'a']);
    expect(input.map((n) => n.id)).toEqual(['a', 'b', 'c']);
  });

  it('given items when counting then returns unread only', () => {
    expect(unreadCount(list())).toBe(2);
  });

  it('given an id when markRead then only that item changes', () => {
    const out = markRead(list(), 'a');
    expect(out.find((n) => n.id === 'a').read).toBe(true);
    expect(unreadCount(out)).toBe(1);
  });

  it('given items when markAllRead then none unread', () => {
    expect(unreadCount(markAllRead(list()))).toBe(0);
  });

  it('validates structure', () => {
    expect(isValidNotification({ ...base, id: 'x', createdAt: '2026-01-01T00:00:00Z', read: false })).toBe(true);
    expect(isValidNotification({ ...base, id: 'x', createdAt: 'nope', read: false })).toBe(false);
    expect(isValidNotification({ ...base, type: 'otro', id: 'x', createdAt: '2026-01-01T00:00:00Z', read: false })).toBe(false);
    expect(isValidNotification(null)).toBe(false);
  });
});
