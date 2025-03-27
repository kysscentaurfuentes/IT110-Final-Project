import axios from 'axios'
const API_URL = 'http://localhost:3000/users'

// 🔐 [SECURITY] Attach Access Token to API Requests Automatically → 🔗 Ensures secure API calls
axios.defaults.headers.common['Authorization'] = `Bearer ${sessionStorage.getItem('accessToken')}`

// ✅ Fetch Users
export async function getUsers() {
  try {
    const token = sessionStorage.getItem('accessToken') // ✅ Gamitin ang sessionStorage
    if (!token) throw new Error('No token found')

    console.log('📡 Sending request with token:', token) // ✅ Debugging

    const response = await axios.get('http://localhost:3000/users', {
      headers: { Authorization: `Bearer ${token}` },
    })

    console.log('✅ Response received:', response.data)
    return response.data
  } catch (error) {
    console.error('❌ Error fetching users:', error.response?.data || error.message)
    return []
  }
}

// ✅ Update User Role
export async function updateUserRole(userId, newRole) {
  try {
    const token = sessionStorage.getItem('accessToken')
    await axios.put(
      `${API_URL}/${userId}`,
      { role: newRole },
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    )
  } catch (error) {
    console.error('❌ Error updating user role:', error.response?.data || error.message)
    throw error
  }
}

// ✅ Delete User (FIXED!)
export async function deleteUser(userId) {
  try {
    const token = sessionStorage.getItem('accessToken')
    await axios.delete(`${API_URL}/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
  } catch (error) {
    console.error('❌ Error deleting user:', error.response?.data || error.message)
    throw error
  }
}
