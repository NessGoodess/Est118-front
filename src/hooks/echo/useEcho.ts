// hooks/useEcho.ts
'use client'
import { useEffect, useRef } from 'react'
import { createEcho } from '@/lib/config/echo'

export function useEcho(
  channelName: string,
  eventName: string,
  onMessage: (data: unknown) => void
) {
  const onMessageRef = useRef(onMessage)

  useEffect(() => {
    onMessageRef.current = onMessage
  }, [onMessage])

  useEffect(() => {
    const echo = createEcho()
    if (!echo) return

    const channel = echo.channel(channelName)
    const handler = (data: unknown) => onMessageRef.current(data)

    channel.listen(eventName, handler)

    return () => {
      channel.stopListening(eventName, handler)
      echo.leave(channelName)
    }
  }, [channelName, eventName])
}


/*
'use client'
import { useEffect, useRef } from 'react'
import { createEcho } from '@/lib/config/echo'

export function useEcho(
  channelName: string,
  eventName: string,
  onMessage: (data: any) => void
) {
  const onMessageRef = useRef(onMessage)

  useEffect(() => {
    onMessageRef.current = onMessage
  }, [onMessage])

  useEffect(() => {
    console.log('🧩 useEcho: iniciando suscripción...')
    console.log('📡 Canal:', channelName)
    console.log('🎯 Evento:', eventName)

    const echo = createEcho()
    if (!echo) {
      console.error('❌ No se pudo crear instancia de Echo')
      return
    }

    const channel = echo.channel(channelName)
    console.log('🌀 Suscrito al canal:', channelName)

    const handler = (raw: any) => {
      console.log('📬 RAW recibido →', raw)
      try {
        // Laravel a veces envía `raw.data` como string JSON
        const parsed = typeof raw === 'string'
          ? JSON.parse(raw)
          : typeof raw?.data === 'string'
          ? JSON.parse(raw.data)
          : raw

        console.log('✅ Evento parseado correctamente:', parsed)
        onMessageRef.current(parsed)
      } catch (err) {
        console.error('❌ Error al parsear evento:', err, raw)
      }
    }

    channel.listen(eventName, handler)
    console.log('👂 Escuchando evento:', eventName)

    return () => {
      console.log('🧹 Limpiando listener de', eventName)
      channel.stopListening(eventName, handler)
      echo.leave(channelName)
    }
  }, [channelName, eventName])
}
'use client'
import { useEffect, useRef } from 'react'
import { createEcho } from '@/lib/config/echo'

export function useEcho(
  channelName: string,
  eventName: string,
  onMessage: (data: any) => void
) {
  const onMessageRef = useRef(onMessage)

  useEffect(() => {
    onMessageRef.current = onMessage
  }, [onMessage])

  useEffect(() => {
    console.log('🧩 useEcho: iniciando suscripción...')
    console.log('📡 Canal:', channelName)
    console.log('🎯 Evento:', eventName)

    const echo = createEcho()
    if (!echo) {
      console.error('❌ No se pudo crear instancia de Echo')
      return
    }

    const channel = echo.channel(channelName)
    console.log('🌀 Suscrito al canal:', channelName)

    const handler = (raw: any) => {
      console.log('📬 RAW recibido →', raw)
      try {
        // Laravel a veces envía `raw.data` como string JSON
        const parsed = typeof raw === 'string'
          ? JSON.parse(raw)
          : typeof raw?.data === 'string'
          ? JSON.parse(raw.data)
          : raw

        console.log('✅ Evento parseado correctamente:', parsed)
        onMessageRef.current(parsed)
      } catch (err) {
        console.error('❌ Error al parsear evento:', err, raw)
      }
    }

    channel.listen(eventName, handler)
    console.log('👂 Escuchando evento:', eventName)

    return () => {
      console.log('🧹 Limpiando listener de', eventName)
      channel.stopListening(eventName, handler)
      echo.leave(channelName)
    }
  }, [channelName, eventName])
}

 */