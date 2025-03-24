import { createRouter, createWebHistory } from 'vue-router'
import SuperAdminDashboard from '@/views/SuperAdminDashboard.vue'
import SuperAdminLogin from '@/views/SuperAdminLogin.vue'
import EmployeeDashboard from '@/views/EmployeeDashboard.vue'
import CustomerDashboard from '@/views/CustomerDashboard.vue'
import HomeView from '@/views/HomeView.vue'
import AboutView from '@/views/AboutView.vue'

const routes = [
  { path: '/', redirect: '/home' }, // ✅ Home ang default page

  { path: '/admin/dashboard', component: SuperAdminDashboard, meta: { requiresAdmin: true } },
  { path: '/admin/login', component: SuperAdminLogin, meta: { requiresAdmin: true } },

  { path: '/employee/dashboard', component: EmployeeDashboard, meta: { requiresEmployee: true } },
  { path: '/customer/dashboard', component: CustomerDashboard, meta: { requiresCustomer: true } },

  { path: '/home', component: HomeView },
  { path: '/about', component: AboutView }
]


const router = createRouter({
  history: createWebHistory(),
  routes
})

// 🔍 Debugging Logs + Authentication Guards
router.beforeEach((to, from, next) => {
  console.log(`Navigating to: ${to.path}`)

  const userRole = localStorage.getItem('userRole')

  if (to.meta.requiresAdmin && userRole !== 'superadmin') {
    console.log('🔒 Not an admin, redirecting to /home')
    next('/home')
  } else if (to.meta.requiresEmployee && userRole !== 'employee') {
    console.log('🔒 Not an employee, redirecting to /home')
    next('/home')
  } else {
    next()
  }
})

export default router
