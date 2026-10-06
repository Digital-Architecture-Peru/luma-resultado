<script setup>
import { ref } from 'vue';
import { MAX_TITLE_LENGTH } from './taskModel.js';

const props = defineProps({
  /** Función async (title) => { ok, error } */
  onAdd: { type: Function, required: true },
});

const title = ref('');
const error = ref('');

async function submit() {
  const result = await props.onAdd(title.value);
  if (result.ok) {
    title.value = '';
    error.value = '';
  } else {
    error.value = result.error;
  }
}
</script>

<template>
  <form class="task-form" novalidate @submit.prevent="submit">
    <label for="new-task">Nueva tarea</label>
    <div class="row">
      <input
        id="new-task"
        v-model="title"
        type="text"
        :maxlength="MAX_TITLE_LENGTH + 20"
        autocomplete="off"
        :aria-invalid="error ? 'true' : 'false'"
        aria-describedby="new-task-error"
      />
      <button type="submit">Añadir</button>
    </div>
    <p id="new-task-error" class="error" role="alert">{{ error }}</p>
  </form>
</template>

<style scoped>
.task-form label {
  display: block;
  font-weight: 600;
  margin-bottom: 0.25rem;
}
.row {
  display: flex;
  gap: 0.5rem;
}
input {
  flex: 1;
  min-width: 0;
  padding: 0.5rem;
  border: 1px solid #6b7280;
  border-radius: 6px;
  font: inherit;
}
button {
  padding: 0.5rem 1rem;
  border: 0;
  border-radius: 6px;
  background: #1d4ed8;
  color: #fff;
  font: inherit;
  cursor: pointer;
}
button:focus-visible,
input:focus-visible {
  outline: 3px solid #f59e0b;
  outline-offset: 2px;
}
.error {
  min-height: 1.25rem;
  margin: 0.25rem 0 0;
  color: #b91c1c;
}
</style>
