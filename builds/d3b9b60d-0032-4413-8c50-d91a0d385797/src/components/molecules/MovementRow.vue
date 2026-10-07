<script setup lang="ts">
import type { CardMovement } from '../../domain/card'
import AmountText from '../atoms/AmountText.vue'

defineProps<{ movement: CardMovement }>()
</script>

<template>
  <tr>
    <td>{{ movement.date }}</td>
    <td>{{ movement.description }}</td>
    <td class="num"><AmountText :amount="movement.amount" :currency="movement.currency" /></td>
  </tr>
</template>

<style scoped>
td { padding: 0.5rem; border-bottom: 1px solid #e3e6eb; }
.num { text-align: right; }
</style>
