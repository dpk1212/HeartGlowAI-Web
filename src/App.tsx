import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import { ProtectedRoute } from './components/ProtectedRoute'
import { MessageSpark } from './pages/MessageSpark/MessageSpark'
import Login from './pages/auth/Login.jsx'
import SignUp from './pages/auth/SignUp.jsx'
import AuthLanding from './pages/auth/AuthLanding.jsx'
import WelcomeHome from './pages/auth/WelcomeHome.jsx'
import { AuthProvider } from './contexts/AuthContext'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<AuthLanding />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/authlanding" element={<AuthLanding />} />
          <Route
            path="/welcome"
            element={
              <ProtectedRoute>
                <WelcomeHome />
              </ProtectedRoute>
            }
          />
          <Route
            path="/message"
            element={
              <ProtectedRoute>
                <MessageSpark />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<AuthLanding />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
