<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios' // ✅ Import axios for API calls

const router = useRouter()
const username = ref('')
const password = ref('')
const errorMessage = ref('')

// 🔒 Login Function (Now Uses API)
const login = async () => {
  try {
    const response = await axios.post(
      'http://localhost:3000/auth/login',
      {
        username: username.value,
        password: password.value,
      },
      { withCredentials: true },
    ) // ✅ Allow cookies for refresh token

    const token = response.data.accessToken // ✅ Get Correct Token
    sessionStorage.setItem('accessToken', token) // ✅ Store JWT Token
    sessionStorage.setItem('userRole', 'superadmin') // ✅ Save Role
    router.push('/admin/dashboard') // ✅ Redirect after login
  } catch (error) {
    console.error('🔴 Login failed:', error.response?.data || error.message)
    errorMessage.value = '❌ Invalid username or password'
  }
}
</script>

<template>
  <v-container>
    <v-card class="mx-auto my-5" max-width="400">
      <v-card-title class="text-center">Super Admin Login</v-card-title>
      <v-card-text>
        <v-text-field v-model="username" label="Username" outlined></v-text-field>
        <v-text-field v-model="password" label="Password" type="password" outlined></v-text-field>
        <v-btn color="blue" block @click="login">Login</v-btn>
        <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<style scoped>
.admin-container {
  max-width: 300px;
  margin: auto;
  padding: 20px;
  text-align: center;
  background: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
input {
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ccc;
  border-radius: 5px;
}
button {
  width: 100%;
  padding: 10px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
.error {
  color: red;
  margin-top: 10px;
}
</style>
