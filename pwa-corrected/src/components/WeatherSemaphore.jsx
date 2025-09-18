import { useState, useEffect } from 'react'
import { Badge } from '@/components/ui/badge'

const WeatherSemaphore = ({ status, size = 'md', showText = true, className = '' }) => {
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    setIsAnimating(true)
    const timer = setTimeout(() => setIsAnimating(false), 1000)
    return () => clearTimeout(timer)
  }, [status])

  const getSemaphoreConfig = (status) => {
    switch (status?.toUpperCase()) {
      case 'GREEN':
        return {
          lights: [
            { color: 'bg-green-400', active: true, shadow: 'shadow-green-400/50' },
            { color: 'bg-gray-600', active: false, shadow: '' },
            { color: 'bg-gray-600', active: false, shadow: '' }
          ],
          text: 'Aulas confirmadas',
          textColor: 'text-green-300',
          bgColor: 'bg-green-500/20',
          borderColor: 'border-green-500/30',
          description: 'Condições ideais para mergulho'
        }
      case 'YELLOW':
        return {
          lights: [
            { color: 'bg-gray-600', active: false, shadow: '' },
            { color: 'bg-yellow-400', active: true, shadow: 'shadow-yellow-400/50' },
            { color: 'bg-gray-600', active: false, shadow: '' }
          ],
          text: 'Atenção ao clima',
          textColor: 'text-yellow-300',
          bgColor: 'bg-yellow-500/20',
          borderColor: 'border-yellow-500/30',
          description: 'Condições moderadas - atenção redobrada'
        }
      case 'RED':
        return {
          lights: [
            { color: 'bg-gray-600', active: false, shadow: '' },
            { color: 'bg-gray-600', active: false, shadow: '' },
            { color: 'bg-red-400', active: true, shadow: 'shadow-red-400/50' }
          ],
          text: 'Aulas canceladas',
          textColor: 'text-red-300',
          bgColor: 'bg-red-500/20',
          borderColor: 'border-red-500/30',
          description: 'Condições perigosas - mergulho não recomendado'
        }
      default:
        return {
          lights: [
            { color: 'bg-gray-600', active: false, shadow: '' },
            { color: 'bg-gray-600', active: false, shadow: '' },
            { color: 'bg-gray-600', active: false, shadow: '' }
          ],
          text: 'Status desconhecido',
          textColor: 'text-gray-300',
          bgColor: 'bg-gray-500/20',
          borderColor: 'border-gray-500/30',
          description: 'Aguardando dados meteorológicos'
        }
    }
  }

  const getSizeClasses = (size) => {
    switch (size) {
      case 'sm':
        return {
          container: 'w-6 h-16',
          light: 'w-4 h-4',
          spacing: 'space-y-1',
          text: 'text-xs',
          badge: 'text-xs px-2 py-1'
        }
      case 'lg':
        return {
          container: 'w-12 h-32',
          light: 'w-8 h-8',
          spacing: 'space-y-2',
          text: 'text-base',
          badge: 'text-sm px-3 py-2'
        }
      default: // md
        return {
          container: 'w-8 h-24',
          light: 'w-6 h-6',
          spacing: 'space-y-1.5',
          text: 'text-sm',
          badge: 'text-sm px-3 py-1'
        }
    }
  }

  const config = getSemaphoreConfig(status)
  const sizeClasses = getSizeClasses(size)

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      {/* Semáforo */}
      <div className="relative">
        <div className={`
          ${sizeClasses.container} 
          bg-slate-800/80 
          rounded-lg 
          border-2 
          border-slate-600/50 
          backdrop-blur-sm 
          flex 
          flex-col 
          items-center 
          justify-center 
          ${sizeClasses.spacing}
          p-2
          ${isAnimating ? 'animate-pulse' : ''}
        `}>
          {config.lights.map((light, index) => (
            <div
              key={index}
              className={`
                ${sizeClasses.light}
                ${light.color}
                rounded-full
                transition-all
                duration-500
                ${light.active 
                  ? `${light.shadow} shadow-lg opacity-100 scale-110` 
                  : 'opacity-30 scale-90'
                }
                ${light.active && isAnimating ? 'animate-ping' : ''}
              `}
              style={{
                boxShadow: light.active 
                  ? `0 0 20px ${light.color.includes('green') ? '#4ade80' : light.color.includes('yellow') ? '#facc15' : '#f87171'}40`
                  : 'none'
              }}
            />
          ))}
        </div>
        
        {/* Efeito de brilho */}
        {config.lights.some(light => light.active) && (
          <div className={`
            absolute 
            inset-0 
            ${sizeClasses.container}
            rounded-lg 
            ${config.bgColor}
            ${config.borderColor}
            border
            opacity-60
            animate-pulse
            pointer-events-none
          `} />
        )}
      </div>

      {/* Texto e informações */}
      {showText && (
        <div className="flex-1 space-y-2">
          <Badge 
            className={`
              ${config.bgColor} 
              ${config.borderColor} 
              ${config.textColor}
              border
              backdrop-blur-sm
              ${sizeClasses.badge}
              font-medium
            `}
          >
            <div className="flex items-center space-x-2">
              <div className="flex space-x-1">
                {config.lights.map((light, index) => (
                  <div
                    key={index}
                    className={`
                      w-2 h-2 
                      rounded-full 
                      ${light.active ? light.color : 'bg-gray-500'}
                      ${light.active ? 'opacity-100' : 'opacity-40'}
                    `}
                  />
                ))}
              </div>
              <span>{config.text}</span>
            </div>
          </Badge>
          
          {size !== 'sm' && (
            <p className={`${sizeClasses.text} text-slate-400 leading-tight`}>
              {config.description}
            </p>
          )}
        </div>
      )}
    </div>
  )
}

export default WeatherSemaphore

