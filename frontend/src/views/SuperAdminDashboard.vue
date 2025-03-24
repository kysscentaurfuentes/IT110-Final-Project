<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const users = ref([])
const router = useRouter()

onMounted(async () => {
  try {
    const response = await axios.get('http://localhost:3000/users')
    users.value = response.data
  } catch (error) {
    console.error('❌ Error fetching users:', error)
  }
})

const logout = () => {
  localStorage.clear()
  router.push('/admin/login')
}
</script>

<template>
  <div>
    <h1>Super Admin Dashboard</h1>
    <v-container>
      <v-card class="mx-auto my-5" max-width="800">
        <v-card-title class="text-h5">User List</v-card-title>
        <v-card-text>
          <v-table>
            <thead>
              <tr>
                <th>Username</th>
                <th>Email</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in users" :key="user.id">
                <td>{{ user.username }}</td>
                <td>{{ user.email }}</td>
                <td>{{ user.role }}</td>
                <td>
                  <v-btn color="blue" size="small" class="mr-2">Edit</v-btn>
                  <v-btn color="red" size="small">Delete</v-btn>
                </td>
              </tr>
            </tbody>
          </v-table>
        </v-card-text>
      </v-card>
      <v-btn color="green" class="mr-2">Add User</v-btn>
      <v-btn color="red" @click="logout">Logout</v-btn>
    </v-container>
  </div>
</template>

<style scoped>
h1 {
  text-align: center;
  margin-top: 20px;
  color: #333;
}
</style>
