import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import TestPage from './pages/TestPage'
import IdentifyPage from './pages/IdentifyPage'
import LoadingPage from './pages/LoadingPage'
import ResultPage from './pages/ResultPage'
import FeedbackPage from './pages/FeedbackPage'
import ThanksPage from './pages/ThanksPage'
import AdminLoginPage from './pages/AdminLoginPage'
import AdminParticipantsPage from './pages/AdminParticipantsPage'

function App() {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/" element={<Layout><HomePage /></Layout>} />
      <Route path="/test" element={<Layout><TestPage /></Layout>} />
      <Route path="/identify" element={<Layout><IdentifyPage /></Layout>} />
      <Route path="/loading" element={<Layout><LoadingPage /></Layout>} />
      <Route path="/result" element={<Layout><ResultPage /></Layout>} />
      <Route path="/feedback" element={<Layout><FeedbackPage /></Layout>} />
      <Route path="/thanks" element={<Layout><ThanksPage /></Layout>} />
      
      {/* Rutas de admin */}
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route 
        path="/admin" 
        element={<Navigate to="/admin/participants" replace />} 
      />
      <Route 
        path="/admin/dashboard" 
        element={<AdminParticipantsPage />} 
      />
      <Route 
        path="/admin/participants" 
        element={<AdminParticipantsPage />} 
      />
    </Routes>
  )
}

export default App


