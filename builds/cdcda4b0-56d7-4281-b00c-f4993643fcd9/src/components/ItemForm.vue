<script setup lang="ts">
import { computed, ref } from 'vue'
import { validateItem, NAME_MAX, DESCRIPTION_MAX } from '../domain/item'
import type { NewItem } from '../domain/item'

const emit = defineEmits<{ (e: 'submit', value: NewItem): void }>()

const name = ref('')
const description = ref('')
const submitted = ref(false)

const errors = computed(() => validateItem({ name: name.value, description: description.value }))

function onSubmit() {
  submitted.value = true
  if (Object.keys(errors.value).length > 0) return
  emit('submit', { name: name.value, description: description.value })
  name.value = ''
  description.value = ''
  submitted.value = false
}
</script>

<template>
  <form novalidate @submit.prevent="onSubmit">
    <div class="field">
      <label for="item-name">Nombre</label>
      <input id="item-name" v-model="name" type="text" :maxlength="NAME_MAX + 10" :aria-invalid="submitted && !!errors.name" />
      <p v-if="submitted && errors.name" class="error" role="alert">{{ errors.name }}</p>
    </div>
    <div class="field">
      <label for="item-desc">Descripción</label>
      <textarea id="item-desc" v-model="description" rows="3" :maxlength="DESCRIPTION_MAX + 10" />
      <p v-if="submitted && errors.description" class="error" role="alert">{{ errors.description }}</p>
    </div>
    <button type="submit">Agregar</button>
  </form>
</template>
