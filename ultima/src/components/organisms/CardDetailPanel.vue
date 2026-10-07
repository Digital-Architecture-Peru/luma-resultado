<script setup lang="ts">
import type { CardDetail } from '../../domain/card'
import { formatDate } from '../../utils/format'
import MaskedPan from '../atoms/MaskedPan.vue'
import StatusBadge from '../atoms/StatusBadge.vue'
import BalanceRow from '../molecules/BalanceRow.vue'

defineProps<{ card: CardDetail }>()
</script>

<template>
  <section class="detail" aria-labelledby="detail-title">
    <h2 id="detail-title">{{ card.brand }} <MaskedPan :last4="card.last4" /></h2>
    <p><StatusBadge :status="card.status" /> · {{ card.holderAlias }}</p>
    <dl>
      <BalanceRow v-if="card.type === 'CREDIT'" label="Línea de crédito" :amount="card.creditLimit" />
      <BalanceRow label="Disponible" :amount="card.availableBalance" />
      <BalanceRow label="Saldo actual" :amount="card.currentBalance" />
    </dl>
    <p>Fecha de corte: <strong>{{ formatDate(card.cutoffDate) }}</strong></p>
    <p>Fecha de pago: <strong>{{ formatDate(card.paymentDueDate) }}</strong></p>
  </section>
</template>

<style scoped>
.detail { padding: 1rem; border: 1px solid #d1d5db; border-radius: 8px; background: #fff; }
dl { margin: 0 0 1rem; }
</style>
