// hooks/useEchoMultiEvent.ts
'use client'
import { useEffect, useRef } from 'react'
import { createEcho } from '@/lib/config/echo'

interface EventHandler {
  [eventName: string]: (data: unknown) => void;
}

export function useEchoMultiEvent(
  channelName: string,
  events: EventHandler
) {
  const eventsRef = useRef(events);

  useEffect(() => {
    eventsRef.current = events;
  }, [events]);

  useEffect(() => {
    const echo = createEcho();
    if (!echo) return;

    const channel = echo.channel(channelName);
    const cleanupFunctions: (() => void)[] = [];

    // Suscribe to each event
    Object.entries(eventsRef.current).forEach(([eventName, handler]) => {
      const eventHandler = (data: unknown) => handler(data);
      channel.listen(eventName, eventHandler);
      cleanupFunctions.push(() => channel.stopListening(eventName, eventHandler));
    });

    return () => {
      cleanupFunctions.forEach(cleanup => cleanup());
      echo.leave(channelName);
    };
  }, [channelName]);
}