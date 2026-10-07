<script setup lang="ts">
import type { Card } from '../../domain/card';
import BalanceRow from '../molecules/BalanceRow.vue';
import MaskedCardNumber from '../atoms/MaskedCardNumber.vue';
import StatusBadge from '../atoms/StatusBadge.vue';

defineProps<{ card: Card | null }>();
</script>

<template>
  <section class="panel" aria-labelledby="detail-title">
    <h2 id="detail-title">Detalle de la tarjeta</h2>
    <p v-if="!card" class="hint">Selecciona una tarjeta para ver su detalle.</p>
    <template v-else>
      <p class="head">
        <strong>{{ card.alias }}</strong> · <MaskedCardNumber :last4="card.last4" />
        <StatusBadge :status="card.status" />
      </p>
      <dl>
        <BalanceRow label="Límite" :amount="card.creditLimit" :currency="card.currency" />
        <BalanceRow label="Disponible" :amount="card.availableBalance" :currency="card.currency" />
        <div class="meta"><dt>Titular</dt><dd>{{ card.holder }}</dd></div>
        <div class="meta"><dt>Vence</dt><dd>{{ card.expiresAt }}</dd></div>
      </dl>
    </template>
  </section>
</template>

<style scoped>
.panel { padding: 1rem; border: 1px solid #d1d5db; border-radius: 8px; background: #fff; }
.hint { color: #374151; }
.head { display: flex; gap: 0.5rem; align-items: center; flex-wrap: wrap; }
dl { margin: 0; }
.meta { display: flex; justify-content: space-between; padding: 0.5rem 0; }
.meta dd { margin: 0; }
</style>
