<script setup lang="ts">
import type { Card } from '../../domain/card'
import MaskedPan from '../atoms/MaskedPan.vue'
import MoneyText from '../atoms/MoneyText.vue'
import StatusBadge from '../atoms/StatusBadge.vue'

defineProps<{ card: Card }>()
</script>

<template>
  <section class="panel" aria-label="Detalle de tarjeta">
    <h2>{{ card.alias }}</h2>
    <dl>
      <dt>Numero</dt>
      <dd><MaskedPan :last4="card.last4" /></dd>
      <dt>Marca / tipo</dt>
      <dd>{{ card.brand }} · {{ card.kind }}</dd>
      <dt>Estado</dt>
      <dd><StatusBadge :status="card.status" /></dd>
      <dt>Vencimiento</dt>
      <dd>{{ card.expiry }}</dd>
      <dt>Saldo disponible</dt>
      <dd><MoneyText :amount="card.availableBalance" :currency="card.currency" /></dd>
      <template v-if="card.creditLimit !== undefined">
        <dt>Limite de credito</dt>
        <dd><MoneyText :amount="card.creditLimit" :currency="card.currency" /></dd>
      </template>
    </dl>
  </section>
</template>
