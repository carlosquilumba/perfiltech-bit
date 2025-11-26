import { useNavigate } from 'react-router-dom'
import Button from '../components/Button'

function HomePage() {
  const navigate = useNavigate()

  const handleStart = () => {
    navigate('/test')
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] text-center px-4">
      <div className="mb-8">
        <div className="w-24 h-24 mx-auto mb-6 bg-bit-blue rounded-full flex items-center justify-center">
          <span className="text-white text-4xl font-bold">BIT</span>
        </div>
      </div>
      
      <h1 className="text-3xl md:text-4xl font-bold text-gray-dark mb-4">
        Descubre tu perfil tech
      </h1>
      
      <p className="text-lg text-gray-600 mb-8 max-w-md">
        ¿Qué rol tecnológico va contigo?
      </p>
      
      <Button 
        onClick={handleStart}
        fullWidth
        variant="primary"
      >
        Comenzar Test
      </Button>
    </div>
  )
}

export default HomePage


