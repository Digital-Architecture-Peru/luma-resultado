<script setup lang="ts">
withDefaults(
  defineProps<{
    id: string;
    invalid?: boolean;
    describedby?: string;
    inputmode?: 'text' | 'decimal';
    maxlength?: number;
    placeholder?: string;
  }>(),
  { invalid: false, describedby: undefined, inputmode: 'text', maxlength: undefined, placeholder: '' }
);

const model = defineModel<string>({ required: true });
</script>

<template>
  <input
    :id="id"
    v-model="model"
    class="control"
    type="text"
    autocomplete="off"
    :inputmode="inputmode"
    :maxlength="maxlength"
    :placeholder="placeholder"
    :aria-invalid="invalid"
    :aria-describedby="describedby"
  />
</template>
