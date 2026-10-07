<script setup lang="ts">
import { computed } from 'vue'
import type { Card } from '../../domain/card'
import { formatDate, utilization } from '../../domain/cardFormat'
import { config } from '../../config'
import BalanceRow from '../molecules/BalanceRow.vue'
import MaskedCardNumber from '../atoms/MaskedCardNumber.vue'
import ProgressBar from '../atoms/ProgressBar.vue'

const props = defineProps<{ card: Card }>()
const isCredit = computed(() => props.card.type === 'credit')
const usage = computed(() => utilization(props.card))
const cutOff = computed(() => formatDate(props.card.cutOffDate, config.locale))
const dueDate = computed(() => formatDate(props.card.paymentDueDate, config.locale))
</script>

<template>
  <section class="panel" aria-labelledby="detail-title">
    <h2 id="detail-title">{{ card.alias }}</h2>
    <p><MaskedCardNumber :last4="card.last4" /> · {{ card.holder }}</p>
    <dl>
      <BalanceRow v-if="isCredit && card.creditLimit !== undefined" label="Línea de crédito" :amount="card.creditLimit" :currency="card.currency" />
      <BalanceRow label="Disponible" :amount="card.available" :currency="card.currency" />
      <BalanceRow label="Saldo" :amount="card.balance" :currency="card.currency" />
      <BalanceRow v-if="isCredit" label="Fecha de corte" :text="cutOff" />
      <BalanceRow v-if="isCredit" label="Fecha de pago" :text="dueDate" />
      <BalanceRow label="Vencimiento" :text="card.expiry" />
    </dl>
    <ProgressBar v-if="usage !== null" :value="usage" label="Línea utilizada" />
    <p v-if="usage !== null" class="usage">{{ usage }}% de la línea utilizada</p>
  </section>
</template>

<style scoped>
.panel { padding: 16px; border: 1px solid #c8ccd2; border-radius: 8px; background: #fff; }
dl { margin: 0 0 12px; }
.usage { color: var(--color-muted, #444b55); font-size: 0.875rem; }
</style>
