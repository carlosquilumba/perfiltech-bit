import { useLocation, useNavigate } from 'react-router-dom'

function Layout({ children }) {
  const location = useLocation()
  const navigate = useNavigate()
  const showBackButton = location.pathname !== '/' && location.pathname !== '/thanks'

  const handleBack = () => {
    navigate(-1)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container-mobile md:container-desktop">
          <div className="flex items-center justify-between h-14">
            {showBackButton && (
              <button
                onClick={handleBack}
                className="text-bit-black font-medium text-sm hover:opacity-80 transition-opacity"
                aria-label="Volver"
              >
                Atrás
              </button>
            )}
            <div className="flex-1 flex justify-center">
              {/* Logo de la empresa BIT */}
              <img
                src="/logo-business-it.png"
                alt="Business IT"
                className="h-8 md:h-10 object-contain"
              />
            </div>
            {showBackButton && <div className="w-12" />}
          </div>
        </div>
      </header>
      
      <main className="container-mobile md:container-desktop py-6">
        {children}
      </main>
    </div>
  )
}

export default Layout


