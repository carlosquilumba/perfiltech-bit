import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

function AdminLayout({ children }) {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <img
                src="/logo-business-it.png"
                alt="Business IT"
                className="h-8 object-contain"
              />
              <span className="text-bit-black font-semibold text-lg">
                Panel de Administración
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  )
}

export default AdminLayout
