<script>
  export let value;
  $: date = new Date(value);
  $: valid = !Number.isNaN(date.getTime());
  $: text = valid
    ? date.toLocaleString('es-CO', { dateStyle: 'medium', timeStyle: 'short' })
    : 'Fecha no disponible';
</script>

{#if valid}
  <time datetime={date.toISOString()}>{text}</time>
{:else}
  <span>{text}</span>
{/if}

<style>
  time,
  span {
    color: #4a4a4a;
    font-size: 0.8125rem;
  }
</style>
