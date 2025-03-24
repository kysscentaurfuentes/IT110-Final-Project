import axios from 'axios'

const API_URL = 'http://localhost:3000/users'

export async function getUsers() {
  try {
    const response = await axios.get(API_URL)
    return response.data
  } catch (error) {
    console.error('❌ Error fetching users:', error)
    return []
  }
}
