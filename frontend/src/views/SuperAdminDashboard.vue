<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useToast } from 'vue-toastification' // ✅ For notifications

const users = ref([])
const toast = useToast() // ✅ Initialize notifications

const fetchUsers = async () => {
  try {
    const token = localStorage.getItem('token')
    const response = await axios.get('http://localhost:3000/users', {
      headers: { Authorization: `Bearer ${token}` },
    })
    users.value = response.data
  } catch (error) {
    console.error('❌ Error fetching users:', error)
  }
}

const updateRole = async (userId, newRole) => {
  try {
    const token = localStorage.getItem('token')
    await axios.put(
      `http://localhost:3000/users/${userId}`,
      { role: newRole },
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    )
    toast.success('User role updated!') // ✅ Show success message
    fetchUsers() // Refresh users list
  } catch (error) {
    console.error('❌ Error updating role:', error)
    toast.error('Failed to update role') // ✅ Show error message
  }
}

const deleteUser = async (userId) => {
  if (!confirm('Are you sure you want to delete this user?')) return

  try {
    const token = localStorage.getItem('token')
    await axios.delete(`http://localhost:3000/users/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    toast.success('User deleted successfully!') // ✅ Show success message
    fetchUsers() // Refresh users list
  } catch (error) {
    console.error('❌ Error deleting user:', error)
    toast.error('Failed to delete user') // ✅ Show error message
  }
}

onMounted(fetchUsers)
</script>

<template>
  <v-container>
    <v-card class="mx-auto my-5" max-width="800">
      <v-card-title class="text-h5">User Management</v-card-title>
      <v-card-text>
        <v-table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in users" :key="user.id">
              <td>{{ user.id }}</td>
              <td>{{ user.username }}</td>
              <td>{{ user.email }}</td>
              <td>
                <v-select
                  v-model="user.role"
                  :items="['superadmin', 'employee', 'customer']"
                  @change="updateRole(user.id, user.role)"
                ></v-select>
              </td>
              <td>
                <v-btn color="red" @click="deleteUser(user.id)">Delete</v-btn>
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<style scoped>
h1 {
  text-align: center;
  margin-top: 20px;
  color: #333;
}
</style>
