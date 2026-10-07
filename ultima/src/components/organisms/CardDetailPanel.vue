<script setup lang="ts">
import type { Card } from '../../domain/card'
import { formatDate } from '../../domain/money'
import { LOCALE } from '../../config'
import BaseBadge from '../atoms/BaseBadge.vue'
import MaskedPan from '../atoms/MaskedPan.vue'
import BalanceRow from '../molecules/BalanceRow.vue'

defineProps<{ card: Card }>()
</script>

<template>
  <section class="detail" :aria-label="`Detalle de ${card.alias}`">
    <header class="detail__head">
      <h2>{{ card.alias }}</h2>
      <MaskedPan :last4="card.last4" />
      <BaseBadge :tone="card.status === 'active' ? 'success' : 'danger'">
        {{ card.status === 'active' ? 'Activa' : card.status === 'blocked' ? 'Bloqueada' : 'Vencida' }}
      </BaseBadge>
    </header>
    <dl class="detail__rows">
      <BalanceRow v-if="card.type === 'credit'" label="Límite de crédito" :amount="card.creditLimit" :currency="card.currency" />
      <BalanceRow label="Disponible" :amount="card.availableBalance" :currency="card.currency" />
      <BalanceRow v-if="card.type === 'credit'" label="Saldo actual" :amount="card.currentBalance" :currency="card.currency" />
      <BalanceRow v-if="card.type === 'credit'" label="Pago mínimo" :amount="card.minimumPayment" :currency="card.currency" />
    </dl>
    <p v-if="card.type === 'credit'" class="detail__dates">
      Fecha de corte: {{ formatDate(card.cutoffDate, LOCALE) }} · Fecha de pago: {{ formatDate(card.dueDate, LOCALE) }}
    </p>
  </section>
</template>
