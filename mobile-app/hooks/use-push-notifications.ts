import { useEffect, useState } from 'react';
import * as Notifications from 'expo-notifications';

import { getApiBase } from '@/utils/config';

export function usePushNotifications() {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    async function register() {
      try {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }
        if (finalStatus !== 'granted') {
          console.warn('[PushNotifications] Notification permissions not granted.');
          return;
        }
        const pushToken = (await Notifications.getExpoPushTokenAsync()).data;
        console.log(`[PushNotifications] Obtained Expo push token: ${pushToken}`);
        setToken(pushToken);

        const apiBase = getApiBase();
        const registerUrl = `${apiBase}/api/notifications/register`;
        const maxAttempts = 3;

        for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
          try {
            console.log(
              `[PushNotifications] Registering push token (attempt ${attempt}/${maxAttempts}) at ${registerUrl}`
            );

            const response = await fetch(registerUrl, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ token: pushToken })
            });

            if (!response.ok) {
              const message = await response.text().catch(() => '');
              const details = message ? ` - ${message}` : '';
              throw new Error(
                `Unexpected response when registering push token: ${response.status} ${response.statusText}${details}`
              );
            }

            console.log('[PushNotifications] Push token registered successfully.');
            break;
          } catch (e) {
            console.error('[PushNotifications] Failed to register push token', e);

            if (attempt === maxAttempts) {
              console.error('[PushNotifications] Giving up after maximum retries.');
              break;
            }

            const delay = attempt * 1000;
            console.log(`[PushNotifications] Retrying in ${delay}ms...`);
            await new Promise((resolve) => setTimeout(resolve, delay));
          }
        }
      } catch (error) {
        console.error('[PushNotifications] Unexpected error while registering for notifications', error);
      }
    }

    register();
  }, []);

  return token;
}
