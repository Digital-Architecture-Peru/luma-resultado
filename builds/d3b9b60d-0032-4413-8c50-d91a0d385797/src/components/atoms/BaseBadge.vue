<script setup lang="ts">
import { computed } from 'vue'
import { STATUS_LABEL, type CardStatus } from '../../domain/card'

const props = defineProps<{ status: CardStatus }>()
const label = computed(() => STATUS_LABEL[props.status])
const icon = computed(() => (props.status === 'ACTIVE' ? '✔' : '✖'))
</script>

<template>
  <span class="badge" :class="`badge--${status.toLowerCase()}`">
    <span aria-hidden="true">{{ icon }}</span> {{ label }}
  </span>
</template>

<style scoped>
.badge {
  display: inline-block;
  padding: 0.1rem 0.5rem;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 600;
  border: 1px solid currentColor;
}
.badge--active { color: #0b6b2e; }
.badge--blocked { color: #a11d1d; }
.badge--expired { color: #6b5200; }
</style>
