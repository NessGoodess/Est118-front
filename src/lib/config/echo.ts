import Echo from 'laravel-echo'
import Pusher from 'pusher-js'
import { API_CONFIG, baseAxiosClient } from './api'

let echoInstance: Echo<'reverb'> | null = null

function createEchoInstance(): Echo<'reverb'> | null {
  if (typeof window === 'undefined') return null

    ; (window as Window & { Pusher?: typeof Pusher }).Pusher = Pusher

  const apiUrl = new URL(API_CONFIG.API_BASE_URL)
  const defaultHost = apiUrl.hostname

  const reverbKey = process.env.NEXT_PUBLIC_REVERB_APP_KEY
  const reverbHost = process.env.NEXT_PUBLIC_REVERB_HOST || defaultHost
  const reverbPort = parseInt(process.env.NEXT_PUBLIC_REVERB_PORT || '443', 10)
  const reverbScheme = process.env.NEXT_PUBLIC_REVERB_SCHEME || 'https'

  if (!reverbKey) {
    console.warn('REVERB_APP_KEY configured incorrectly')
    console.warn('   Add NEXT_PUBLIC_REVERB_APP_KEY')
  }

  const echoConfig: Record<string, unknown> = {
    broadcaster: 'reverb',
    key: reverbKey,
    wsHost: reverbHost,
    wsPort: reverbPort,
    wssPort: reverbPort,
    forceTLS: reverbScheme === 'https',
    enabledTransports: ['ws', 'wss'],
    wsPath: '/app',
    disableStats: false,
    cluster: '',
    authorizer: (channel: { name: string }) => {
      return {
        authorize: (socketId: string, callback: (error: unknown, data?: unknown) => void) => {
          baseAxiosClient
            .post(`${API_CONFIG.API_BASE_URL}/broadcasting/auth`, {
              socket_id: socketId,
              channel_name: channel.name
            })
            .then(response => callback(false, response.data))
            .catch(error => callback(true, error))
        }
      }
    }
  }



  return new Echo(echoConfig as never)
}

/**
 * Echo singleton
 */
export function getEcho(): Echo<'reverb'> | null {
  if (typeof window === 'undefined') return null
  if (echoInstance) return echoInstance
  echoInstance = createEchoInstance()
  return echoInstance
}

/**
 * @deprecated Use getEcho() to avoid multiple WebSocket connections.
 * createEcho() created a new connection each time.
 */
export const createEcho = getEcho