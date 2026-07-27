// hooks/useEcho.ts
'use client'
import { useEffect, useRef } from 'react'
import { getEcho } from '@/lib/realtime'

/** Laravel/Reverb may deliver broadcast payload as a JSON string or nested in `data`. */
function parseEchoPayload(raw: unknown): unknown {
  if (typeof raw === 'string') {
    try {
      return JSON.parse(raw)
    } catch {
      return raw
    }
  }
  if (raw && typeof raw === 'object' && 'data' in raw) {
    const nested = (raw as { data: unknown }).data
    if (typeof nested === 'string') {
      try {
        return JSON.parse(nested)
      } catch {
        return raw
      }
    }
  }
  return raw
}

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
    const echo = getEcho()
    if (!echo) return

    const channel = echo.private(channelName)
    const handler = (raw: unknown) => onMessageRef.current(parseEchoPayload(raw))

    channel.listen(eventName, handler)

    return () => {
      channel.stopListening(eventName, handler)
      echo.leave(channelName)
    }
  }, [channelName, eventName])
}
