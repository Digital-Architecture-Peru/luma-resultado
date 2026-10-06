<script setup lang="ts">
import { ref } from 'vue'
import { MAX_TITLE_LENGTH, validateTitle } from '../domain/task'

const emit = defineEmits<{ (e: 'submit', title: string): void }>()

const title = ref('')
const validationError = ref<string | null>(null)

function onSubmit() {
  const result = validateTitle(title.value)
  if (!result.ok) {
    validationError.value = result.error
    return
  }
  validationError.value = null
  emit('submit', result.value)
  title.value = ''
}
</script>

<template>
  <form class="task-form" novalidate @submit.prevent="onSubmit">
    <label for="new-task">Nueva tarea</label>
    <div class="row">
      <input
        id="new-task"
        v-model="title"
        type="text"
        :maxlength="MAX_TITLE_LENGTH + 20"
        autocomplete="off"
        :aria-invalid="validationError ? 'true' : 'false'"
        aria-describedby="new-task-error"
      />
      <button type="submit">Agregar</button>
    </div>
    <p id="new-task-error" class="error" role="alert">{{ validationError }}</p>
  </form>
</template>
