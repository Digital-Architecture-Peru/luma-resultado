<script lang="ts">
  import Badge from '../atoms/Badge.svelte';
  import Button from '../atoms/Button.svelte';
  import { maskCard, TYPE_LABELS, type CardNotification } from '../../model/notification';

  export let notification: CardNotification;
  export let onRead: (id: string) => void = () => {};

  const TONES = {
    purchase: 'info',
    limit: 'warning',
    blocked: 'danger',
    payment_due: 'warning',
  } as const;

  $: date = new Date(notification.createdAt).toLocaleString('es', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'UTC',
  });
</script>

<li class="item" class:unread={!notification.read}>
  <div class="head">
    <Badge tone={TONES[notification.type]}>{TYPE_LABELS[notification.type]}</Badge>
    <span class="card">{maskCard(notification.cardLast4)}</span>
    {#if !notification.read}<Badge tone="info">Nueva</Badge>{/if}
  </div>
  <p class="msg">{notification.message}</p>
  <div class="foot">
    <time datetime={notification.createdAt}>{date}</time>
    {#if !notification.read}
      <Button variant="ghost" onClick={() => onRead(notification.id)}>Marcar como leída</Button>
    {/if}
  </div>
</li>

<style>
  .item {
    list-style: none;
    padding: var(--space-4);
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-sm);
  }
  .unread {
    border-inline-start: 4px solid var(--primary);
  }
  .head, .foot {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    flex-wrap: wrap;
    justify-content: space-between;
  }
  .card { font-variant-numeric: tabular-nums; color: var(--muted); margin-inline-end: auto; }
  .msg { margin: var(--space-2) 0; }
  time { color: var(--muted); font-size: 0.85rem; }
</style>
