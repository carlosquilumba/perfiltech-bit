import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Input from '../components/Input'
import CameraCapture from '../components/CameraCapture'
import Button from '../components/Button'

function IdentifyPage() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    carrera: ''
  })
  const [photo, setPhoto] = useState(null)
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }))
    }
  }

  const handlePhotoCapture = (base64Photo) => {
    setPhoto(base64Photo)
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido'
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      const answers = JSON.parse(localStorage.getItem('testAnswers') || '[]')
      
      const participantData = {
        nombre: formData.nombre,
        email: formData.email,
        carrera: formData.carrera,
        photo: photo,
        answers: answers
      }

      localStorage.setItem('participantData', JSON.stringify(participantData))
      
      navigate('/loading')
    } catch (error) {
      console.error('Error al guardar datos:', error)
      setErrors({ submit: 'Error al procesar. Intenta nuevamente.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-2xl font-semibold text-gray-dark mb-2">
          Identifícate
        </h2>
        <p className="text-gray-600 mb-6">
          Para generar tu avatar personalizado
        </p>

        <form onSubmit={handleSubmit}>
          <Input
            label="Nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            placeholder="Tu nombre completo"
            required
            error={errors.nombre}
          />

          <Input
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="tu@email.com"
            required
            error={errors.email}
          />

          <Input
            label="Carrera"
            name="carrera"
            value={formData.carrera}
            onChange={handleChange}
            placeholder="Ej: Ingeniería en Sistemas"
          />

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-dark mb-2">
              Foto (opcional)
            </label>
            {errors.photo && (
              <p className="mb-2 text-sm text-red-500">{errors.photo}</p>
            )}
            <CameraCapture 
              onCapture={handlePhotoCapture}
              onError={(error) => setErrors({ photo: error })}
            />
            {photo && (
              <div className="mt-4">
                <img 
                  src={photo} 
                  alt="Preview" 
                  className="w-32 h-32 object-cover rounded-lg border-2 border-bit-blue"
                />
              </div>
            )}
          </div>

          {errors.submit && (
            <p className="mb-4 text-sm text-red-500">{errors.submit}</p>
          )}

          <Button
            type="submit"
            fullWidth
            variant="primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Procesando...' : 'Generar Mi Perfil'}
          </Button>
        </form>
      </div>
    </div>
  )
}

export default IdentifyPage


