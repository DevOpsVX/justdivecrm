"""Serviço para envio de notificações push via Expo"""
from typing import List
import requests

class NotificationService:
    def __init__(self) -> None:
        self.tokens: List[str] = []

    def register_token(self, token: str) -> None:
        if token and token not in self.tokens:
            self.tokens.append(token)

    def send_notification(self, title: str, message: str) -> None:
        expo_url = "https://exp.host/--/api/v2/push/send"
        for token in self.tokens:
            try:
                requests.post(expo_url, json={
                    "to": token,
                    "title": title,
                    "body": message,
                })
            except Exception as e:
                print(f"Erro ao enviar notificação para {token}: {e}")

notification_service = NotificationService()
