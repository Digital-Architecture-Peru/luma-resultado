<script>
  import { createEventDispatcher } from 'svelte';
  import Badge from '../atoms/Badge.svelte';
  import Button from '../atoms/Button.svelte';

  export let unread = 0;
  const dispatch = createEventDispatcher();
</script>

<header class="banner">
  <h1>Notificaciones <Badge count={unread} /></h1>
  <div role="status" aria-live="polite">
    {unread > 0
      ? `Tienes ${unread} notificación${unread === 1 ? '' : 'es'} sin leer`
      : 'Estás al día'}
  </div>
  <Button variant="secondary" disabled={unread === 0} on:click={() => dispatch('readall')}>
    Marcar todas como leídas
  </Button>
</header>

<style>
  .banner {
    display: grid;
    gap: 0.5rem;
    padding: 1rem;
    background: #0b3d91;
    color: #fff;
  }
  h1 {
    margin: 0;
    font-size: 1.25rem;
    display: flex;
    gap: 0.5rem;
    align-items: center;
  }
</style>
