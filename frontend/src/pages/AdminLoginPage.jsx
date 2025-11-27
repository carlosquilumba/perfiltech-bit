import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../components/Button'
import Input from '../components/Input'
import { adminLogin } from '../services/adminApi'

function AdminLoginPage() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // 🔓 Redirigir automáticamente al dashboard (seguridad desactivada)
  // Comentado para evitar bucles - accede directamente a /admin/dashboard
  // useEffect(() => {
  //   navigate('/admin/dashboard', { replace: true })
  // }, [navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const response = await adminLogin(username, password)
      
      if (response.token) {
        localStorage.setItem('admin_token', response.token)
        navigate('/admin/dashboard')
      } else {
        setError('Credenciales inválidas')
      }
    } catch (err) {
      setError('Error al iniciar sesión. Verifica tus credenciales.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg shadow-card p-8">
          <div className="text-center mb-8">
            <img
              src="/logo-business-it.png"
              alt="Business IT"
              className="h-12 mx-auto mb-4"
            />
            <h1 className="text-2xl font-bold text-bit-black">
              Panel de Administración
            </h1>
            <p className="text-gray-600 mt-2">
              Ingresa tus credenciales para continuar
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <Input
              label="Usuario"
              name="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Ingresa tu usuario"
              required
              error={error ? null : null}
            />

            <Input
              label="Contraseña"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Ingresa tu contraseña"
              required
              error={error ? null : null}
            />

            <Button
              type="submit"
              fullWidth
              variant="primary"
              disabled={isLoading || !username || !password}
            >
              {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AdminLoginPage
