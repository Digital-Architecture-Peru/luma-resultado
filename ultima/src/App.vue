<script setup lang="ts">
import { onMounted } from 'vue'
import TaskCounter from './features/tasks/components/TaskCounter.vue'
import TaskForm from './features/tasks/components/TaskForm.vue'
import TaskList from './features/tasks/components/TaskList.vue'
import { createInMemoryTaskGateway } from './features/tasks/adapters/inMemoryTaskGateway'
import { useTasks } from './features/tasks/useTasks'
import { tasksFixture } from './mocks/tasks.fixture'

const { tasks, loading, error, counts, load, add, toggle, remove } = useTasks(
  createInMemoryTaskGateway(tasksFixture),
)

onMounted(load)
</script>

<template>
  <main class="app">
    <h1>Lista de tareas</h1>
    <TaskCounter :counts="counts" />
    <TaskForm @submit="add" />
    <p v-if="error" class="error" role="alert">{{ error }}</p>
    <p v-if="loading">Cargando…</p>
    <TaskList v-else :tasks="tasks" @toggle="toggle" @remove="remove" />
  </main>
</template>
