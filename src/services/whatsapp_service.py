"""
Serviço de integração com STEVO para envio de mensagens WhatsApp
"""
import os
import requests
from typing import Dict, List, Optional
import json
from datetime import datetime

class WhatsAppService:
    def __init__(self):
        self.base_url = os.getenv('STEVO_BASE_URL', 'https://evo02.stevo.chat')
        self.instance = os.getenv('STEVO_INSTANCE', 'crm')
        self.api_key = os.getenv('STEVO_API_KEY')
        
        self.headers = {
            'Content-Type': 'application/json',
            'apikey': self.api_key
        }
    
    def send_message(self, phone: str, message: str, message_type: str = 'text') -> Dict:
        """
        Envia mensagem WhatsApp para um número específico
        """
        # Limpar e formatar número de telefone
        clean_phone = self._clean_phone_number(phone)
        
        if not clean_phone:
            return {
                'success': False,
                'error': 'Número de telefone inválido',
                'phone': phone
            }
        
        url = f"{self.base_url}/message/sendText/{self.instance}"
        
        payload = {
            'number': clean_phone,
            'text': message
        }
        
        try:
            response = requests.post(url, headers=self.headers, json=payload, timeout=10)
            
            if response.status_code == 200:
                result = response.json()
                return {
                    'success': True,
                    'message_id': result.get('key', {}).get('id'),
                    'phone': clean_phone,
                    'timestamp': datetime.utcnow().isoformat(),
                    'message': message
                }
            else:
                return {
                    'success': False,
                    'error': f'Erro HTTP {response.status_code}: {response.text}',
                    'phone': clean_phone
                }
                
        except Exception as e:
            print(f"Erro ao enviar WhatsApp: {e}")
            return {
                'success': False,
                'error': str(e),
                'phone': clean_phone,
                'mock_sent': True  # Para demonstração
            }
    
    def send_bulk_message(self, phones: List[str], message: str) -> Dict:
        """
        Envia mensagem para múltiplos números
        """
        results = {
            'total': len(phones),
            'sent': 0,
            'failed': 0,
            'details': []
        }
        
        for phone in phones:
            result = self.send_message(phone, message)
            
            if result['success']:
                results['sent'] += 1
            else:
                results['failed'] += 1
            
            results['details'].append(result)
        
        return results
    
    def send_weather_alert(self, phones: List[str], location: str, status: str, conditions: Dict) -> Dict:
        """
        Envia alerta meteorológico personalizado
        """
        status_messages = {
            'GREEN': f"🟢 Condições excelentes em {location}! Mergulho confirmado.",
            'YELLOW': f"🟡 Atenção: Condições moderadas em {location}. Mergulho com precauções.",
            'RED': f"🔴 Alerta: Condições perigosas em {location}. Mergulho cancelado por segurança."
        }
        
        base_message = status_messages.get(status, f"Atualização meteorológica para {location}")
        
        # Adicionar detalhes das condições
        details = []
        if conditions.get('wave_height'):
            details.append(f"Ondas: {conditions['wave_height']}m")
        if conditions.get('wind_speed'):
            details.append(f"Vento: {conditions['wind_speed']} kn")
        if conditions.get('precipitation'):
            details.append(f"Chuva: {conditions['precipitation']}%")
        
        full_message = f"{base_message}\n\n📊 Condições:\n" + "\n".join(details)
        full_message += f"\n\n🕐 Atualização: {datetime.now().strftime('%H:%M')}"
        full_message += "\n\nJUSTDIVE Academy 🌊"
        
        return self.send_bulk_message(phones, full_message)
    
    def send_class_confirmation(self, phone: str, student_name: str, course: str, 
                               location: str, date: str, time: str) -> Dict:
        """
        Envia confirmação de aula personalizada
        """
        message = f"""🌊 Olá {student_name}!

✅ A sua aula está confirmada:

📚 Curso: {course}
📍 Local: {location}
📅 Data: {date}
🕐 Hora: {time}

🎒 Não se esqueça do seu equipamento!
📱 Acompanhe as condições meteorológicas no app

Até breve nas águas! 🤿

JUSTDIVE Academy"""
        
        return self.send_message(phone, message)
    
    def send_class_cancellation(self, phone: str, student_name: str, course: str, 
                               location: str, date: str, reason: str = None) -> Dict:
        """
        Envia notificação de cancelamento de aula
        """
        reason_text = reason or "condições meteorológicas desfavoráveis"
        
        message = f"""⚠️ Olá {student_name},

Infelizmente precisamos cancelar a aula:

📚 Curso: {course}
📍 Local: {location}
📅 Data: {date}

🔄 Motivo: {reason_text}

📱 Reagendamento automático disponível no app
💬 Contacte-nos para mais informações

Obrigado pela compreensão! 🙏

JUSTDIVE Academy"""
        
        return self.send_message(phone, message)
    
    def send_document_reminder(self, phone: str, student_name: str, pending_docs: List[str]) -> Dict:
        """
        Envia lembrete de documentos pendentes
        """
        docs_list = "\n".join([f"• {doc}" for doc in pending_docs])
        
        message = f"""📋 Olá {student_name},

Temos documentos pendentes na sua conta:

{docs_list}

📱 Complete a documentação no app para garantir a sua participação nas aulas.

🔗 Link direto: justdive.pt/app

Obrigado! 📝

JUSTDIVE Academy"""
        
        return self.send_message(phone, message)
    
    def get_instance_status(self) -> Dict:
        """
        Verifica o status da instância WhatsApp
        """
        url = f"{self.base_url}/instance/connectionState/{self.instance}"
        
        try:
            response = requests.get(url, headers=self.headers, timeout=5)
            
            if response.status_code == 200:
                data = response.json()
                return {
                    'connected': data.get('instance', {}).get('state') == 'open',
                    'status': data.get('instance', {}).get('state', 'unknown'),
                    'timestamp': datetime.utcnow().isoformat()
                }
            else:
                return {
                    'connected': False,
                    'status': 'error',
                    'error': f'HTTP {response.status_code}',
                    'timestamp': datetime.utcnow().isoformat()
                }
                
        except Exception as e:
            return {
                'connected': False,
                'status': 'error',
                'error': str(e),
                'timestamp': datetime.utcnow().isoformat(),
                'mock_status': True  # Para demonstração
            }
    
    def _clean_phone_number(self, phone: str) -> Optional[str]:
        """
        Limpa e formata número de telefone para formato internacional
        """
        if not phone:
            return None
        
        # Remover caracteres não numéricos
        clean = ''.join(filter(str.isdigit, phone))
        
        # Adicionar código do país se necessário (Portugal: +351)
        if len(clean) == 9 and clean.startswith('9'):
            clean = '351' + clean
        elif len(clean) == 12 and clean.startswith('351'):
            pass  # Já tem código do país
        else:
            return None  # Formato inválido
        
        return clean
    
    def create_qr_code(self) -> Dict:
        """
        Gera QR code para conectar nova instância WhatsApp
        """
        url = f"{self.base_url}/instance/connect/{self.instance}"
        
        try:
            response = requests.get(url, headers=self.headers, timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                return {
                    'success': True,
                    'qr_code': data.get('base64'),
                    'timestamp': datetime.utcnow().isoformat()
                }
            else:
                return {
                    'success': False,
                    'error': f'HTTP {response.status_code}',
                    'timestamp': datetime.utcnow().isoformat()
                }
                
        except Exception as e:
            return {
                'success': False,
                'error': str(e),
                'timestamp': datetime.utcnow().isoformat()
            }

# Instância global do serviço WhatsApp
whatsapp_service = WhatsAppService()

