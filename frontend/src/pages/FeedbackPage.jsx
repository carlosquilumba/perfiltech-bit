import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../components/Button'
import { saveParticipant } from '../services/api'

const RATINGS = [
  { value: 1, emoji: '😢' },
  { value: 2, emoji: '😐' },
  { value: 3, emoji: '🙂' },
  { value: 4, emoji: '😊' },
  { value: 5, emoji: '🤩' }
]

function FeedbackPage() {
  const navigate = useNavigate()
  const [selectedRating, setSelectedRating] = useState(null)
  const [comment, setComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleRatingSelect = (rating) => {
    setSelectedRating(rating)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!selectedRating) {
      return
    }

    setIsSubmitting(true)

    try {
      const resultData = JSON.parse(localStorage.getItem('resultData') || '{}')

      // Construir payload para guardar participante completo en Cosmos DB
      const payload = {
        evento: 'ESPOCH_2025',
        nombre: resultData.nombre,
        email: resultData.email,
        carrera: resultData.carrera,
        respuestas: resultData.answers,
        perfil: {
          codigo: resultData.profile?.codigo,
          nombre: resultData.profile?.nombre,
          descripcion: resultData.profile?.descripcion,
          tecnologias: resultData.profile?.tecnologias,
        },
        rating: selectedRating,
        comentario: comment,
        avatar_url: resultData.avatar?.url || resultData.avatar || '',
        origen: 'web',
      }

      try {
        await saveParticipant(payload)
      } catch (err) {
        console.error('Error guardando participante (se continúa igual):', err)
      }

      navigate('/thanks')
    } catch (error) {
      console.error('Error en envío de feedback:', error)
      navigate('/thanks')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-2xl font-semibold text-gray-dark mb-2 text-center">
          ¿Qué tal tu experiencia?
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-8">
            <div className="flex justify-center gap-4 mb-4">
              {RATINGS.map((rating) => (
                <button
                  key={rating.value}
                  type="button"
                  onClick={() => handleRatingSelect(rating.value)}
                  className={`text-5xl transition-transform duration-200 ${
                    selectedRating === rating.value 
                      ? 'scale-125' 
                      : 'scale-100 hover:scale-110 opacity-60 hover:opacity-100'
                  }`}
                >
                  {rating.emoji}
                </button>
              ))}
            </div>
            <div className="flex justify-center gap-4">
              {RATINGS.map((rating) => (
                <span 
                  key={rating.value}
                  className={`text-sm font-medium ${
                    selectedRating === rating.value 
                      ? 'text-bit-blue' 
                      : 'text-gray-400'
                  }`}
                >
                  {rating.value}
                </span>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-dark mb-2">
              Comentario (opcional)
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Cuéntanos tu opinión..."
              rows={4}
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-bit-blue focus:ring-2 focus:ring-bit-blue-light outline-none resize-none"
            />
          </div>

          <Button
            type="submit"
            fullWidth
            variant="primary"
            disabled={!selectedRating || isSubmitting}
          >
            {isSubmitting ? 'Enviando...' : 'Enviar'}
          </Button>
        </form>
      </div>
    </div>
  )
}

export default FeedbackPage


