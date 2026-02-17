import Echo from 'laravel-echo'
import Pusher from 'pusher-js'
import { API_CONFIG, baseAxiosClient } from './api'

export const createEcho = () => {
  if (typeof window === 'undefined') return null;

  (window as Window & { Pusher?: typeof Pusher }).Pusher = Pusher

  const apiUrl = new URL(API_CONFIG.API_BASE_URL);
  const defaultHost = apiUrl.hostname;

  const reverbKey = process.env.NEXT_PUBLIC_REVERB_APP_KEY || '';
  const reverbHost = process.env.NEXT_PUBLIC_REVERB_HOST || defaultHost;
  const reverbPort = parseInt(process.env.NEXT_PUBLIC_REVERB_PORT || '8080');
  const reverbScheme = process.env.NEXT_PUBLIC_REVERB_SCHEME || 'https';

  if (!reverbKey) {
    console.warn('REVERB_APP_KEY configured incorrectly');
    console.warn(`   Add NEXT_PUBLIC_REVERB_APP_KEY in your .env.local file`);
  }

  const echoConfig: Record<string, unknown> = {
    broadcaster: 'reverb',
    key: reverbKey,
    wsHost: reverbHost,
    wsPort: reverbPort,
    wssPort: reverbPort,
    forceTLS: true,
    enabledTransports: ['ws', 'wss'],
    disableStats: false,
    cluster: '',
    scheme: reverbScheme,
    authorizer: (channel: { name: string }) => {
      return {
        authorize: (socketId: string, callback: (error: unknown, data?: unknown) => void) => {
          baseAxiosClient.post(`${API_CONFIG.API_BASE_URL}/broadcasting/auth`, {
            socket_id: socketId,
            channel_name: channel.name
          })
            .then(response => {
              callback(false, response.data);
            })
            .catch(error => {
              callback(true, error);
            });
        }
      };
    },
  };

  // En desarrollo, agregar configuración adicional
  if (API_CONFIG.IS_DEVELOPMENT) {
    echoConfig.encrypted = false;
    echoConfig.enableLogging = true; // Habilitar logs para debugging
  }

  return new Echo(echoConfig as never)
}