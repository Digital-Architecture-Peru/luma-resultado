<script setup lang="ts">
import { computed } from 'vue';
import { STATUS_LABELS } from '../../domain/card';
import type { CardStatus } from '../../domain/card';

const props = defineProps<{ status: CardStatus }>();
const label = computed(() => STATUS_LABELS[props.status]);
</script>

<template>
  <span class="badge" :class="`badge--${status}`">{{ label }}</span>
</template>
