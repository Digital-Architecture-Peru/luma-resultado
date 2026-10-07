<script setup lang="ts">
import type { Movement } from '../../domain/card'
import { formatDate } from '../../domain/money'
import { LOCALE } from '../../config'
import MoneyAmount from '../atoms/MoneyAmount.vue'

defineProps<{ movement: Movement }>()
</script>

<template>
  <div class="movement">
    <span class="movement__date">{{ formatDate(movement.date, LOCALE) }}</span>
    <span class="movement__desc">{{ movement.description }}</span>
    <MoneyAmount :amount="movement.amount" :currency="movement.currency" signed />
  </div>
</template>
