import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaFacebookF, FaLinkedinIn, FaTwitter, FaInstagram } from 'react-icons/fa'
import Button from '../components/Button'

function ThanksPage() {
  const navigate = useNavigate()

  // Ocultar scroll vertical solo en esta página
  useEffect(() => {
    const previousOverflow = document.body.style.overflowY
    document.body.style.overflowY = 'hidden'

    return () => {
      document.body.style.overflowY = previousOverflow
    }
  }, [])

  const handleNewParticipant = () => {
    localStorage.removeItem('testAnswers')
    localStorage.removeItem('participantData')
    localStorage.removeItem('resultData')
    navigate('/')
  }

  return (
    <div className="h-[calc(100vh-3.5rem)] flex flex-col bg-gray-50">
      {/* Contenido principal en blanco */}
      <main className="flex-1 flex items-center justify-center px-4 text-center">
        <div className="max-w-xl w-full bg-white rounded-lg shadow-card px-6 py-10 space-y-6">
          <div className="flex flex-col items-center gap-4">
            <div className="w-20 h-20 mx-auto mb-2 bg-white rounded-full flex items-center justify-center shadow-card">
              <span className="text-state-success text-4xl font-bold">✓</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              ¡Gracias por participar!
            </h2>
            <p className="text-base md:text-lg text-gray-700">
              Tu participación nos ayuda a crear mejores experiencias.
            </p>
          </div>

          <div className="max-w-md mx-auto pt-2">
            <Button 
              onClick={handleNewParticipant}
              fullWidth
              variant="primary"
            >
              Nuevo Participante
            </Button>
          </div>
        </div>
      </main>

      {/* Pie de página verde con iconos de redes */}
      <footer className="bg-bit-green text-white py-10">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
          <h3 className="text-xl md:text-2xl font-bold">
            Síguenos para enterarte de nuestros eventos y novedades:
          </h3>

          <div className="flex justify-center gap-10 text-3xl md:text-4xl">
            <a
              href="https://www.facebook.com/GrupoBusinessIT"
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook Grupo Business IT"
              className="hover:text-bit-green-light transition-colors"
            >
              <FaFacebookF />
            </a>
            <a
              href="https://www.linkedin.com/company/business-it---unlimited-solutions"
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn Grupo Business IT"
              className="hover:text-bit-green-light transition-colors"
            >
              <FaLinkedinIn />
            </a>
            <a
              href="https://twitter.com/grupobusinessit?lang=es"
              target="_blank"
              rel="noreferrer"
              aria-label="Twitter Grupo Business IT"
              className="hover:text-bit-green-light transition-colors"
            >
              <FaTwitter />
            </a>
            <a
              href="https://www.instagram.com/grupobusinessit/"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram Grupo Business IT"
              className="hover:text-bit-green-light transition-colors"
            >
              <FaInstagram />
            </a>
          </div>

          <p className="text-sm md:text-base mt-4">
            Copyright © Grupo Business IT 2025
          </p>
        </div>
      </footer>
    </div>
  )
}

export default ThanksPage


