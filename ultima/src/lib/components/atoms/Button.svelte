<script>
  export let disabled = false;
  export let variant = 'primary';
</script>

<button type="button" class={variant} {disabled} on:click>
  <slot />
</button>

<style>
  button {
    min-height: 44px;
    min-width: 44px;
    padding: 0 1rem;
    border-radius: 8px;
    border: 2px solid #0b3d91;
    font: inherit;
    font-weight: 600;
    cursor: pointer;
  }
  .primary {
    background: #0b3d91;
    color: #fff;
  }
  .secondary {
    background: #fff;
    color: #0b3d91;
  }
  button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  button:focus-visible {
    outline: 3px solid #ffbf47;
    outline-offset: 2px;
  }
</style>
