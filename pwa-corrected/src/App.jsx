import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './components/Login'
import Dashboard from './components/Dashboard'
import StudentInterface from './components/StudentInterface'
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
    const savedUser = localStorage.getItem('justdive_user')
    if (savedUser) setUser(JSON.parse(savedUser))

    if ('serviceWorker' in navigator && !window.matchMedia('(display-mode: standalone)').matches) {
      setShowInstallPrompt(true)
    }

    const weatherInterval = setInterval(() => {
      setWeatherData(prev => ({
        ...prev,
        temperature: Math.round(18 + Math.random() * 8),
        waveHeight: Math.round((0.5 + Math.random() * 2) * 10) / 10,
        windSpeed: Math.round(5 + Math.random() * 25),
        visibility: Math.round(5 + Math.random() * 10),
        status: Math.random() > 0.8 ? 'yellow' : Math.random() > 0.95 ? 'red' : 'green'
      }))
    }, 30000)

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
        {showInstallPrompt && <InstallPrompt onClose={() => setShowInstallPrompt(false)} />}
      </div>
    )
  }

  return (
    <Router>
      <div className="min-h-screen justdive-gradient">
        <Routes>
          <Route
            path="/dashboard"
            element={
              user.type === 'admin' ? (
                <Dashboard user={user} weatherData={weatherData} onLogout={handleLogout} aiService={aiService} />
              ) : (<Navigate to="/student" replace />)
            }
          />

          {/* Admin pages under /dashboard */}
          <Route path="/dashboard/operations" element={user.type === 'admin' ? <WeatherOperations /> : <Navigate to="/student" replace />} />
          <Route path="/dashboard/reservations" element={user.type === 'admin' ? <ReservationsPage /> : <Navigate to="/student" replace />} />
          <Route path="/dashboard/students" element={user.type === 'admin' ? <StudentsPage /> : <Navigate to="/student" replace />} />
          <Route path="/dashboard/messages" element={user.type === 'admin' ? <MessagesPage /> : <Navigate to="/student" replace />} />
          <Route path="/dashboard/simulator" element={user.type === 'admin' ? <SimulatorPage /> : <Navigate to="/student" replace />} />

          {/* Student area */}
          <Route
            path="/student"
            element={
              user.type === 'student' ? (
                <StudentInterface user={user} weatherData={weatherData} onLogout={handleLogout} aiService={aiService} />
              ) : (<Navigate to="/dashboard" replace />)
            }
          />
          <Route path="/student/logbook" element={user.type === 'student' ? <LogbookPage /> : <Navigate to="/dashboard" replace />} />
          <Route path="/student/schedule" element={user.type === 'student' ? <SchedulePage /> : <Navigate to="/dashboard" replace />} />
          <Route path="/student/locations" element={user.type === 'student' ? <LocationsPage /> : <Navigate to="/dashboard" replace />} />
          <Route path="/student/support" element={user.type === 'student' ? <SupportPage /> : <Navigate to="/dashboard" replace />} />

          {/* AI chat */}
          <Route path="/chat" element={<AIChat user={user} weatherData={weatherData} aiService={aiService} onBack={() => window.history.back()} />} />

          {/* Default */}
          <Route path="/" element={<Navigate to={user.type === 'admin' ? '/dashboard' : '/student'} replace />} />
        </Routes>

        {showInstallPrompt && <InstallPrompt onClose={() => setShowInstallPrompt(false)} />}
      </div>
    </Router>
  )
}

export default App
