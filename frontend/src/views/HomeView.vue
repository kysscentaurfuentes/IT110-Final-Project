<script setup>
import { ref, onMounted } from 'vue'
import { getUsers } from '@/services/userService'

const users = ref([])

onMounted(async () => {
  users.value = await getUsers()
})
</script>

<template>
  <div>
    <h1>User List</h1>
    <ul>
      <li v-for="user in users" :key="user.id">{{ user.name }} - {{ user.email }}</li>
    </ul>
  </div>
</template>
