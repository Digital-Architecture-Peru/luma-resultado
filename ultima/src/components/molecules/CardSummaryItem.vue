<script setup lang="ts">
import type { CardSummary } from '../../domain/card'
import BaseBadge from '../atoms/BaseBadge.vue'
import MaskedPan from '../atoms/MaskedPan.vue'
import MoneyAmount from '../atoms/MoneyAmount.vue'

defineProps<{ card: CardSummary }>()
defineEmits<{ (e: 'select', id: string): void }>()

const statusLabel = { active: 'Activa', blocked: 'Bloqueada', expired: 'Vencida' } as const
const statusTone = { active: 'success', blocked: 'danger', expired: 'neutral' } as const
</script>

<template>
  <button type="button" class="card-item" @click="$emit('select', card.id)">
    <span class="card-item__main">
      <strong>{{ card.alias }}</strong>
      <MaskedPan :last4="card.last4" />
    </span>
    <span class="card-item__side">
      <BaseBadge :tone="statusTone[card.status]">{{ statusLabel[card.status] }}</BaseBadge>
      <span class="card-item__avail">
        Disponible <MoneyAmount :amount="card.availableBalance" :currency="card.currency" />
      </span>
    </span>
  </button>
</template>
