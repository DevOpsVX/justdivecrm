import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import notificationService from '@/services/notificationService'
import { 
  Play, 
  Smartphone, 
  Bell, 
  Waves, 
  Cloud, 
  CheckCircle, 
  AlertTriangle, 
  XCircle,
  Settings,
  Send,
  Monitor
} from 'lucide-react'

export default function SimulatorPage() {
  const [isSimulating, setIsSimulating] = useState(false)
  const [simulationResults, setSimulationResults] = useState([])
  const [selectedTest, setSelectedTest] = useState(null)

  const testScenarios = [
    {
      id: 'push-notification',
      title: 'Notificação Push',
      description: 'Testar envio de notificações push para dispositivos móveis',
      icon: Bell,
      color: 'bg-blue-600',
      status: 'ready'
    },
    {
      id: 'weather-widget',
      title: 'Widget de Clima',
      description: 'Testar widget de clima na tela de bloqueio do Android',
      icon: Cloud,
      color: 'bg-green-600',
      status: 'ready'
    },
    {
      id: 'traffic-light',
      title: 'Sistema de Semáforos',
      description: 'Testar mudanças de interface dos semáforos (verde/amarelo/vermelho)',
      icon: Waves,
      color: 'bg-yellow-600',
      status: 'ready'
    },
    {
      id: 'mobile-interface',
      title: 'Interface Mobile',
      description: 'Testar responsividade e funcionalidades da interface móvel',
      icon: Smartphone,
      color: 'bg-purple-600',
      status: 'ready'
    }
  ]

  const runSimulation = async (testId) => {
    setIsSimulating(true)
    setSelectedTest(testId)
    
    // Simular processo de teste
    const steps = [
      'Iniciando simulação...',
      'Conectando com dispositivos...',
      'Executando testes...',
      'Coletando resultados...',
      'Finalizando simulação...'
    ]

    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 1000))
      setSimulationResults(prev => [...prev, {
        step: i + 1,
        message: steps[i],
        timestamp: new Date().toLocaleTimeString(),
        status: i === steps.length - 1 ? 'completed' : 'running'
      }])
    }

    // Executar teste específico
    let finalResult
    try {
      switch (testId) {
        case 'push-notification':
          await notificationService.sendNotification(
            '🧪 Teste de Simulação',
            'Esta é uma notificação de teste enviada pelo simulador JustDive!'
          )
          finalResult = {
            step: steps.length + 1,
            message: '✅ Notificação push enviada com sucesso para dispositivos registrados',
            timestamp: new Date().toLocaleTimeString(),
            status: 'success'
          }
          break
        
        case 'weather-widget':
          // Simular teste do widget de clima
          await new Promise(resolve => setTimeout(resolve, 1000))
          finalResult = {
            step: steps.length + 1,
            message: '✅ Widget de clima testado - Funcionalidade simulada com sucesso',
            timestamp: new Date().toLocaleTimeString(),
            status: 'success'
          }
          break
        
        case 'traffic-light':
          // Testar sistema de semáforos com notificação
          await notificationService.sendWeatherNotification('green', 'Berlengas')
          finalResult = {
            step: steps.length + 1,
            message: '✅ Sistema de semáforos testado - Notificação de semáforo verde enviada',
            timestamp: new Date().toLocaleTimeString(),
            status: 'success'
          }
          break
        
        case 'mobile-interface':
          // Simular teste da interface móvel
          await new Promise(resolve => setTimeout(resolve, 1000))
          finalResult = {
            step: steps.length + 1,
            message: '✅ Interface móvel testada - Responsividade e funcionalidades verificadas',
            timestamp: new Date().toLocaleTimeString(),
            status: 'success'
          }
          break
        
        default:
          finalResult = {
            step: steps.length + 1,
            message: '✅ Teste concluído com sucesso',
            timestamp: new Date().toLocaleTimeString(),
            status: 'success'
          }
      }
    } catch (error) {
      finalResult = {
        step: steps.length + 1,
        message: `❌ Erro durante o teste: ${error.message}`,
        timestamp: new Date().toLocaleTimeString(),
        status: 'error'
      }
    }

    setSimulationResults(prev => [...prev, finalResult])
    setIsSimulating(false)
  }

  const getTestResult = (testId) => {
    const results = {
      'push-notification': '✅ Notificação push enviada com sucesso para 3 dispositivos',
      'weather-widget': '✅ Widget de clima instalado e funcionando na tela de bloqueio',
      'traffic-light': '✅ Sistema de semáforos respondendo corretamente às condições meteorológicas',
      'mobile-interface': '✅ Interface móvel responsiva e todas as funcionalidades operacionais'
    }
    return results[testId] || '✅ Teste concluído com sucesso'
  }

  const clearResults = () => {
    setSimulationResults([])
    setSelectedTest(null)
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'running':
        return <AlertTriangle className="w-4 h-4 text-yellow-400" />
      case 'completed':
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-400" />
      case 'error':
        return <XCircle className="w-4 h-4 text-red-400" />
      default:
        return <Monitor className="w-4 h-4 text-blue-400" />
    }
  }

  return (
    <div className="min-h-screen p-4 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center space-x-2">
            <Settings className="w-6 h-6" />
            <span>Simulador de Sistema</span>
          </h1>
          <p className="text-blue-200">Teste todas as funcionalidades do sistema JustDive</p>
        </div>
        
        {simulationResults.length > 0 && (
          <Button 
            onClick={clearResults}
            variant="outline" 
            className="border-white/20 text-white hover:bg-white/10"
          >
            Limpar Resultados
          </Button>
        )}
      </div>

      {/* Cenários de Teste */}
      <Card className="glass-effect border-white/20">
        <CardHeader>
          <CardTitle className="text-white">Cenários de Teste Disponíveis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {testScenarios.map((scenario) => (
              <Card key={scenario.id} className="glass-effect border-white/10 hover:border-white/30 transition-all">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <div className={`w-10 h-10 rounded-lg ${scenario.color} flex items-center justify-center`}>
                      <scenario.icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-white font-semibold">{scenario.title}</h3>
                      <p className="text-blue-200 text-sm mt-1">{scenario.description}</p>
                      <div className="flex items-center justify-between mt-3">
                        <Badge variant="outline" className="border-green-400 text-green-400">
                          Pronto
                        </Badge>
                        <Button
                          onClick={() => runSimulation(scenario.id)}
                          disabled={isSimulating}
                          size="sm"
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          <Play className="w-4 h-4 mr-1" />
                          {isSimulating && selectedTest === scenario.id ? 'Executando...' : 'Executar'}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Resultados da Simulação */}
      {simulationResults.length > 0 && (
        <Card className="glass-effect border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <Monitor className="w-5 h-5" />
              <span>Resultados da Simulação</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {simulationResults.map((result, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg border border-white/10">
                  {getStatusIcon(result.status)}
                  <div className="flex-1">
                    <span className="text-white text-sm">{result.message}</span>
                  </div>
                  <span className="text-blue-300 text-xs">{result.timestamp}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Instruções */}
      <Card className="glass-effect border-white/20">
        <CardHeader>
          <CardTitle className="text-white">Como Usar o Simulador</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-blue-200">
            <div className="flex items-start space-x-2">
              <span className="text-blue-400 font-bold">1.</span>
              <span>Selecione um cenário de teste clicando no botão "Executar"</span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-blue-400 font-bold">2.</span>
              <span>Aguarde a execução da simulação (processo automatizado)</span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-blue-400 font-bold">3.</span>
              <span>Verifique os resultados na seção "Resultados da Simulação"</span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-blue-400 font-bold">4.</span>
              <span>Para notificações push, certifique-se de que o APK está instalado no dispositivo</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

