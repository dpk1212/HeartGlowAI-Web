import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import { ProtectedRoute } from './components/ProtectedRoute'
import { Layout } from './components/Layout/Layout'
import { Home } from './pages/Home/Home'
import { SignUp } from './pages/auth/SignUp'
import { Login } from './pages/auth/Login'
import { PasswordReset } from './pages/auth/PasswordReset'
import { Dashboard } from './pages/Dashboard/Dashboard'
import { MessageSpark } from './pages/MessageSpark/MessageSpark'
import { NotFound } from './pages/NotFound/NotFound'
import './App.css'

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/reset-password" element={<PasswordReset />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/messagespark"
            element={
              <ProtectedRoute>
                <MessageSpark />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App
