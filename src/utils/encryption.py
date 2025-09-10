"""
Utilitário de criptografia para proteger dados sensíveis
"""
import os
import base64
from cryptography.fernet import Fernet
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
import json

class CryptoManager:
    def __init__(self):
        self.encryption_key = os.getenv('ENCRYPTION_KEY', 'justdive-encryption-key-32-chars-long')
        self._fernet = None
    
    def _get_fernet(self):
        """Inicializa o objeto Fernet para criptografia"""
        if self._fernet is None:
            # Gerar chave a partir da string de configuração
            kdf = PBKDF2HMAC(
                algorithm=hashes.SHA256(),
                length=32,
                salt=b'justdive_salt',
                iterations=100000,
            )
            key = base64.urlsafe_b64encode(kdf.derive(self.encryption_key.encode()))
            self._fernet = Fernet(key)
        return self._fernet
    
    def encrypt_string(self, plaintext: str) -> str:
        """Criptografa uma string"""
        if not plaintext:
            return plaintext
        
        fernet = self._get_fernet()
        encrypted_bytes = fernet.encrypt(plaintext.encode())
        return base64.urlsafe_b64encode(encrypted_bytes).decode()
    
    def decrypt_string(self, encrypted_text: str) -> str:
        """Descriptografa uma string"""
        if not encrypted_text:
            return encrypted_text
        
        try:
            fernet = self._get_fernet()
            encrypted_bytes = base64.urlsafe_b64decode(encrypted_text.encode())
            decrypted_bytes = fernet.decrypt(encrypted_bytes)
            return decrypted_bytes.decode()
        except Exception as e:
            print(f"Erro ao descriptografar: {e}")
            return encrypted_text
    
    def encrypt_dict(self, data: dict, sensitive_fields: list = None) -> dict:
        """Criptografa campos sensíveis de um dicionário"""
        if not data or not sensitive_fields:
            return data
        
        encrypted_data = data.copy()
        for field in sensitive_fields:
            if field in encrypted_data and encrypted_data[field]:
                encrypted_data[field] = self.encrypt_string(str(encrypted_data[field]))
        
        return encrypted_data
    
    def decrypt_dict(self, data: dict, sensitive_fields: list = None) -> dict:
        """Descriptografa campos sensíveis de um dicionário"""
        if not data or not sensitive_fields:
            return data
        
        decrypted_data = data.copy()
        for field in sensitive_fields:
            if field in decrypted_data and decrypted_data[field]:
                decrypted_data[field] = self.decrypt_string(decrypted_data[field])
        
        return decrypted_data
    
    def encrypt_api_key(self, api_key: str) -> str:
        """Criptografa uma chave de API"""
        return self.encrypt_string(api_key)
    
    def decrypt_api_key(self, encrypted_key: str) -> str:
        """Descriptografa uma chave de API"""
        return self.decrypt_string(encrypted_key)

# Instância global do gerenciador de criptografia
crypto_manager = CryptoManager()

# Campos sensíveis que devem ser criptografados
SENSITIVE_FIELDS = [
    'phone',
    'emergency_contact',
    'medical_notes',
    'api_key',
    'token',
    'password_hash'
]

def encrypt_sensitive_data(data: dict) -> dict:
    """Função auxiliar para criptografar dados sensíveis"""
    return crypto_manager.encrypt_dict(data, SENSITIVE_FIELDS)

def decrypt_sensitive_data(data: dict) -> dict:
    """Função auxiliar para descriptografar dados sensíveis"""
    return crypto_manager.decrypt_dict(data, SENSITIVE_FIELDS)

