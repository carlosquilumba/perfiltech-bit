// Base de la API
// Prioridad: 1) VITE_API_BASE_URL (si está definida), 2) Azure (producción), 3) localhost (solo desarrollo)
const API_BASE_URL = 
  import.meta.env.VITE_API_BASE_URL || 
  (typeof window !== 'undefined' && window.location.hostname === 'localhost' 
    ? 'http://localhost:7071/api' 
    : 'https://bit-profile-prod-func-eastus-b5b5bpewdtenahdb.eastus2-01.azurewebsites.net/api')

// Debug: mostrar la URL que se está usando
console.log('🔧 API_BASE_URL:', API_BASE_URL)

async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  }

  if (options.body && typeof options.body === 'object') {
    config.body = JSON.stringify(options.body)
  }

  try {
    const response = await fetch(url, config)
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error('API Request failed:', error)
    throw error
  }
}

export async function analyzeProfile(answers) {
  try {
    // Endpoint real en Azure Functions (Python): /api/analyze_profile
    const response = await apiRequest('/analyze_profile', {
      method: 'POST',
      body: { respuestas: answers }
    })
    return response
  } catch (error) {
    console.error('Error analyzing profile:', error)
    
    const mockProfiles = {
      1: { codigo: 'AI_ML', nombre: 'AI/ML Engineer', icono: '🤖', descripcion: 'Tu curiosidad y capacidad analítica te hacen ideal para crear inteligencia artificial.', tecnologias: ['Python', 'TensorFlow', 'Azure AI'] },
      2: { codigo: 'FRONTEND', nombre: 'Frontend Developer', icono: '🎨', descripcion: 'Tu creatividad y atención al detalle te hacen perfecto para crear experiencias visuales.', tecnologias: ['React', 'TypeScript', 'CSS'] },
      3: { codigo: 'BACKEND', nombre: 'Backend Developer', icono: '⚙️', descripcion: 'Tu lógica y capacidad de resolver problemas te hacen ideal para construir sistemas robustos.', tecnologias: ['Node.js', 'Python', 'APIs'] },
      4: { codigo: 'FULLSTACK', nombre: 'Full Stack Developer', icono: '🚀', descripcion: 'Tu versatilidad te permite trabajar en todas las capas de una aplicación.', tecnologias: ['React', 'Node.js', 'Databases'] }
    }
    
    const profileIndex = (answers.reduce((a, b) => a + b, 0) % 4) + 1
    return mockProfiles[profileIndex] || mockProfiles[1]
  }
}

export async function saveParticipant(data) {
  try {
    const response = await apiRequest('/save-participant', {
      method: 'POST',
      body: data
    })
    return response
  } catch (error) {
    console.error('Error saving participant:', error)
    throw error
  }
}

