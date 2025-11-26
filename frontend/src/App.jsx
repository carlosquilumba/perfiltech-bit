import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import TestPage from './pages/TestPage'
import IdentifyPage from './pages/IdentifyPage'
import LoadingPage from './pages/LoadingPage'
import ResultPage from './pages/ResultPage'
import FeedbackPage from './pages/FeedbackPage'
import ThanksPage from './pages/ThanksPage'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/test" element={<TestPage />} />
        <Route path="/identify" element={<IdentifyPage />} />
        <Route path="/loading" element={<LoadingPage />} />
        <Route path="/result" element={<ResultPage />} />
        <Route path="/feedback" element={<FeedbackPage />} />
        <Route path="/thanks" element={<ThanksPage />} />
      </Routes>
    </Layout>
  )
}

export default App


