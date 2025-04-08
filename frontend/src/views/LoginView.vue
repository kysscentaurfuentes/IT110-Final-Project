<template>
  <div class="form-container">
    <h1>Sign In</h1>
    <form @submit.prevent="signIn">
      <div class="form-group">
        <label for="email">Email</label>
        <input id="email" type="email" v-model="email" required />
      </div>

      <div class="form-group">
        <label for="password">Password</label>
        <input id="password" type="password" v-model="password" required />
      </div>

      <div class="form-options">
        <label class="remember-me">
          <input type="checkbox" v-model="rememberMe" />
          Remember Me
        </label>
        <a v-if="emailError" href="#" class="forgot-password">Forgot Password?</a>
      </div>

      <button type="submit">Sign In</button>

      <p class="signup-link">
        Don't have an account?
        <a href="#">Sign Up</a>
      </p>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: '',
      password: '',
      rememberMe: false,
      emailError: false,
    }
  },
  methods: {
    signIn() {
      if (!this.email.includes('@')) {
        this.emailError = true
      } else {
        this.emailError = false
        console.log('Email:', this.email)
        console.log('Password:', this.password)
        console.log('Remember Me:', this.rememberMe)
      }
    },
  },
}
</script>

<style>
body {
  margin: 0;
  background-color: #2c3545;
}
</style>

<style scoped>
.form-container {
  width: 300px;
  margin: 50px auto;
  font-family: Arial, sans-serif;
  color: #ffffff;
}

h1 {
  text-align: center;
}

.form-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 15px;
}

label {
  margin-bottom: 5px;
  font-weight: bold;
}

input[type='email'],
input[type='password'] {
  padding: 8px;
  font-size: 14px;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.remember-me {
  font-size: 14px;
}

.forgot-password {
  font-size: 14px;
  color: #007bff;
  text-decoration: none;
}

.forgot-password:hover {
  text-decoration: underline;
}

button {
  padding: 10px;
  width: 100%;
  font-size: 16px;
  cursor: pointer;
}

.signup-link {
  text-align: center;
  margin-top: 10px;
  font-size: 14px;
}
.signup-link a {
  color: #007bff;
  text-decoration: none;
}
.signup-link a:hover {
  text-decoration: underline;
}
</style>
