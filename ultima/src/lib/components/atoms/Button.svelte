<script lang="ts">
  export let variant: 'primary' | 'ghost' = 'primary';
  export let disabled = false;
  export let onClick: () => void = () => {};
</script>

<button type="button" class={variant} {disabled} on:click={onClick}><slot /></button>

<style>
  button {
    min-height: 40px;
    padding: 0 var(--space-4);
    border-radius: var(--radius-md);
    border: 1px solid var(--primary);
    font: inherit;
    cursor: pointer;
    transition: background-color var(--dur-fast);
  }
  button:focus-visible {
    outline: 3px solid var(--primary);
    outline-offset: 2px;
  }
  .primary {
    background: var(--primary);
    color: var(--primary-contrast);
  }
  .ghost {
    background: transparent;
    color: var(--primary);
  }
  button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
</style>
