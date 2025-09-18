"""Service for handling Expo push notification tokens and sending messages."""

from typing import List
import requests


class NotificationService:
    """
    A simple in‑memory service to store Expo push tokens and send
    notifications to them.  In a production system you would likely
    persist tokens in a database.
    """

    def __init__(self) -> None:
        self.tokens: List[str] = []

    def register_token(self, token: str) -> None:
        """Store the Expo push token if it hasn't been registered yet."""
        if token and token not in self.tokens:
            self.tokens.append(token)

    def send_notification(self, title: str, message: str) -> None:
        """
        Send a notification to all registered tokens.

        Uses Expo's push API. If sending fails for a token, the error
        is logged but other tokens will continue to receive the message.
        """
        expo_url = "https://exp.host/--/api/v2/push/send"
        for token in self.tokens:
            try:
                requests.post(
                    expo_url,
                    json={
                        "to": token,
                        "title": title,
                        "body": message,
                    },
                    timeout=10,
                )
            except Exception as e:
                print(f"Erro ao enviar notificação para {token}: {e}")


notification_service = NotificationService()