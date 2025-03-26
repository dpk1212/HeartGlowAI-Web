import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import AuthLanding from './pages/auth/AuthLanding.jsx'
import { MessageSpark } from './pages/MessageSpark/MessageSpark'
import Login from './pages/auth/Login.jsx'
import Signup from './pages/auth/Signup.jsx'
import { ProtectedRoute } from './components/ProtectedRoute'
import WelcomeHome from './pages/auth/WelcomeHome.jsx'
import { AuthProvider } from './contexts/AuthContext'
import TestMessageGeneration from './pages/TestMessageGeneration'
import MessageResults from './pages/MessageResults'

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <Router>
          <Routes>
            <Route
              path="/message-spark"
              element={
                <ProtectedRoute>
                  <MessageSpark />
                </ProtectedRoute>
              }
            />
            <Route
              path="/welcome"
              element={
                <ProtectedRoute>
                  <WelcomeHome />
                </ProtectedRoute>
              }
            />
            <Route
              path="/message-results/:conversationId"
              element={
                <ProtectedRoute>
                  <MessageResults />
                </ProtectedRoute>
              }
            />
            <Route path="/test-generation" element={<TestMessageGeneration />} />
            <Route path="*" element={<AuthLanding />} />
          </Routes>
        </Router>
      </AuthProvider>
    </div>
  )
}

export default App
