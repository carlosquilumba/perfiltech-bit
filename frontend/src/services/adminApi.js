// Base de la API
// Prioridad: 1) VITE_API_BASE_URL (si está definida), 2) Azure (producción), 3) localhost (solo desarrollo)
const API_BASE_URL = 
  import.meta.env.VITE_API_BASE_URL || 
  (typeof window !== 'undefined' && window.location.hostname === 'localhost' 
    ? 'http://localhost:7071/api' 
    : 'https://bit-profile-prod-func-eastus-b5b5bpewdtenahdb.eastus2-01.azurewebsites.net/api')

function getAuthHeaders() {
  const token = localStorage.getItem('admin_token')
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  }
}

async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`

  const config = {
    method: options.method || 'GET',
    headers: getAuthHeaders(),
    ...options,
  }

  if (options.body && typeof options.body === 'object') {
    config.body = JSON.stringify(options.body)
  }

  try {
    const response = await fetch(url, config)

    if (response.status === 401) {
      localStorage.removeItem('admin_token')
      // 🔓 Redirección desactivada temporalmente para evitar bucles
      // window.location.href = '/admin/login'
      throw new Error('No autorizado')
    }

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error('API Request failed:', error)
    throw error
  }
}

export async function adminLogin(username, password) {
  try {
    const response = await apiRequest('/admin-login', {
      method: 'POST',
      body: { username, password },
    })
    return response
  } catch (error) {
    console.error('Error en login:', error)
    throw error
  }
}

export async function getParticipants(evento = 'ESPOCH_2025', filters = {}) {
  try {
    const params = new URLSearchParams({ evento, ...filters })
    const response = await apiRequest(`/participants?${params}`)
    return response
  } catch (error) {
    console.error('Error fetching participants:', error)
    throw error
  }
}

export async function deleteParticipant(evento, id) {
  try {
    const params = new URLSearchParams({ evento, id })
    const response = await apiRequest(`/participants?${params}`, {
      method: 'DELETE',
    })
    return response
  } catch (error) {
    console.error('Error deleting participant:', error)
    throw error
  }
}
