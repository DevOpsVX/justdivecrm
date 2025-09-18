import { useEffect, useState } from 'react';
import * as Notifications from 'expo-notifications';

import { getApiBase } from '@/utils/config';

const MAX_REGISTRATION_ATTEMPTS = 3;
const RETRY_BASE_DELAY_MS = 1000;

async function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function registerTokenWithServer(pushToken: string) {
  const apiBase = getApiBase();
  const registerUrl = new URL('/api/notifications/register', apiBase).toString();

  console.log('[Notifications] Registrando token com o servidor:', {
    endpoint: registerUrl,
    token: pushToken
  });

  for (let attempt = 1; attempt <= MAX_REGISTRATION_ATTEMPTS; attempt++) {
    try {
      console.log(
        `[Notifications] Tentativa ${attempt}/${MAX_REGISTRATION_ATTEMPTS} de registrar token de push.`
      );

      const response = await fetch(registerUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: pushToken })
      });

      if (!response.ok) {
        const responseText = await response.text();
        throw new Error(`HTTP ${response.status}: ${responseText}`);
      }

      console.log('[Notifications] Token registrado com sucesso no servidor.');
      return;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error(
        `[Notifications] Falha ao registrar token no servidor (tentativa ${attempt}/${MAX_REGISTRATION_ATTEMPTS}): ${message}`
      );

      if (attempt < MAX_REGISTRATION_ATTEMPTS) {
        const waitTime = RETRY_BASE_DELAY_MS * attempt;
        console.log(`[Notifications] Reagendando registro em ${waitTime}ms.`);
        await delay(waitTime);
      }
    }
  }

  console.warn(
    '[Notifications] Não foi possível registrar o token após múltiplas tentativas. O servidor pode não enviar notificações.'
  );
}

export function usePushNotifications() {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    async function register() {
      console.log('[Notifications] Iniciando fluxo de registro de notificações push.');
      try {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        console.log('[Notifications] Status atual das permissões:', existingStatus);

        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
          console.log('[Notifications] Status após solicitação de permissão:', finalStatus);
        }

        if (finalStatus !== 'granted') {
          console.warn('[Notifications] Permissão de notificações não concedida. Registro cancelado.');
          return;
        }

        const pushToken = (await Notifications.getExpoPushTokenAsync()).data;
        console.log('[Notifications] Token Expo obtido com sucesso:', pushToken);
        setToken(pushToken);

        await registerTokenWithServer(pushToken);
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        console.error('[Notifications] Erro ao configurar notificações push:', message);
      }
    }

    register();
  }, []);

  return token;
}
