import Echo from 'laravel-echo'
import Pusher from 'pusher-js'
import { API_CONFIG, baseAxiosClient } from './api'

let echoInstance: Echo<'reverb'> | null = null

function createEchoInstance(): Echo<'reverb'> | null {
  if (typeof window === 'undefined') return null

  ;(window as Window & { Pusher?: typeof Pusher }).Pusher = Pusher

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
    forceTLS: true,
    enabledTransports: ['wss'],
    disableStats: true,
    cluster: '',
    scheme: reverbScheme,
    wsPath: '/app',
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

  if (API_CONFIG.IS_DEVELOPMENT) {
    echoConfig.encrypted = true
    echoConfig.enableLogging = true
  }

  return new Echo(echoConfig as never)
}

/**
 * Obtiene la instancia única (singleton) de Echo.
 * Usar siempre getEcho() en componentes; nunca crear una nueva instancia con createEcho.
 */
export function getEcho(): Echo<'reverb'> | null {
  if (typeof window === 'undefined') return null
  if (echoInstance) return echoInstance
  echoInstance = createEchoInstance()
  return echoInstance
}

/**
 * @deprecated Usa getEcho() para evitar múltiples conexiones WebSocket.
 * createEcho() crea una nueva conexión en cada llamada.
 */
export const createEcho = getEcho