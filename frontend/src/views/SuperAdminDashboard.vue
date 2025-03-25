<script setup>
import { ref, onMounted } from 'vue'
import { getUsers, updateUserRole, deleteUser } from '@/services/userService'
import { useToast } from 'vue-toastification' // ✅ For notifications

const users = ref([])
const toast = useToast()

const fetchUsers = async () => {
  try {
    users.value = await getUsers()
    console.log('✅ Fetched users:', users.value)
  } catch (error) {
    console.error('❌ Error fetching users:', error)
  }
}

const updateRole = async (user, newRole) => {
  if (user.role === newRole) return // ✅ Skip if no changes
  try {
    await updateUserRole(user.id, newRole)
    user.role = newRole // ✅ Update local state
    toast.success('User role updated!')
  } catch (error) {
    console.error('❌ Error updating role:', error)
    toast.error('Failed to update role')
  }
}

const deleteUserAccount = async (userId) => {
  if (!confirm('Are you sure you want to delete this user?')) return
  try {
    await deleteUser(userId)
    users.value = users.value.filter((user) => user.id !== userId) // ✅ Remove from list
    toast.success('User deleted successfully!')
  } catch (error) {
    console.error('❌ Error deleting user:', error)
    toast.error('Failed to delete user')
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
                  v-model="user.selectedRole"
                  :items="['superadmin', 'employee', 'customer']"
                  @change="updateRole(user, user.selectedRole)"
                ></v-select>
              </td>
              <td>
                <v-btn color="red" @click="deleteUserAccount(user.id)">Delete</v-btn>
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
