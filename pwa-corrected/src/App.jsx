import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './components/Login'
import Dashboard from './components/Dashboard'
import StudentInterface from './components/StudentInterface'
import AIChat from './components/AIChat'
import WeatherWidget from './components/WeatherWidget'
// import NotificationManager from './components/NotificationManager'
import InstallPrompt from './components/InstallPrompt'
import AIService from './services/AIService'
import Operations from './components/Operations'
import Reservations from './components/Reservations'
import Students from './components/Students'
import Messages from './components/Messages'
import Simulator from './components/Simulator'
import Logbook from './components/Logbook'
import Schedule from './components/Schedule'
import Locations from './components/Locations'
import Support from './components/Support'
import ClassDetails from './components/ClassDetails'
import './App.css'

function App() {
  const [user, setUser] = useState(null)
  const [weatherData, setWeatherData] = useState({
    temperature: 22,
    waveHeight: 1.2,
    windSpeed: 15,
    visibility: 8,
    status: 'green',
    hasClasses: true,
    nextClass: 'Aula Open Water - 14:00',
    recommendation: 'Condições excelentes para mergulho!'
  })
  const [aiService] = useState(new AIService())
  const [showInstallPrompt, setShowInstallPrompt] = useState(false)

  useEffect(() => {
    // Verificar se já está logado
    const savedUser = localStorage.getItem('justdive_user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }

    // Verificar se PWA pode ser instalada
    const checkInstallPrompt = () => {
      if ('serviceWorker' in navigator && !window.matchMedia('(display-mode: standalone)').matches) {
        setShowInstallPrompt(true)
      }
    }

    checkInstallPrompt()

    // Simular atualizações de dados meteorológicos
    const weatherInterval = setInterval(() => {
      setWeatherData(prev => ({
        ...prev,
        temperature: Math.round(18 + Math.random() * 8),
        waveHeight: Math.round((0.5 + Math.random() * 2) * 10) / 10,
        windSpeed: Math.round(5 + Math.random() * 25),
        visibility: Math.round(5 + Math.random() * 10),
        status: Math.random() > 0.8 ? 'yellow' : Math.random() > 0.95 ? 'red' : 'green'
      }))
    }, 30000) // Atualizar a cada 30 segundos para demonstração

    return () => clearInterval(weatherInterval)
  }, [])

  const handleLogin = (userData) => {
    setUser(userData)
    localStorage.setItem('justdive_user', JSON.stringify(userData))
  }

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem('justdive_user')
  }

  if (!user) {
    return (
      <div className="min-h-screen justdive-gradient">
        <Login onLogin={handleLogin} />
        {showInstallPrompt && (
          <InstallPrompt onClose={() => setShowInstallPrompt(false)} />
        )}
      </div>
    )
  }

  return (
    <Router>
      <div className="min-h-screen justdive-gradient">
        {/* <NotificationManager weatherData={weatherData} /> */}
        
        <Routes>
          <Route 
            path="/dashboard" 
            element={
              user.type === 'admin' ? (
                <Dashboard 
                  user={user} 
                  weatherData={weatherData}
                  onLogout={handleLogout}
                  aiService={aiService}
                />
              ) : (
                <Navigate to="/student" replace />
              )
            } 
          />
          <Route 
            path="/student" 
            element={
              user.type === 'student' ? (
                <StudentInterface 
                  user={user} 
                  weatherData={weatherData}
                  onLogout={handleLogout}
                  aiService={aiService}
                />
              ) : (
                <Navigate to="/dashboard" replace />
              )
            } 
          />
          <Route
            path="/chat"
            element={
              <AIChat
                user={user}
                weatherData={weatherData}
                aiService={aiService}
                onBack={() => window.history.back()}
              />
            }
          />
          <Route
            path="/operations"
            element={
              user.type === 'admin' ? <Operations /> : <Navigate to="/student" replace />
            }
          />
          <Route
            path="/reservations"
            element={
              user.type === 'admin' ? <Reservations /> : <Navigate to="/student" replace />
            }
          />
          <Route
            path="/students"
            element={
              user.type === 'admin' ? <Students /> : <Navigate to="/student" replace />
            }
          />
          <Route
            path="/messages"
            element={
              user.type === 'admin' ? <Messages /> : <Navigate to="/student" replace />
            }
          />
          <Route
            path="/simulator"
            element={
              user.type === 'admin' ? <Simulator /> : <Navigate to="/student" replace />
            }
          />
          <Route
            path="/logbook"
            element={
              user.type === 'student' ? <Logbook /> : <Navigate to="/dashboard" replace />
            }
          />
          <Route
            path="/schedule"
            element={
              user.type === 'student' ? <Schedule /> : <Navigate to="/dashboard" replace />
            }
          />
          <Route
            path="/locations"
            element={
              user.type === 'student' ? <Locations /> : <Navigate to="/dashboard" replace />
            }
          />
          <Route
            path="/support"
            element={
              user.type === 'student' ? <Support /> : <Navigate to="/dashboard" replace />
            }
          />
          <Route
            path="/classes/:id"
            element={<ClassDetails />}
          />
          <Route
            path="/"
            element={
              <Navigate to={user.type === 'admin' ? '/dashboard' : '/student'} replace />
            }
          />
        </Routes>

        {showInstallPrompt && (
          <InstallPrompt onClose={() => setShowInstallPrompt(false)} />
        )}
      </div>
    </Router>
  )
}

export default App

