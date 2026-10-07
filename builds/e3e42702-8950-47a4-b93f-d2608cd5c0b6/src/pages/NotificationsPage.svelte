<script>
  import { onMount } from 'svelte';
  import { notifications } from '../lib/stores/notifications.js';
  import NotificationsTemplate from '../lib/components/templates/NotificationsTemplate.svelte';
  import NotificationBanner from '../lib/components/organisms/NotificationBanner.svelte';
  import NotificationList from '../lib/components/organisms/NotificationList.svelte';

  const { items, status, unread } = notifications;

  onMount(() => notifications.load());
</script>

<NotificationsTemplate>
  <NotificationBanner
    slot="header"
    unread={$unread}
    on:readall={() => notifications.markAllRead()}
  />
  {#if $status === 'loading'}
    <p>Cargando…</p>
  {:else if $status === 'error'}
    <p role="alert">No se pudieron cargar las notificaciones.</p>
  {:else}
    <NotificationList items={$items} on:read={(e) => notifications.markRead(e.detail)} />
  {/if}
</NotificationsTemplate>
