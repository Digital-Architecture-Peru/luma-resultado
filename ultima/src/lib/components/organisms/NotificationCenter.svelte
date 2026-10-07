<script lang="ts">
  import { onMount } from 'svelte';
  import Button from '../atoms/Button.svelte';
  import NotificationItem from '../molecules/NotificationItem.svelte';
  import { FILTER_OPTIONS, type NotificationFilter } from '../../model/notification';
  import type { NotificationStore } from '../../stores/notificationStore';

  export let store: NotificationStore;

  const { state, visible, unread } = store;

  onMount(() => {
    void store.load();
  });

  function onFilterChange(event: Event): void {
    store.setFilter((event.currentTarget as HTMLSelectElement).value as NotificationFilter);
  }
</script>

<section aria-labelledby="nc-title" class="center">
  <header>
    <h1 id="nc-title">Notificaciones de tarjetas</h1>
    <p role="status" aria-live="polite">
      {$unread === 0 ? 'No tienes notificaciones sin leer' : `Tienes ${$unread} sin leer`}
    </p>
  </header>

  <div class="toolbar">
    <label>
      Filtrar
      <select value={$state.filter} on:change={onFilterChange}>
        {#each FILTER_OPTIONS as opt (opt.value)}
          <option value={opt.value}>{opt.label}</option>
        {/each}
      </select>
    </label>
    <Button disabled={$unread === 0} onClick={() => void store.markAllRead()}>
      Marcar todas como leídas
    </Button>
  </div>

  {#if $state.error}
    <p class="error" role="alert">{$state.error}</p>
  {/if}

  {#if $state.status === 'loading'}
    <p>Cargando notificaciones…</p>
  {:else if $state.status === 'success' && $visible.length === 0}
    <p>No hay notificaciones para este filtro.</p>
  {:else}
    <ul>
      {#each $visible as n (n.id)}
        <NotificationItem notification={n} onRead={(id) => void store.markRead(id)} />
      {/each}
    </ul>
  {/if}
</section>

<style>
  .center { max-width: 44rem; margin-inline: auto; padding: var(--space-6) var(--space-4); }
  h1 { font-size: 1.5rem; margin: 0; }
  .toolbar { display: flex; flex-wrap: wrap; gap: var(--space-3); align-items: end; justify-content: space-between; margin-block: var(--space-4); }
  select { min-height: 40px; margin-inline-start: var(--space-2); font: inherit; }
  ul { display: grid; gap: var(--space-3); padding: 0; margin: 0; }
  .error { color: var(--danger); font-weight: 600; }
</style>
