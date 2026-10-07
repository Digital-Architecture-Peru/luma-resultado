import { describe, it, expect } from 'vitest';
import { get } from 'svelte/store';
import { createNotificationStore } from '../src/lib/stores/notifications.js';

const n = (id, date, read = false) => ({
  id,
  type: 'compra',
  cardLast4: '1234',
  title: 't',
  body: 'b',
  createdAt: date,
  read
});

const source = (data) => ({ list: async () => data });

describe('notification store', () => {
  it('given a source when load then items sorted and status ready', async () => {
    const s = createNotificationStore(
      source([n('a', '2026-01-01T00:00:00Z'), n('b', '2026-01-02T00:00:00Z')])
    );
    await s.load();
    expect(get(s.status)).toBe('ready');
    expect(get(s.items).map((i) => i.id)).toEqual(['b', 'a']);
    expect(get(s.unread)).toBe(2);
  });

  it('given invalid entries when load then they are discarded', async () => {
    const s = createNotificationStore(source([n('a', '2026-01-01T00:00:00Z'), { id: 'bad' }]));
    await s.load();
    expect(get(s.items)).toHaveLength(1);
  });

  it('given maxItems when load then list is truncated', async () => {
    const s = createNotificationStore(
      source([n('a', '2026-01-01T00:00:00Z'), n('b', '2026-01-02T00:00:00Z')]),
      { maxItems: 1 }
    );
    await s.load();
    expect(get(s.items)).toHaveLength(1);
  });

  it('given markRead and markAllRead then unread decreases', async () => {
    const s = createNotificationStore(
      source([n('a', '2026-01-01T00:00:00Z'), n('b', '2026-01-02T00:00:00Z')])
    );
    await s.load();
    s.markRead('a');
    expect(get(s.unread)).toBe(1);
    s.markAllRead();
    expect(get(s.unread)).toBe(0);
  });

  it('given a failing source when load then status error and empty items', async () => {
    const s = createNotificationStore({
      list: async () => {
        throw new Error('fail');
      }
    });
    await s.load();
    expect(get(s.status)).toBe('error');
    expect(get(s.items)).toEqual([]);
  });

  it('given an invalid source then constructor throws', () => {
    expect(() => createNotificationStore({})).toThrow(TypeError);
  });
});
