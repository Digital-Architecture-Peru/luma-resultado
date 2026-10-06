<script setup lang="ts">
import { computed } from 'vue'
import type { Card } from '../../domain/card'
import { useFormatters } from '../../composables/useFormatters'
import BaseBadge from '../atoms/BaseBadge.vue'
import MaskedPan from '../atoms/MaskedPan.vue'
import BalanceRow from '../molecules/BalanceRow.vue'

const props = defineProps<{ card: Card | null }>()
const fmt = useFormatters()

const isCredit = computed(() => props.card?.type === 'CREDITO')
const dueText = computed(() => (props.card?.dueDate ? fmt.date(props.card.dueDate) : 'No aplica'))
const statusTone = { ACTIVA: 'success', BLOQUEADA: 'warning', CANCELADA: 'neutral' } as const
const statusLabel = { ACTIVA: 'Activa', BLOQUEADA: 'Bloqueada', CANCELADA: 'Cancelada' } as const
</script>

<template>
  <section class="panel" aria-labelledby="detail-title">
    <template v-if="card">
      <h2 id="detail-title">{{ card.brand }} <MaskedPan :last4="card.last4" /></h2>
      <p class="holder">{{ card.holderName }}</p>
      <BaseBadge :label="statusLabel[card.status]" :tone="statusTone[card.status]" />
      <dl>
        <BalanceRow v-if="isCredit" label="Línea de crédito" :value="card.creditLimit" />
        <BalanceRow label="Saldo disponible" :value="card.availableBalance" />
        <template v-if="isCredit">
          <BalanceRow label="Saldo del estado de cuenta" :value="card.statementBalance" />
          <div class="due"><dt>Fecha de pago</dt><dd>{{ dueText }}</dd></div>
        </template>
      </dl>
    </template>
    <template v-else>
      <h2 id="detail-title">Detalle</h2>
      <p>Selecciona una tarjeta para ver su detalle.</p>
    </template>
  </section>
</template>

<style scoped>
.panel { background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius); padding: var(--space-4); }
h2 { margin-top: 0; }
.holder { color: var(--color-muted); }
dl { margin: var(--space-3) 0 0; }
.due { display: flex; justify-content: space-between; padding: var(--space-2) 0; }
.due dt { color: var(--color-muted); }
.due dd { margin: 0; }
</style>
