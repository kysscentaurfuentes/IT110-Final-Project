<script setup>
import { ref, onMounted } from 'vue'
import { getUsers } from '@/services/userService'

const users = ref([])

onMounted(async () => {
  users.value = await getUsers()
  console.log('Fetched users:', users.value) // ✅ Debugging
})
</script>

<template>
  <div>
    <h2>User List</h2>
    <ul>
      <li v-for="user in users" :key="user.id">{{ user.name }} - {{ user.email }}</li>
    </ul>
  </div>
</template>
