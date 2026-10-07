<script>
  export let type = 'compra';
  const icons = { compra: '🛒', pago_proximo: '📅', bloqueo: '🔒', limite: '📈' };
</script>

<span class="icon" aria-hidden="true">{icons[type] ?? '🔔'}</span>

<style>
  .icon {
    font-size: 1.5rem;
    line-height: 1;
  }
</style>
