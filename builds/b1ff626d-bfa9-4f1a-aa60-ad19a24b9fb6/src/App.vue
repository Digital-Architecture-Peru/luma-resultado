<script setup>
import TaskListView from './features/tasks/TaskListView.vue';
</script>

<template>
  <main class="app">
    <h1>Lista de tareas</h1>
    <TaskListView />
  </main>
</template>

<style>
body {
  margin: 0;
  font-family: system-ui, sans-serif;
  color: #111827;
  background: #f9fafb;
}
.app {
  max-width: 40rem;
  margin: 0 auto;
  padding: 1rem;
}
</style>
