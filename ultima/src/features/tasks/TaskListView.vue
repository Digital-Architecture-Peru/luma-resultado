<script setup>
import { onMounted } from 'vue';
import { createRepository } from '../../adapters/createRepository.js';
import EmptyState from '../../shared/ui/EmptyState.vue';
import TaskForm from './TaskForm.vue';
import { useTasks } from './useTasks.js';

const props = defineProps({
  /** Repositorio inyectable (para pruebas); por defecto según entorno. */
  repository: { type: Object, default: null },
});

const { tasks, loading, error, counterText, load, add, toggle, remove } = useTasks(
  props.repository ?? createRepository(),
);

onMounted(load);
</script>

<template>
  <section class="task-view">
    <p class="counter" role="status" aria-live="polite" data-testid="counter">
      {{ counterText }}
    </p>

    <TaskForm :on-add="add" />

    <p v-if="error" class="error" role="alert" data-testid="load-error">{{ error }}</p>
    <p v-if="loading" data-testid="loading">Cargando…</p>

    <EmptyState v-else-if="tasks.length === 0" message="No hay tareas. ¡Añade la primera!" />

    <ul v-else class="list" aria-label="Lista de tareas">
      <li v-for="task in tasks" :key="task.id" class="item">
        <label>
          <input type="checkbox" :checked="task.done" @change="toggle(task.id)" />
          <span :class="{ done: task.done }">{{ task.title }}</span>
        </label>
        <button type="button" :aria-label="`Eliminar ${task.title}`" @click="remove(task.id)">
          Eliminar
        </button>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.counter {
  font-weight: 600;
  padding: 0.5rem 0.75rem;
  background: #e0e7ff;
  color: #1e1b4b;
  border-radius: 6px;
}
.list {
  list-style: none;
  padding: 0;
  margin: 1rem 0 0;
}
.item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0;
  border-bottom: 1px solid #d1d5db;
}
.done {
  text-decoration: line-through;
  color: #4b5563;
}
.error {
  color: #b91c1c;
}
button {
  padding: 0.25rem 0.75rem;
  border: 1px solid #6b7280;
  border-radius: 6px;
  background: #fff;
  font: inherit;
  cursor: pointer;
}
button:focus-visible,
input:focus-visible {
  outline: 3px solid #f59e0b;
  outline-offset: 2px;
}
</style>
