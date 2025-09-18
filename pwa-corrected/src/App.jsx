import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import LoginModernized from './components/LoginModernized'
import DashboardModernized from './components/DashboardModernized'
import StudentInterfaceModern from './components/StudentInterfaceModern'
import AIChat from './components/AIChat'
import WeatherWidget from './components/WeatherWidget'
import InstallPrompt from './components/InstallPrompt'
import AIService from './services/AIService'

import WeatherOperations from './components/WeatherOperations'
import ReservationsPage from './components/ReservationsPage'
import StudentsPage from './components/StudentsPage'
import MessagesPage from './components/MessagesPage'
import SimulatorPage from './components/SimulatorPage'
import LogbookPage from './components/LogbookPage'
import SchedulePage from './components/SchedulePage'
import LocationsPage from './components/LocationsPage'
import SupportPage from './components/SupportPage'

import './App.css'
import './styles/justdive-theme.css'

function App() {
  const [user, setUser] = useState(null)
  const [currentPage, setCurrentPage] = useState('dashboard')
  const [weatherData, setWeatherData] = useState({
    location: 'Berlengas',
    status: 'GREEN',
    temperature: 22,
    waterTemperature: 18,
    waveHeight: 1.2,
    windSpeed: 15,
    visibility: 8,
    hasClasses: true,
    nextClass: 'Aula Open Water - 14:00',
    recommendation: 'Condições excelentes para mergulho!'
  })
  const [aiService] = useState(new AIService())
  const [showInstallPrompt, setShowInstallPrompt] = useState(false)
  const [notifications, setNotifications] = useState([])

  useEffect(() => {
    const savedUser = localStorage.getItem('justdive_user')
    if (savedUser) setUser(JSON.parse(savedUser))

    if ('serviceWorker' in navigator && !window.matchMedia('(display-mode: standalone)').matches) {
      setShowInstallPrompt(true)
    }

    // Carregar dados meteorológicos reais
    if (savedUser) {
      fetchWeatherData()
      const weatherInterval = setInterval(fetchWeatherData, 15 * 60 * 1000) // 15 minutos
      return () => clearInterval(weatherInterval)
    }
  }, [])

  const fetchWeatherData = async () => {
    try {
      const response = await fetch('/api/weather/berlengas')
      if (response.ok) {
        const { data: apiData } = await response.json()
        if (apiData) {
          setWeatherData(prev => ({ ...prev, ...apiData }))
        }
      }
    } catch (error) {
      console.error('Erro ao buscar dados meteorológicos:', error)
      // Simular dados realistas em caso de erro
      setWeatherData(prev => ({
        ...prev,
        temperature: Math.round(18 + Math.random() * 8),
        waveHeight: Math.round((0.5 + Math.random() * 2) * 10) / 10,
        windSpeed: Math.round(5 + Math.random() * 25),
        visibility: Math.round(5 + Math.random() * 10),
        status: Math.random() > 0.8 ? 'YELLOW' : Math.random() > 0.95 ? 'RED' : 'GREEN'
      }))
    }
  }

  const handleLogin = (userData) => {
    setUser(userData)
    localStorage.setItem('justdive_user', JSON.stringify(userData))
    setCurrentPage('dashboard')
  }

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem('justdive_user')
    setCurrentPage('dashboard')
  }

  const handleNavigate = (page) => {
    setCurrentPage(page)
  }

  const handleSendNotification = async (title, message) => {
    try {
      const response = await fetch('/api/notifications/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, message }),
      })
      
      if (response.ok) {
        const newNotification = {
          id: Date.now(),
          title,
          message,
          timestamp: new Date().toISOString(),
          read: false
        }
        setNotifications(prev => [newNotification, ...prev])
        return true
      }
    } catch (error) {
      console.error('Erro ao enviar notificação:', error)
    }
    return false
  }

  if (!user) {
    return (
      <div className="min-h-screen">
        <LoginModernized onLogin={handleLogin} />
        {showInstallPrompt && <InstallPrompt onClose={() => setShowInstallPrompt(false)} />}
      </div>
    )
  }

  return (
    <Router>
      <div className="min-h-screen">
        <Routes>
          <Route
            path="/dashboard"
            element={
              user.type === 'admin' ? (
                <DashboardModernized 
                  user={user} 
                  weatherData={weatherData} 
                  notifications={notifications}
                  onLogout={handleLogout} 
                  onNavigate={handleNavigate}
                  aiService={aiService} 
                />
              ) : (<Navigate to="/student" replace />)
            }
          />

          {/* Admin pages under /dashboard */}
          <Route path="/dashboard/operations" element={user.type === 'admin' ? <WeatherOperations user={user} weatherData={weatherData} onNavigate={handleNavigate} /> : <Navigate to="/student" replace />} />
          <Route path="/dashboard/reservations" element={user.type === 'admin' ? <ReservationsPage user={user} weatherData={weatherData} onNavigate={handleNavigate} /> : <Navigate to="/student" replace />} />
          <Route path="/dashboard/students" element={user.type === 'admin' ? <StudentsPage user={user} onNavigate={handleNavigate} /> : <Navigate to="/student" replace />} />
          <Route path="/dashboard/messages" element={user.type === 'admin' ? <MessagesPage user={user} onNavigate={handleNavigate} onSendNotification={handleSendNotification} /> : <Navigate to="/student" replace />} />
          <Route path="/dashboard/simulator" element={user.type === 'admin' ? <SimulatorPage user={user} onNavigate={handleNavigate} onSendNotification={handleSendNotification} onUpdateWeather={setWeatherData} /> : <Navigate to="/student" replace />} />

          {/* Student area */}
          <Route
            path="/student"
            element={
              user.type === 'student' ? (
                <StudentInterfaceModern 
                  user={user} 
                  weatherData={weatherData} 
                  notifications={notifications}
                  onLogout={handleLogout} 
                  aiService={aiService} 
                />
              ) : (<Navigate to="/dashboard" replace />)
            }
          />
          <Route path="/student/logbook" element={user.type === 'student' ? <LogbookPage user={user} /> : <Navigate to="/dashboard" replace />} />
          <Route path="/student/schedule" element={user.type === 'student' ? <SchedulePage user={user} weatherData={weatherData} /> : <Navigate to="/dashboard" replace />} />
          <Route path="/student/locations" element={user.type === 'student' ? <LocationsPage user={user} weatherData={weatherData} /> : <Navigate to="/dashboard" replace />} />
          <Route path="/student/support" element={user.type === 'student' ? <SupportPage user={user} aiService={aiService} /> : <Navigate to="/dashboard" replace />} />

          {/* AI chat */}
          <Route path="/chat" element={<AIChat user={user} weatherData={weatherData} aiService={aiService} onBack={() => window.history.back()} />} />

          {/* Default */}
          <Route path="/" element={<Navigate to={user.type === 'admin' ? '/dashboard' : '/student'} replace />} />
        </Routes>

        {/* Botão flutuante de IA */}
        <button
          onClick={() => window.location.href = '/chat'}
          className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center z-50 hover:scale-110"
          title="Suporte com IA"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </button>

        {showInstallPrompt && <InstallPrompt onClose={() => setShowInstallPrompt(false)} />}
      </div>
    </Router>
  )
}

export default App
