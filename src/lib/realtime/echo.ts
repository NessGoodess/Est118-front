import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import { API_CONFIG, apiClient, API_ENDPOINTS } from '@/lib/api';

let echoInstance: Echo<'reverb'> | null = null;

function createEchoInstance(): Echo<'reverb'> | null {
  if (typeof window === 'undefined') return null;

  (window as Window & { Pusher?: typeof Pusher }).Pusher = Pusher;

  const apiUrl = new URL(API_CONFIG.API_BASE_URL);
  const defaultHost = apiUrl.hostname;

  const reverbKey = process.env.NEXT_PUBLIC_REVERB_APP_KEY;
  const reverbHost = process.env.NEXT_PUBLIC_REVERB_HOST || defaultHost;
  const reverbPort = parseInt(process.env.NEXT_PUBLIC_REVERB_PORT || '443', 10);
  const reverbScheme = process.env.NEXT_PUBLIC_REVERB_SCHEME || 'https';

  if (!reverbKey) {
    console.warn('REVERB_APP_KEY configured incorrectly');
    console.warn('   Add NEXT_PUBLIC_REVERB_APP_KEY');
  }

  return new Echo({
    broadcaster: 'reverb',
    key: reverbKey,
    wsHost: reverbHost,
    wsPort: reverbPort,
    wssPort: reverbPort,
    forceTLS: reverbScheme === 'https',
    enabledTransports: ['ws', 'wss'],
    disableStats: false,
    cluster: '',
    authorizer: (channel: { name: string }) => ({
      authorize: (
        socketId: string,
        callback: (error: boolean | null, data?: unknown) => void
      ) => {
        apiClient
          .post(API_ENDPOINTS.BROADCASTING.AUTH, {
            socket_id: socketId,
            channel_name: channel.name,
          })
          .then((response) => callback(null, response.data))
          .catch((error) => callback(true, error.message));
      },
    }),
  } as never);
}

export function getEcho(): Echo<'reverb'> | null {
  if (typeof window === 'undefined') return null;
  if (echoInstance) return echoInstance;
  echoInstance = createEchoInstance();
  return echoInstance;
}

export function disconnectEcho(): void {
  if (!echoInstance) return;
  try {
    echoInstance.disconnect();
  } catch {
    // ignore disconnect errors during teardown
  }
  echoInstance = null;
}

/** @deprecated Use getEcho() */
export const createEcho = getEcho;
