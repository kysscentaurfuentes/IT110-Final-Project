<script setup>
import { ref } from 'vue'
import { RouterView } from 'vue-router'

const drawer = ref(false) // ✅ Controls sidebar
</script>

<template>
  <v-app>
    <!-- ✅ Sidebar Navigation -->
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
/* ✅ Keep Your Preferred Styling */
.v-application {
  font-family: 'Roboto', sans-serif;
  background-color: #f5f5f5;
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

/* ✅ Sidebar Styles */
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
