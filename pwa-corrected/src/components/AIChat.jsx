import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  ArrowLeft,
  Send,
  Bot,
  User,
  Loader2,
  Trash2,
  MessageSquare
} from 'lucide-react'

const AIChat = ({ user, weatherData, aiService, onBack }) => {
  const [messages, setMessages] = useState([])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    // Carregar histórico de conversas
    const history = aiService.getHistory()
    if (history.length > 0) {
      const formattedMessages = history.slice(-10).map(entry => ([
        { id: `${entry.id}-user`, type: 'user', content: entry.message, timestamp: new Date(entry.timestamp) },
        { id: `${entry.id}-ai`, type: 'ai', content: entry.response, timestamp: new Date(entry.timestamp) }
      ])).flat()
      setMessages(formattedMessages)
    } else {
      // Mensagem de boas-vindas
      setMessages([{
        id: 'welcome',
        type: 'ai',
        content: `Olá ${user.name}! Sou o assistente virtual da JUSTDIVE Academy. Posso ajudar com informações sobre mergulho, condições meteorológicas, equipamentos e muito mais. Em que posso ser útil?`,
        timestamp: new Date()
      }])
    }
  }, [aiService, user.name])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return

    const userMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)

    try {
      const response = await aiService.processMessage(inputMessage, weatherData)
      
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: response,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, aiMessage])
    } catch (error) {
      console.error('Erro ao processar mensagem:', error)
      
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: 'Desculpe, ocorreu um erro ao processar a sua mensagem. Por favor, tente novamente.',
        timestamp: new Date()
      }

      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const clearChat = () => {
    aiService.clearHistory()
    setMessages([{
      id: 'welcome-new',
      type: 'ai',
      content: `Conversa limpa! Como posso ajudar, ${user.name}?`,
      timestamp: new Date()
    }])
  }

  const suggestedQuestions = [
    'Como estão as condições para mergulho hoje?',
    'Que equipamento preciso para o curso Open Water?',
    'Quais são os melhores spots de mergulho em Portugal?',
    'Como posso melhorar a minha flutuabilidade?'
  ]

  return (
    <div className="min-h-screen p-4">
      <Card className="glass-effect border-white/20 h-[calc(100vh-2rem)] flex flex-col">
        {/* Header */}
        <CardHeader className="flex-shrink-0 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={onBack}
                className="text-white hover:bg-white/10"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-white text-lg">IA JUSTDIVE</CardTitle>
                  <p className="text-blue-200 text-sm">Assistente especializado em mergulho</p>
                </div>
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={clearChat}
              className="text-white hover:bg-white/10"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>

        {/* Messages */}
        <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex items-start space-x-2 max-w-[80%] ${
                message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
              }`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.type === 'user' ? 'bg-blue-600' : 'bg-purple-600'
                }`}>
                  {message.type === 'user' ? (
                    <User className="w-4 h-4 text-white" />
                  ) : (
                    <Bot className="w-4 h-4 text-white" />
                  )}
                </div>
                
                <div className={`p-3 rounded-lg ${
                  message.type === 'user' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white/10 text-white border border-white/20'
                }`}>
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString('pt-PT', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </p>
                </div>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex items-start space-x-2">
                <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-white/10 border border-white/20 p-3 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Loader2 className="w-4 h-4 text-white animate-spin" />
                    <span className="text-white text-sm">A pensar...</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </CardContent>

        {/* Suggested Questions */}
        {messages.length <= 1 && (
          <div className="px-4 pb-2">
            <p className="text-blue-200 text-sm mb-2">Perguntas sugeridas:</p>
            <div className="flex flex-wrap gap-2">
              {suggestedQuestions.map((question, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  size="sm"
                  onClick={() => setInputMessage(question)}
                  className="text-blue-200 hover:bg-white/10 border border-white/20 text-xs"
                >
                  {question}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="p-4 border-t border-white/10">
          <div className="flex space-x-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Digite sua pergunta sobre mergulho..."
              className="bg-white/10 border-white/20 text-white placeholder:text-blue-200 focus:border-white/40"
              disabled={isLoading}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default AIChat

