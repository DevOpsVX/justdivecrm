"""
Serviço de integração com Supabase para persistência de dados
"""
import os
import requests
from typing import Dict, List, Optional, Any
import json
from datetime import datetime, timedelta
from src.utils.encryption import encrypt_sensitive_data, decrypt_sensitive_data

class SupabaseService:
    def __init__(self):
        self.url = os.getenv('SUPABASE_URL')
        self.service_role_key = os.getenv('SUPABASE_SERVICE_ROLE_KEY')
        
        self.headers = {
            'apikey': self.service_role_key,
            'Authorization': f'Bearer {self.service_role_key}',
            'Content-Type': 'application/json',
            'Prefer': 'return=representation'
        }
        
        self.base_url = f"{self.url}/rest/v1"
    
    # === ESTUDANTES ===
    
    def create_student(self, student_data: Dict) -> Dict:
        """
        Cria novo estudante na base de dados
        """
        # Criptografar dados sensíveis
        encrypted_data = encrypt_sensitive_data(student_data)
        encrypted_data['created_at'] = datetime.utcnow().isoformat()
        encrypted_data['updated_at'] = datetime.utcnow().isoformat()
        
        try:
            response = requests.post(
                f"{self.base_url}/students",
                headers=self.headers,
                json=encrypted_data,
                timeout=10
            )
            
            if response.status_code in [200, 201]:
                result = response.json()
                if isinstance(result, list) and result:
                    return decrypt_sensitive_data(result[0])
                return decrypt_sensitive_data(result)
            else:
                return {
                    'error': f'Erro ao criar estudante: {response.status_code}',
                    'details': response.text
                }
                
        except Exception as e:
            print(f"Erro Supabase create_student: {e}")
            return {'error': str(e), 'mock_created': True}
    
    def get_student(self, student_id: int) -> Optional[Dict]:
        """
        Obtém dados de um estudante específico
        """
        try:
            response = requests.get(
                f"{self.base_url}/students?id=eq.{student_id}",
                headers=self.headers,
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                if data:
                    return decrypt_sensitive_data(data[0])
                return None
            else:
                print(f"Erro ao obter estudante: {response.status_code}")
                return None
                
        except Exception as e:
            print(f"Erro Supabase get_student: {e}")
            return None
    
    def get_all_students(self, filters: Dict = None) -> List[Dict]:
        """
        Obtém lista de todos os estudantes com filtros opcionais
        """
        try:
            url = f"{self.base_url}/students"
            params = []
            
            if filters:
                if filters.get('status'):
                    params.append(f"status=eq.{filters['status']}")
                if filters.get('certification_level'):
                    params.append(f"certification_level=eq.{filters['certification_level']}")
            
            if params:
                url += "?" + "&".join(params)
            
            response = requests.get(url, headers=self.headers, timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                return [decrypt_sensitive_data(student) for student in data]
            else:
                print(f"Erro ao obter estudantes: {response.status_code}")
                return []
                
        except Exception as e:
            print(f"Erro Supabase get_all_students: {e}")
            return []
    
    def update_student(self, student_id: int, update_data: Dict) -> Dict:
        """
        Atualiza dados de um estudante
        """
        encrypted_data = encrypt_sensitive_data(update_data)
        encrypted_data['updated_at'] = datetime.utcnow().isoformat()
        
        try:
            response = requests.patch(
                f"{self.base_url}/students?id=eq.{student_id}",
                headers=self.headers,
                json=encrypted_data,
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                if data:
                    return decrypt_sensitive_data(data[0])
                return {'success': True}
            else:
                return {
                    'error': f'Erro ao atualizar estudante: {response.status_code}',
                    'details': response.text
                }
                
        except Exception as e:
            print(f"Erro Supabase update_student: {e}")
            return {'error': str(e)}
    
    # === RESERVAS ===
    
    def create_reservation(self, reservation_data: Dict) -> Dict:
        """
        Cria nova reserva
        """
        reservation_data['created_at'] = datetime.utcnow().isoformat()
        reservation_data['updated_at'] = datetime.utcnow().isoformat()
        
        try:
            response = requests.post(
                f"{self.base_url}/reservations",
                headers=self.headers,
                json=reservation_data,
                timeout=10
            )
            
            if response.status_code in [200, 201]:
                result = response.json()
                if isinstance(result, list) and result:
                    return result[0]
                return result
            else:
                return {
                    'error': f'Erro ao criar reserva: {response.status_code}',
                    'details': response.text
                }
                
        except Exception as e:
            print(f"Erro Supabase create_reservation: {e}")
            return {'error': str(e), 'mock_created': True}
    
    def get_reservations(self, filters: Dict = None) -> List[Dict]:
        """
        Obtém reservas com filtros opcionais
        """
        try:
            url = f"{self.base_url}/reservations"
            params = []
            
            if filters:
                if filters.get('status'):
                    params.append(f"status=eq.{filters['status']}")
                if filters.get('date_from'):
                    params.append(f"date=gte.{filters['date_from']}")
                if filters.get('date_to'):
                    params.append(f"date=lte.{filters['date_to']}")
                if filters.get('student_id'):
                    params.append(f"student_id=eq.{filters['student_id']}")
            
            if params:
                url += "?" + "&".join(params)
            
            response = requests.get(url, headers=self.headers, timeout=10)
            
            if response.status_code == 200:
                return response.json()
            else:
                print(f"Erro ao obter reservas: {response.status_code}")
                return []
                
        except Exception as e:
            print(f"Erro Supabase get_reservations: {e}")
            return []
    
    def update_reservation_status(self, reservation_id: int, status: str, notes: str = None) -> Dict:
        """
        Atualiza status de uma reserva
        """
        update_data = {
            'status': status,
            'updated_at': datetime.utcnow().isoformat()
        }
        
        if notes:
            update_data['notes'] = notes
        
        try:
            response = requests.patch(
                f"{self.base_url}/reservations?id=eq.{reservation_id}",
                headers=self.headers,
                json=update_data,
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                if data:
                    return data[0]
                return {'success': True}
            else:
                return {
                    'error': f'Erro ao atualizar reserva: {response.status_code}',
                    'details': response.text
                }
                
        except Exception as e:
            print(f"Erro Supabase update_reservation_status: {e}")
            return {'error': str(e)}
    
    # === HISTÓRICO DE MENSAGENS ===
    
    def log_message(self, message_data: Dict) -> Dict:
        """
        Registra mensagem enviada no histórico
        """
        message_data['timestamp'] = datetime.utcnow().isoformat()
        
        try:
            response = requests.post(
                f"{self.base_url}/message_history",
                headers=self.headers,
                json=message_data,
                timeout=10
            )
            
            if response.status_code in [200, 201]:
                result = response.json()
                if isinstance(result, list) and result:
                    return result[0]
                return result
            else:
                return {
                    'error': f'Erro ao registar mensagem: {response.status_code}',
                    'details': response.text
                }
                
        except Exception as e:
            print(f"Erro Supabase log_message: {e}")
            return {'error': str(e)}
    
    def get_message_history(self, filters: Dict = None) -> List[Dict]:
        """
        Obtém histórico de mensagens
        """
        try:
            url = f"{self.base_url}/message_history"
            params = ["order=timestamp.desc"]
            
            if filters:
                if filters.get('channel'):
                    params.append(f"channel=eq.{filters['channel']}")
                if filters.get('status'):
                    params.append(f"status=eq.{filters['status']}")
                if filters.get('limit'):
                    params.append(f"limit={filters['limit']}")
            
            url += "?" + "&".join(params)
            
            response = requests.get(url, headers=self.headers, timeout=10)
            
            if response.status_code == 200:
                return response.json()
            else:
                print(f"Erro ao obter histórico: {response.status_code}")
                return []
                
        except Exception as e:
            print(f"Erro Supabase get_message_history: {e}")
            return []
    
    # === DADOS METEOROLÓGICOS ===
    
    def save_weather_data(self, weather_data: Dict) -> Dict:
        """
        Salva dados meteorológicos para histórico
        """
        weather_data['timestamp'] = datetime.utcnow().isoformat()
        
        try:
            response = requests.post(
                f"{self.base_url}/weather_history",
                headers=self.headers,
                json=weather_data,
                timeout=10
            )
            
            if response.status_code in [200, 201]:
                result = response.json()
                if isinstance(result, list) and result:
                    return result[0]
                return result
            else:
                return {
                    'error': f'Erro ao salvar dados meteorológicos: {response.status_code}',
                    'details': response.text
                }
                
        except Exception as e:
            print(f"Erro Supabase save_weather_data: {e}")
            return {'error': str(e)}
    
    def get_weather_history(self, location: str = None, hours: int = 24) -> List[Dict]:
        """
        Obtém histórico meteorológico
        """
        try:
            url = f"{self.base_url}/weather_history"
            params = ["order=timestamp.desc"]
            
            if location:
                params.append(f"location=eq.{location}")
            
            # Filtrar por tempo (últimas X horas)
            from_time = (datetime.utcnow() - timedelta(hours=hours)).isoformat()
            params.append(f"timestamp=gte.{from_time}")
            
            url += "?" + "&".join(params)
            
            response = requests.get(url, headers=self.headers, timeout=10)
            
            if response.status_code == 200:
                return response.json()
            else:
                print(f"Erro ao obter histórico meteorológico: {response.status_code}")
                return []
                
        except Exception as e:
            print(f"Erro Supabase get_weather_history: {e}")
            return []
    
    # === CONFIGURAÇÕES ===
    
    def get_settings(self) -> Dict:
        """
        Obtém configurações do sistema
        """
        try:
            response = requests.get(
                f"{self.base_url}/settings",
                headers=self.headers,
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                if data:
                    return data[0]
                return {}
            else:
                print(f"Erro ao obter configurações: {response.status_code}")
                return {}
                
        except Exception as e:
            print(f"Erro Supabase get_settings: {e}")
            return {}
    
    def update_settings(self, settings_data: Dict) -> Dict:
        """
        Atualiza configurações do sistema
        """
        settings_data['updated_at'] = datetime.utcnow().isoformat()
        
        try:
            response = requests.patch(
                f"{self.base_url}/settings?id=eq.1",
                headers=self.headers,
                json=settings_data,
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                if data:
                    return data[0]
                return {'success': True}
            else:
                return {
                    'error': f'Erro ao atualizar configurações: {response.status_code}',
                    'details': response.text
                }
                
        except Exception as e:
            print(f"Erro Supabase update_settings: {e}")
            return {'error': str(e)}

# Instância global do serviço Supabase
supabase_service = SupabaseService()

