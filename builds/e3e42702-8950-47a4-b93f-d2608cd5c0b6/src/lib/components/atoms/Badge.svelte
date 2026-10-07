<script>
  export let count = 0;
  export let label = 'sin leer';
</script>

{#if count > 0}
  <span class="badge" aria-label={`${count} ${label}`}>{count}</span>
{/if}

<style>
  .badge {
    display: inline-block;
    min-width: 1.5rem;
    padding: 0.125rem 0.5rem;
    border-radius: 999px;
    background: #b00020;
    color: #fff;
    font-weight: 700;
    font-size: 0.875rem;
    text-align: center;
  }
</style>
