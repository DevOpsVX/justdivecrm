// Serviço de IA para aplicação web JUSTDIVE
class AIService {
  constructor() {
    const envBaseURL = import.meta.env?.VITE_API_URL;
    const browserBaseURL = typeof window !== 'undefined' && window.location
      ? window.location.origin
      : null;

    this.baseURL = envBaseURL || browserBaseURL || 'http://localhost:5000';
    this.conversationHistory = this.loadConversationHistory();
  }

  // Carregar histórico do localStorage
  loadConversationHistory() {
    try {
      const history = localStorage.getItem('justdive_chat_history');
      return history ? JSON.parse(history) : [];
    } catch (error) {
      console.error('Erro ao carregar histórico:', error);
      return [];
    }
  }

  // Salvar histórico no localStorage
  saveConversationHistory() {
    try {
      localStorage.setItem('justdive_chat_history', JSON.stringify(this.conversationHistory));
    } catch (error) {
      console.error('Erro ao salvar histórico:', error);
    }
  }


  // Processar mensagem com IA
  async processMessage(message, weatherContext = null) {
    try {
      const userMessage = typeof message === 'string'
        ? message
        : JSON.stringify(message);

      const conversation = [
        { role: 'system', content: 'Você é o assistente virtual da JUSTDIVE Academy.' },
        { role: 'user', content: userMessage }
      ];

      const payload = {
        message: userMessage,
        messages: conversation
      };

      const response = await fetch(`${this.baseURL}/api/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`Erro da API: ${response.status}`);
      }

      const data = await response.json();
      const aiResponse = data.response || 'Desculpe, não consegui processar a sua mensagem.';

      this.addToHistory(userMessage, aiResponse, weatherContext);

      return aiResponse;
    } catch (error) {
      console.error('Erro ao processar mensagem:', error);

      const fallbackResponse = 'Desculpe, estou com dificuldades técnicas no momento. Por favor, tente novamente em alguns instantes.';
      const storedMessage = typeof message === 'string' ? message : JSON.stringify(message);
      this.addToHistory(storedMessage, fallbackResponse, { error: error.message });

      return fallbackResponse;
    }
  }
  // Gerar resposta de demonstração
  generateDemoResponse(message, weatherContext) {
    const lowerMessage = message.toLowerCase();
    
    // Respostas específicas sobre condições meteorológicas
    if (lowerMessage.includes('clima') || lowerMessage.includes('tempo') || lowerMessage.includes('condições') || lowerMessage.includes('mergulho hoje')) {
      if (weatherContext) {
        const statusText = weatherContext.status === 'green' ? 'excelentes' : 
                          weatherContext.status === 'yellow' ? 'moderadas' : 'perigosas';
        
        let recommendation = '';
        if (weatherContext.status === 'green') {
          recommendation = 'Perfeito para mergulhar! Condições ideais para todos os níveis de mergulho.';
        } else if (weatherContext.status === 'yellow') {
          recommendation = 'Condições aceitáveis, mas recomendo cuidado extra. Ideal para mergulhadores experientes.';
        } else {
          recommendation = 'Não recomendo mergulho nestas condições por questões de segurança.';
        }
        
        return `🌊 **Análise das Condições Atuais:**

📊 **Dados Meteorológicos:**
• Temperatura da água: ${weatherContext.temperature}°C
• Altura das ondas: ${weatherContext.waveHeight}m
• Velocidade do vento: ${weatherContext.windSpeed} km/h
• Visibilidade: ${weatherContext.visibility} km

🚦 **Status:** ${statusText.toUpperCase()}

💡 **Recomendação:** ${recommendation}

${weatherContext.hasClasses ? `📅 **Aulas Hoje:** ${weatherContext.nextClass || 'Consulte o cronograma'}` : '📅 **Aulas:** Nenhuma aula programada para hoje'}`;
      }
      return '🌊 Para fornecer uma análise precisa das condições de mergulho, preciso dos dados meteorológicos atuais. Verifique o widget meteorológico no dashboard para informações em tempo real.';
    }
    
    // Respostas sobre cursos e aulas
    if (lowerMessage.includes('aula') || lowerMessage.includes('curso') || lowerMessage.includes('open water') || lowerMessage.includes('certificação')) {
      return `🎓 **Cursos JUSTDIVE Academy:**

📚 **Cursos Disponíveis:**
• **Open Water Diver** - Certificação básica PADI
• **Advanced Open Water** - Mergulhos de especialidade
• **Rescue Diver** - Técnicas de salvamento
• **Divemaster** - Nível profissional

⏰ **Horários:** Consulte nossa agenda ou contacte-nos
📍 **Locais:** Sesimbra, Berlengas, Arrábida

Que nível de certificação tem atualmente?`;
    }
    
    // Respostas sobre equipamentos
    if (lowerMessage.includes('equipamento') || lowerMessage.includes('material') || lowerMessage.includes('gear')) {
      return `🤿 **Equipamento de Mergulho:**

🎯 **Equipamento Básico:**
• Máscara e tubo de respiração
• Barbatanas e botins
• Fato de mergulho (3mm ou 5mm)

🔧 **Equipamento Técnico:**
• Colete equilibrador (BCD)
• Regulador com manómetro
• Computador de mergulho
• Lanterna subaquática

💰 **Serviços:**
• Aluguer de equipamento completo
• Manutenção e revisões
• Venda de equipamento novo e usado

Precisa de algum equipamento específico?`;
    }
    
    // Respostas sobre segurança
    if (lowerMessage.includes('segurança') || lowerMessage.includes('protocolo') || lowerMessage.includes('emergência')) {
      return `🛡️ **Protocolos de Segurança JUSTDIVE:**

✅ **Antes do Mergulho:**
• Verificação completa do equipamento
• Briefing detalhado do local
• Análise das condições meteorológicas
• Planeamento do mergulho

🤝 **Durante o Mergulho:**
• Sistema de duplas obrigatório
• Comunicação por sinais
• Monitorização constante do ar
• Respeito pelos limites de profundidade

🚨 **Procedimentos de Emergência:**
• Oxigénio de emergência disponível
• Contacto direto com serviços de emergência
• Instrutores certificados em primeiros socorros

A sua segurança é a nossa prioridade máxima!`;
    }
    
    // Respostas sobre locais de mergulho
    if (lowerMessage.includes('local') || lowerMessage.includes('spot') || lowerMessage.includes('onde') || lowerMessage.includes('portugal')) {
      return `🗺️ **Melhores Spots de Mergulho em Portugal:**

🏝️ **Berlengas (Peniche):**
• Reserva natural com vida marinha rica
• Visibilidade até 20m
• Ideal para todos os níveis

🏖️ **Sesimbra:**
• Grutas e formações rochosas
• Polvos, linguados e sargos
• Mergulhos de parede espetaculares

🌊 **Portinho da Arrábida:**
• Águas cristalinas e protegidas
• Cavalos-marinhos e nudibranquios
• Perfeito para fotografia subaquática

🐟 **Peniche:**
• Naufrágios históricos
• Correntes ricas em nutrientes
• Avistamentos de vida pelágica

Qual destes locais gostaria de explorar?`;
    }
    
    // Respostas sobre flutuabilidade
    if (lowerMessage.includes('flutuabilidade') || lowerMessage.includes('flutuar') || lowerMessage.includes('controlo')) {
      return `⚖️ **Melhorar a Flutuabilidade:**

🎯 **Técnicas Fundamentais:**
• Respiração controlada e profunda
• Ajustes graduais do BCD
• Posição corporal hidrodinâmica
• Distribuição correta do peso

💡 **Dicas Práticas:**
• Pratique em águas pouco profundas
• Use o mínimo de peso necessário
• Mantenha-se relaxado e calmo
• Faça o curso Peak Performance Buoyancy

🏊 **Exercícios Recomendados:**
• Hovering (pairar) sem movimento
• Subir e descer apenas com respiração
• Nadar sem usar as mãos

A flutuabilidade perfeita vem com prática e paciência!`;
    }
    
    // Resposta de boas-vindas padrão
    if (lowerMessage.includes('olá') || lowerMessage.includes('oi') || lowerMessage.includes('bom dia') || lowerMessage.includes('boa tarde')) {
      return `👋 **Bem-vindo à JUSTDIVE Academy!**

Sou o seu assistente virtual especializado em mergulho. Posso ajudar com:

🎓 **Cursos e Certificações**
🌊 **Condições Meteorológicas**
🤿 **Equipamentos de Mergulho**
🗺️ **Locais de Mergulho**
🛡️ **Segurança e Protocolos**

Como posso ajudá-lo hoje?`;
    }
    
    // Resposta genérica mais estruturada
    return `🤿 **Assistente JUSTDIVE Academy**

Não tenho certeza sobre a sua pergunta específica, mas posso ajudar com:

📚 **Informações sobre cursos PADI**
🌊 **Análise de condições meteorológicas**
🎯 **Recomendações de equipamento**
🗺️ **Spots de mergulho em Portugal**
🛡️ **Protocolos de segurança**

Pode reformular a sua pergunta ou escolher um dos tópicos acima?`;
  }

  // Adicionar ao histórico
  addToHistory(message, response, context) {
    const entry = {
      id: Date.now().toString(),
      message,
      response,
      context,
      timestamp: new Date().toISOString()
    };
    
    this.conversationHistory.push(entry);
    
    // Manter apenas as últimas 50 mensagens
    if (this.conversationHistory.length > 50) {
      this.conversationHistory = this.conversationHistory.slice(-50);
    }
    
    this.saveConversationHistory();
  }

  // Obter recomendações baseadas no clima
  async getWeatherRecommendations(weatherContext) {
    const message = `Com base nas condições meteorológicas atuais, que recomendações tens para os mergulhos de hoje?`;
    return await this.processMessage(message, weatherContext);
  }

  // Verificar se há aulas programadas
  async checkClassSchedule(weatherContext) {
    const message = `Há aulas de mergulho programadas para hoje? Como estão as condições?`;
    return await this.processMessage(message, weatherContext);
  }

  // Limpar histórico
  clearHistory() {
    this.conversationHistory = [];
    localStorage.removeItem('justdive_chat_history');
  }

  // Obter estatísticas de uso
  getUsageStats() {
    return {
      totalMessages: this.conversationHistory.length,
      lastActivity: this.conversationHistory.length > 0 ? 
        this.conversationHistory[this.conversationHistory.length - 1].timestamp : null
    };
  }

  // Obter histórico completo
  getHistory() {
    return this.conversationHistory;
  }
}

export default AIService;

