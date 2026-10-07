<script setup lang="ts">
import type { Movement } from '../../domain/movement'
import { formatDate } from '../../composables/useMoneyFormat'
import MoneyText from '../atoms/MoneyText.vue'
import StatusBadge from '../atoms/StatusBadge.vue'

defineProps<{ movement: Movement }>()
</script>

<template>
  <tr>
    <td>{{ formatDate(movement.date) }}</td>
    <td>{{ movement.description }}</td>
    <td class="num"><MoneyText :amount="movement.amount" :currency="movement.currency" /></td>
    <td><StatusBadge :status="movement.status" /></td>
  </tr>
</template>
