<script setup lang="ts">
import type { Card } from '../../domain/card'
import MaskedPan from '../atoms/MaskedPan.vue'
import BaseBadge from '../atoms/BaseBadge.vue'
import AmountText from '../atoms/AmountText.vue'

defineProps<{ card: Card }>()
</script>

<template>
  <section aria-labelledby="detail-title">
    <h2 id="detail-title">{{ card.alias }}</h2>
    <dl class="grid">
      <dt>Número</dt>
      <dd><MaskedPan :last4="card.last4" /></dd>
      <dt>Titular</dt>
      <dd>{{ card.holderName }}</dd>
      <dt>Estado</dt>
      <dd><BaseBadge :status="card.status" /></dd>
      <dt>Vencimiento</dt>
      <dd>{{ card.expiry }}</dd>
      <dt>Línea de crédito</dt>
      <dd><AmountText :amount="card.creditLimit" :currency="card.currency" /></dd>
      <dt>Disponible</dt>
      <dd><AmountText :amount="card.availableBalance" :currency="card.currency" /></dd>
    </dl>
  </section>
</template>

<style scoped>
.grid { display: grid; grid-template-columns: max-content 1fr; gap: 0.4rem 1rem; }
dt { font-weight: 600; }
dd { margin: 0; }
</style>
