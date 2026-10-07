<script>
  import { createEventDispatcher } from 'svelte';
  import NotificationItem from '../molecules/NotificationItem.svelte';

  export let items = [];
  const dispatch = createEventDispatcher();
</script>

{#if items.length === 0}
  <p class="empty">No tienes notificaciones.</p>
{:else}
  <ul>
    {#each items as n (n.id)}
      <li>
        <NotificationItem notification={n} on:read={(e) => dispatch('read', e.detail)} />
      </li>
    {/each}
  </ul>
{/if}

<style>
  ul {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    gap: 0.75rem;
  }
  .empty {
    text-align: center;
    color: #4a4a4a;
    padding: 2rem 0;
  }
</style>
