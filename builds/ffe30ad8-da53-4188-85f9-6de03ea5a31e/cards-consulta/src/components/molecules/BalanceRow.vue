<script setup lang="ts">
import MoneyAmount from '../atoms/MoneyAmount.vue';

defineProps<{ label: string; amount: number; currency: string }>();
</script>

<template>
  <div class="row">
    <dt>{{ label }}</dt>
    <dd><MoneyAmount :amount="amount" :currency="currency" /></dd>
  </div>
</template>

<style scoped>
.row {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid #e5e7eb;
}
dt { color: #374151; }
dd { margin: 0; }
</style>
