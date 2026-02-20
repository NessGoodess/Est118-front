import Echo from 'laravel-echo'
import Pusher from 'pusher-js'
import { API_CONFIG, baseAxiosClient } from './api'

let echoInstance: Echo<'reverb'> | null = null

function createEchoInstance(): Echo<'reverb'> | null {
  if (typeof window === 'undefined') return null

    ; (window as Window & { Pusher?: typeof Pusher }).Pusher = Pusher

  const apiUrl = new URL(API_CONFIG.API_BASE_URL)
  const defaultHost = apiUrl.hostname

  const reverbKey = process.env.NEXT_PUBLIC_REVERB_APP_KEY || 'oqzcyn68ubujjzctipbv2025'
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

  // Siempre habilitar logging para poder diagnosticar en cualquier entorno
  echoConfig.enableLogging = true

  // Log de la configuración que se usará (útil para verificar variables de entorno embebidas)
  const wsUrl = `${reverbScheme === 'https' ? 'wss' : 'ws'}://${reverbHost}:${reverbPort}/app/${reverbKey}`
  console.group('[Echo] Inicializando conexión WebSocket')
  console.log('URL calculada :', wsUrl)
  console.log('Host          :', reverbHost)
  console.log('Puerto        :', reverbPort)
  console.log('Scheme        :', reverbScheme)
  console.log('App Key       :', reverbKey)
  console.log('forceTLS      :', true)
  console.log('transports    :', ['wss'])
  console.groupEnd()

  const instance = new Echo(echoConfig as never)

  // Acceder al conector interno de Pusher para escuchar eventos de conexión
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pusher = (instance.connector as any)?.pusher
  if (pusher) {
    pusher.connection.bind('connecting', () =>
      console.log('[Echo] 🔄 Conectando a WebSocket...'))

    pusher.connection.bind('connected', () =>
      console.log('[Echo] ✅ Conectado. Socket ID:', pusher.connection.socket_id))

    pusher.connection.bind('disconnected', () =>
      console.warn('[Echo] ⚠️ Desconectado del WebSocket'))

    pusher.connection.bind('failed', () =>
      console.error('[Echo] ❌ Falló la conexión (ningún transport disponible)'))

    pusher.connection.bind('error', (err: unknown) =>
      console.error('[Echo] ❌ Error de conexión:', err))

    pusher.connection.bind('state_change', (states: { previous: string; current: string }) =>
      console.log(`[Echo] Estado: ${states.previous} → ${states.current}`))
  }

  return instance as unknown as Echo<'reverb'>
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