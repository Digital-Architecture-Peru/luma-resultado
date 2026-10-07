<script>
  import { createEventDispatcher } from 'svelte';
  import Icon from '../atoms/Icon.svelte';
  import Button from '../atoms/Button.svelte';
  import Timestamp from '../atoms/Timestamp.svelte';
  import CardChip from './CardChip.svelte';
  import { formatAmount } from '../../domain/notification.js';

  /** @type {import('../../domain/notification.js').Notification} */
  export let notification;

  const dispatch = createEventDispatcher();
  $: amountText = formatAmount(notification.amount);
</script>

<article class="item" class:unread={!notification.read} data-read={notification.read}>
  <Icon type={notification.type} />
  <div class="content">
    <h3>{notification.title}</h3>
    <p>{notification.body}</p>
    <div class="meta">
      <CardChip last4={notification.cardLast4} />
      {#if amountText}<strong>{amountText}</strong>{/if}
      <Timestamp value={notification.createdAt} />
    </div>
  </div>
  {#if !notification.read}
    <Button variant="secondary" on:click={() => dispatch('read', notification.id)}>
      Marcar como leída
    </Button>
  {/if}
</article>

<style>
  .item {
    display: flex;
    gap: 0.75rem;
    align-items: flex-start;
    flex-wrap: wrap;
    padding: 0.75rem;
    border: 1px solid #d0d5dd;
    border-radius: 12px;
    background: #fff;
  }
  .unread {
    border-left: 6px solid #0b3d91;
    background: #f5f8ff;
  }
  .content {
    flex: 1 1 12rem;
    min-width: 0;
  }
  h3 {
    margin: 0 0 0.25rem;
    font-size: 1rem;
  }
  p {
    margin: 0 0 0.5rem;
  }
  .meta {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
    align-items: center;
  }
</style>
