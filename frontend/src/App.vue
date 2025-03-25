<script setup>
import { ref } from 'vue'
import { RouterView } from 'vue-router'
import { useTheme } from 'vuetify'

const drawer = ref(true) // ✅ Sidebar is Open by Default
const theme = useTheme()
const isDarkMode = ref(false)

// ✅ Toggle Dark Mode
const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value
  theme.global.name.value = isDarkMode.value ? 'dark' : 'light'
  console.log('Dark Mode:', isDarkMode.value) // ✅ Debugging Output
}
</script>

<template>
  <v-app>
    <!-- ✅ Sidebar Navigation (Fixed) -->
    <v-navigation-drawer v-model="drawer" app>
      <v-list>
        <v-list-item title="Navigation" subtitle="Quick Links"></v-list-item>
        <v-divider></v-divider>
        <v-list-item link to="/home"> <v-icon left>mdi-home</v-icon> Home </v-list-item>
        <v-list-item link to="/about"> <v-icon left>mdi-information</v-icon> About </v-list-item>
        <v-list-item link to="/admin/login">
          <v-icon left>mdi-account-lock</v-icon> Admin Login
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- ✅ Responsive Navbar -->
    <v-app-bar color="primary" dark>
      <v-container>
        <v-row align="center">
          <v-col cols="6">
            <v-toolbar-title class="font-weight-bold">IT 110 Final Project</v-toolbar-title>
          </v-col>
          <v-col cols="6" class="text-right">
            <v-btn icon @click="drawer = !drawer">
              <v-icon>mdi-menu</v-icon>
            </v-btn>
            <v-btn :to="'/home'" text class="mx-1">Home</v-btn>
            <v-btn :to="'/about'" text class="mx-1">About</v-btn>
            <v-btn :to="'/admin/login'" color="secondary" dark class="mx-1">Admin Login</v-btn>

            <!-- 🌙 Dark Mode Toggle (Fixed) -->
            <v-btn icon @click="toggleDarkMode" color="white">
              <v-icon>{{ isDarkMode ? 'mdi-weather-sunny' : 'mdi-weather-night' }}</v-icon>
              <span>Dark Mode</span>
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-app-bar>

    <!-- ✅ Main Content -->
    <v-main>
      <v-container>
        <RouterView />
      </v-container>
    </v-main>

    <!-- ✅ Footer -->
    <v-footer app color="primary" dark class="d-flex justify-center">
      <span>© 2025 IT 110 Final Project. All rights reserved.</span>
    </v-footer>
  </v-app>
</template>

<style scoped>
/* ✅ Dark Mode Background */
.v-application {
  font-family: 'Roboto', sans-serif;
  transition: background-color 0.3s ease-in-out;
}

/* ✅ Navbar styles */
.v-app-bar {
  padding: 10px 0;
}

/* ✅ Button Styling with Hover Effects */
.v-btn {
  font-size: 1rem;
  text-transform: none;
  transition: background 0.3s ease-in-out;
}

.v-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

/* ✅ Sidebar Styles (Fixed) */
.v-navigation-drawer {
  background-color: #222;
  color: white;
}

.v-list-item {
  transition: background 0.3s ease-in-out;
}

.v-list-item:hover {
  background: rgba(255, 255, 255, 0.1);
}

/* ✅ Footer Styling */
.v-footer {
  padding: 10px 0;
  font-size: 14px;
  text-align: center;
}
</style>
