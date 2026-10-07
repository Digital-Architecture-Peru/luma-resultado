<script>
  import { maskCard } from '../../domain/notification.js';
  export let last4 = '';
  $: masked = maskCard(last4);
</script>

<span class="chip" data-testid="card-chip">💳 {masked}</span>

<style>
  .chip {
    display: inline-block;
    padding: 0.125rem 0.5rem;
    border-radius: 6px;
    background: #e8eefb;
    color: #0b3d91;
    font-size: 0.8125rem;
    font-weight: 600;
  }
</style>
