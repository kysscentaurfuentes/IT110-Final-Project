<script setup>
import { ref } from 'vue'

const message = ref('Welcome to the Employee Dashboard!')
</script>

<template>
  <div class="dashboard-container">
    <h2>{{ message }}</h2>
  </div>
</template>

<style scoped>
.dashboard-container {
  text-align: center;
  margin-top: 50px;
}
</style>
