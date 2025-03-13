import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import { ProtectedRoute } from './components/ProtectedRoute'
import { Layout } from './components/Layout/Layout'
import { Home } from './pages/Home/Home'
import { Signup } from './pages/auth/SignUp'
import { Login } from './pages/auth/Login'
import { PasswordReset } from './pages/auth/PasswordReset'
import { Dashboard } from './pages/Dashboard/Dashboard'
import { MessageSpark } from './pages/MessageSpark/MessageSpark'
import { NotFound } from './pages/NotFound/NotFound'
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
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
        </Route>
      </Routes>
    </Router>
  )
}

export default App
