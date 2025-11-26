import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import ProgressBar from '../components/ProgressBar'
import Button from '../components/Button'

const QUESTIONS = [
  {
    id: 1,
    question: 'Cuando tienes un problema, ¿qué haces?',
    options: [
      { id: 1, text: 'Investigar a fondo' },
      { id: 2, text: 'Probar soluciones' },
      { id: 3, text: 'Hacer un plan' },
      { id: 4, text: 'Preguntar a otros' }
    ]
  },
  {
    id: 2,
    question: '¿Qué te motiva más en un proyecto?',
    options: [
      { id: 1, text: 'Resolver problemas complejos' },
      { id: 2, text: 'Crear algo visualmente atractivo' },
      { id: 3, text: 'Optimizar procesos' },
      { id: 4, text: 'Aprender nuevas tecnologías' }
    ]
  },
  {
    id: 3,
    question: 'Prefieres trabajar en:',
    options: [
      { id: 1, text: 'Lógica y algoritmos' },
      { id: 2, text: 'Diseño e interfaz' },
      { id: 3, text: 'Infraestructura y sistemas' },
      { id: 4, text: 'Análisis de datos' }
    ]
  },
  {
    id: 4,
    question: 'Tu enfoque ideal es:',
    options: [
      { id: 1, text: 'Profundizar en un área' },
      { id: 2, text: 'Conocer un poco de todo' },
      { id: 3, text: 'Automatizar tareas repetitivas' },
      { id: 4, text: 'Encontrar patrones y tendencias' }
    ]
  },
  {
    id: 5,
    question: '¿Qué te llama más la atención?',
    options: [
      { id: 1, text: 'Inteligencia artificial' },
      { id: 2, text: 'Experiencia de usuario' },
      { id: 3, text: 'Seguridad y protección' },
      { id: 4, text: 'Escalabilidad y performance' }
    ]
  }
]

function TestPage() {
  const navigate = useNavigate()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState([])

  const question = QUESTIONS[currentQuestion]
  const totalQuestions = QUESTIONS.length

  const handleAnswer = (optionId) => {
    const newAnswers = [...answers, optionId]
    setAnswers(newAnswers)

    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      localStorage.setItem('testAnswers', JSON.stringify(newAnswers))
      navigate('/identify')
    }
  }

  useEffect(() => {
    const savedAnswers = localStorage.getItem('testAnswers')
    if (savedAnswers) {
      const parsed = JSON.parse(savedAnswers)
      if (parsed.length > 0 && parsed.length < totalQuestions) {
        setAnswers(parsed)
        setCurrentQuestion(parsed.length)
      }
    }
  }, [])

  return (
    <div className="max-w-2xl mx-auto">
      <ProgressBar current={currentQuestion + 1} total={totalQuestions} />
      
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h2 className="text-xl md:text-2xl font-semibold text-gray-dark mb-8">
          {question.question}
        </h2>
        
        <div className="space-y-3">
          {question.options.map((option) => (
            <button
              key={option.id}
              onClick={() => handleAnswer(option.id)}
              className="w-full text-left px-4 py-4 bg-gray-light rounded-lg border-2 border-transparent hover:border-bit-blue hover:bg-white transition-all duration-200"
            >
              <span className="text-gray-dark font-medium">{option.text}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default TestPage


