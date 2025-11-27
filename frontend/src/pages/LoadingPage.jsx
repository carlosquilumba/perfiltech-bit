import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { analyzeProfile } from '../services/api'

const LOADING_MESSAGES = [
  'Analizando respuestas...',
  'Determinando tu perfil tech...',
  'Generando tu avatar personalizado...',
  'Casi listo...'
]

function LoadingPage() {
  const navigate = useNavigate()
  const [currentMessage, setCurrentMessage] = useState(0)
  const [error, setError] = useState(null)

  useEffect(() => {
    const processProfile = async () => {
      try {
        const participantData = JSON.parse(localStorage.getItem('participantData') || '{}')
        
        // Solo exigimos respuestas; la foto ahora es opcional
        if (!participantData.answers) {
          navigate('/identify')
          return
        }

        setCurrentMessage(0)
        await new Promise(resolve => setTimeout(resolve, 1500))

        setCurrentMessage(1)
        const profileResult = await analyzeProfile(participantData.answers)
        await new Promise(resolve => setTimeout(resolve, 1500))

        setCurrentMessage(3)
        
        const resultData = {
          ...participantData,
          profile: profileResult
        }
        
        localStorage.setItem('resultData', JSON.stringify(resultData))
        
        await new Promise(resolve => setTimeout(resolve, 500))
        navigate('/result')
      } catch (error) {
        console.error('Error procesando perfil:', error)
        setError('Error al generar tu perfil. Por favor, intenta nuevamente.')
      }
    }

    processProfile()
  }, [navigate])

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] text-center px-4">
        <div className="bg-white rounded-lg shadow-sm p-6 max-w-md">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => navigate('/identify')}
            className="px-6 py-3 bg-bit-blue text-white rounded-lg font-semibold hover:bg-bit-blue-light transition-colors"
          >
            Intentar Nuevamente
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] text-center px-4">
      <div className="mb-8">
        <div className="w-20 h-20 mx-auto mb-6 relative">
          <div className="absolute inset-0 border-4 border-bit-blue-light border-t-bit-blue rounded-full animate-spin"></div>
        </div>
      </div>
      
      <h2 className="text-2xl font-semibold text-gray-dark mb-4">
        Creando tu perfil...
      </h2>
      
      <p className="text-lg text-gray-600 mb-8">
        {LOADING_MESSAGES[currentMessage]}
      </p>
    </div>
  )
}

export default LoadingPage


