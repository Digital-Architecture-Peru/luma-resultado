<script lang="ts">
  import NotificationCenter from './lib/components/organisms/NotificationCenter.svelte';
  import { InMemoryNotificationGateway } from './lib/services/notificationGateway';
  import { createNotificationStore } from './lib/stores/notificationStore';

  // Único punto de composición: sustituir el gateway por un adaptador HTTP cuando se defina la integración.
  const store = createNotificationStore(new InMemoryNotificationGateway());
</script>

<main>
  <NotificationCenter {store} />
</main>
