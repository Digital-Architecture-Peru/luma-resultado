<script setup lang="ts">
import MoneyAmount from '../atoms/MoneyAmount.vue'

defineProps<{ label: string; amount: number; currency: string }>()
</script>

<template>
  <div class="balance-row">
    <dt>{{ label }}</dt>
    <dd><MoneyAmount :amount="amount" :currency="currency" /></dd>
  </div>
</template>
