import { createRouter, createWebHistory } from 'vue-router'
import SuperAdminDashboard from '@/views/SuperAdminDashboard.vue'
import SuperAdminLogin from '@/views/SuperAdminLogin.vue'
import EmployeeDashboard from '@/views/EmployeeDashboard.vue'
import CustomerDashboard from '@/views/CustomerDashboard.vue'
import HomeView from '@/views/HomeView.vue'
import AboutView from '@/views/AboutView.vue'
import LoginView from '@/views/LoginView.vue'

const routes = [
  { path: '/', redirect: '/login' }, // ✅ SuperAdminLogin na ang default page

  { path: '/admin/dashboard', component: SuperAdminDashboard, meta: { requiresAdmin: true } },
  { path: '/admin/login', component: SuperAdminLogin },

  { path: '/employee/dashboard', component: EmployeeDashboard, meta: { requiresEmployee: true } },
  { path: '/customer/dashboard', component: CustomerDashboard, meta: { requiresCustomer: true } },

  { path: '/home', component: HomeView },
  { path: '/about', component: AboutView },
  { path: '/login', component: LoginView },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// 🔄 Function to Refresh Access Token
async function refreshAccessToken() {
  try {
    console.log('🔄 Trying to refresh access token...')
    const response = await fetch('http://localhost:3000/auth/refresh-token', {
      method: 'POST',
      credentials: 'include', // ✅ Ensures cookies are sent
    })

    if (!response.ok) throw new Error(await response.text())

    const data = await response.json()
    sessionStorage.setItem('accessToken', data.accessToken)
    console.log('✅ Token refreshed successfully!')

    return data.accessToken
  } catch (error) {
    console.error('🔴 Token refresh failed:', error)
    return null
  }
}

// 🔐 [SECURITY] Protect Admin Routes - Only allow correct roles & refresh token if expired → 🚨 Blocks unauthorized access
router.beforeEach(async (to, from, next) => {
  console.log(`Navigating to: ${to.path}`)

  let accessToken = sessionStorage.getItem('accessToken')
  let userRole = sessionStorage.getItem('userRole')

  // ✅ Exclude public routes from authentication check
  const publicRoutes = ['/home', '/about', '/admin/login']
  if (publicRoutes.includes(to.path)) {
    console.log('✅ Public route, proceeding without auth check.')
    return next() // ✅ Allow access to public routes
  }

  // 🔐 [SECURITY] Auto-refresh token if missing → 🔄 Prevents forced logouts
  if (!accessToken) {
    console.log('🔴 Access token missing, attempting refresh...')
    accessToken = await refreshAccessToken()

    if (!accessToken) {
      console.log('❌ No valid token, redirecting to login')
      return next('/admin/login')
    }
  }

  // 🔐 [SECURITY] Extract user role from JWT → ⚠️Prevents tampering with local storage
  try {
    const tokenPayload = JSON.parse(atob(accessToken.split('.')[1])) // Decode JWT
    userRole = tokenPayload.role // Get role from payload
    sessionStorage.setItem('userRole', userRole) // Save updated role
  } catch (error) {
    console.error('❌ Error decoding access token:', error)
    return next('/admin/login')
  }

  // 🔐 [SECURITY] Role-Based Access Control (RBAC) → 🏛️ Controls user permissions
  if (to.meta.requiresAdmin && userRole !== 'superadmin') {
    console.log('🔒 Not an admin, redirecting to /home')
    return next('/home')
  }

  if (to.meta.requiresEmployee && userRole !== 'employee') {
    console.log('🔒 Not an employee, redirecting to /home')
    return next('/home')
  }

  if (to.meta.requiresCustomer && userRole !== 'customer') {
    console.log('🔒 Not a customer, redirecting to /home')
    return next('/home')
  }

  return next() // ✅ Proceed if all checks pass
})

export default router
