import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../components/Button'
import html2canvas from 'html2canvas'

function ResultPage() {
  const navigate = useNavigate()
  const [resultData, setResultData] = useState(null)
  const cardRef = useRef(null)

  useEffect(() => {
    const data = localStorage.getItem('resultData')
    if (data) {
      setResultData(JSON.parse(data))
    } else {
      navigate('/')
    }
  }, [navigate])

  const handleDownload = async () => {
    if (!cardRef.current || !resultData) return

    const canvas = await html2canvas(cardRef.current, {
      backgroundColor: null,
      scale: 2,
    })

    canvas.toBlob((blob) => {
      if (!blob) return
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `perfil-tech-${resultData.nombre.replace(/\s+/g, '-')}.png`
      a.click()
      URL.revokeObjectURL(url)
    })
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Mi Perfil Tech - BIT',
          text: `Soy ${resultData.profile.nombre}! ${resultData.profile.descripcion}`,
          url: window.location.href
        })
      } catch (error) {
        console.log('Error compartiendo:', error)
      }
    }
  }

  const handleContinue = () => {
    navigate('/feedback')
  }

  if (!resultData || !resultData.profile) {
    return null
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div
        ref={cardRef}
        className="bg-white rounded-lg shadow-card p-6 mb-6 border-l-4 border-bit-green"
      >
        {resultData.avatar && (
          <div className="mb-6 text-center">
            <img 
              src={resultData.avatar.url || resultData.avatar} 
              alt="Avatar" 
              className="w-40 h-40 mx-auto rounded-lg object-cover border-4 border-bit-green-light"
            />
          </div>
        )}

        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-1">
            {resultData.nombre}
          </h2>
          <p className="text-lg text-bit-green-dark font-semibold mb-3">
            {resultData.profile.icono} {resultData.profile.nombre}
          </p>
          <p className="text-gray-700 mb-4">
            {resultData.profile.descripcion}
          </p>
          {resultData.profile.tecnologias && resultData.profile.tecnologias.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2 mb-4">
              {resultData.profile.tecnologias.map((tech, index) => (
                <span 
                  key={index}
                  className="px-3 py-1 bg-bit-green-light/20 text-bit-black rounded-full text-sm"
                >
                  {tech}
                </span>
              ))}
            </div>
          )}
          <div className="border-t border-gray-200 pt-4 mt-4">
            <p className="text-sm text-gray-600">
              Business IT · 2025
            </p>
          </div>
        </div>

        <div className="flex gap-3 mb-4">
          <Button 
            onClick={handleDownload}
            variant="secondary"
            fullWidth
          >
            Guardar
          </Button>
          <Button 
            onClick={handleShare}
            variant="outline"
            fullWidth
          >
            Compartir
          </Button>
        </div>

        <Button 
          onClick={handleContinue}
          variant="primary"
          fullWidth
        >
          Continuar
        </Button>
      </div>
    </div>
  )
}

export default ResultPage


