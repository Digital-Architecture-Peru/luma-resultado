<script lang="ts">
  export let tone: 'neutral' | 'info' | 'danger' | 'warning' = 'neutral';
</script>

<span class="badge {tone}"><slot /></span>

<style>
  .badge {
    display: inline-block;
    padding: 2px var(--space-2);
    border-radius: 999px;
    border: 1px solid currentColor;
    font-size: 0.75rem;
    font-weight: 600;
  }
  .neutral { color: var(--muted); }
  .info { color: var(--primary); }
  .danger { color: var(--danger); }
  .warning { color: var(--warning); }
</style>
