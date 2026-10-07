<script setup lang="ts">
import { computed } from 'vue';
import { TYPE_LABELS, formatMoney, maskCardNumber } from '../../domain/card';
import type { Card } from '../../domain/card';
import StatusBadge from '../atoms/StatusBadge.vue';

const props = defineProps<{ card: Card }>();

const masked = computed(() => maskCardNumber(props.card.last4));
const available = computed(() => formatMoney(props.card.availableBalance, props.card.currency));
const limit = computed(() =>
  props.card.creditLimit === null ? null : formatMoney(props.card.creditLimit, props.card.currency),
);
</script>

<template>
  <article class="card" :aria-label="`Tarjeta ${card.alias}`">
    <header class="card__header">
      <h3 class="card__title">{{ card.alias }}</h3>
      <StatusBadge :status="card.status" />
    </header>
    <p class="card__number">{{ masked }}</p>
    <dl class="card__details">
      <div>
        <dt>Tipo</dt>
        <dd>{{ TYPE_LABELS[card.type] }} · {{ card.brand }}</dd>
      </div>
      <div>
        <dt>Vence</dt>
        <dd>{{ card.expiry }}</dd>
      </div>
      <div>
        <dt>Disponible</dt>
        <dd class="num">{{ available }}</dd>
      </div>
      <div v-if="limit !== null">
        <dt>Línea de crédito</dt>
        <dd class="num">{{ limit }}</dd>
      </div>
    </dl>
  </article>
</template>
