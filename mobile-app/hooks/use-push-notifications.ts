import { useEffect, useState } from 'react';
import * as Notifications from 'expo-notifications';

export function usePushNotifications() {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    async function register() {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        return;
      }
      const pushToken = (await Notifications.getExpoPushTokenAsync()).data;
      setToken(pushToken);
      try {
        await fetch('/api/notifications/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: pushToken })
        });
      } catch (e) {
        console.log('Erro ao registar token de notificação', e);
      }
    }

    register();
  }, []);

  return token;
}
