<script setup lang="ts">
import { formatMoney, type PaymentReceipt } from '../../domain/payment';

defineProps<{ receipt: PaymentReceipt }>();
</script>

<template>
  <section class="card receipt" aria-label="Comprobante de pago">
    <h2>Pago realizado</h2>
    <dl>
      <dt>Referencia</dt>
      <dd data-test="reference">{{ receipt.reference }}</dd>
      <dt>Importe</dt>
      <dd>{{ formatMoney(receipt.request.amount) }}</dd>
      <dt>Concepto</dt>
      <dd>{{ receipt.request.concept }}</dd>
      <dt>Nuevo saldo</dt>
      <dd>{{ formatMoney(receipt.newBalance) }}</dd>
    </dl>
  </section>
</template>
