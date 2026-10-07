<script setup lang="ts">
import { onMounted } from 'vue';
import { useTransactions } from '../../composables/useTransactions';
import type { TransactionGateway } from '../../services/transactionGateway';
import MobileLayout from '../templates/MobileLayout.vue';
import TransactionForm from '../organisms/TransactionForm.vue';
import TransactionHistory from '../organisms/TransactionHistory.vue';

const props = defineProps<{ gateway: TransactionGateway }>();
const { cards, transactions, loading, submitting, feedback, load, submit } = useTransactions(props.gateway);

onMounted(load);
</script>

<template>
  <MobileLayout>
    <p role="status" class="feedback" :class="feedback ? `feedback-${feedback.kind}` : ''">
      {{ feedback ? feedback.text : '' }}
    </p>
    <TransactionForm :cards="cards" :submitting="submitting" @submit="submit" />
    <TransactionHistory :transactions="transactions" :loading="loading" />
  </MobileLayout>
</template>
