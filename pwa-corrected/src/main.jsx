import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

if ('serviceWorker' in navigator && 'PushManager' in window) {
  navigator.serviceWorker
    .register('/service-worker.js')
    .then(async registration => {
      const permission = await Notification.requestPermission()
      if (permission === 'granted') {
        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: 'PUBLIC_VAPID_KEY',
        })
        try {
          await fetch('/api/notifications/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ subscription }),
          })
        } catch (error) {
          console.error('Erro ao registar subscription', error)
        }
      }
    })
    .catch(err => console.error('Service worker registration failed', err))
}
