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

<style scoped>
.v-card {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

h2 {
  text-align: center;
  margin-bottom: 10px;
}

ul {
  list-style: none;
  padding: 0;
}

li {
  padding: 8px;
  background: #f4f4f4;
  margin-bottom: 5px;
  border-radius: 5px;
  text-align: center;
}
</style>
