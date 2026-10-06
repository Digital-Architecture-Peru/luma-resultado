<script setup lang="ts">
import type { Task } from '../domain/task'

defineProps<{ tasks: Task[] }>()
defineEmits<{
  (e: 'toggle', id: string): void
  (e: 'remove', id: string): void
}>()
</script>

<template>
  <p v-if="tasks.length === 0" class="empty">No hay tareas. Agrega la primera.</p>
  <ul v-else class="task-list">
    <li v-for="task in tasks" :key="task.id" :class="{ done: task.done }">
      <label>
        <input
          type="checkbox"
          :checked="task.done"
          @change="$emit('toggle', task.id)"
        />
        <span>{{ task.title }}</span>
      </label>
      <button
        type="button"
        class="danger"
        :aria-label="`Eliminar tarea ${task.title}`"
        @click="$emit('remove', task.id)"
      >
        Eliminar
      </button>
    </li>
  </ul>
</template>
