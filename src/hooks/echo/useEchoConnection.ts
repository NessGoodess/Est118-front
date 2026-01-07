// hooks/useEchoConnection.ts
'use client'
import { useState, useEffect, useRef } from 'react'
import { createEcho } from '@/lib/config/echo'

export function useEchoConnection() {
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'error'>('connecting');
  const echoRef = useRef<any>(null);

  useEffect(() => {
    const echo = createEcho();
    if (!echo) {
      setConnectionStatus('error');
      return;
    }

    echoRef.current = echo;

    // Manejar eventos de conexión
    const handleConnected = () => {
      console.log('✅ Conectado a Reverb');
      setConnectionStatus('connected');
    };

    const handleDisconnected = () => {
      console.log('❌ Desconectado de Reverb');
      setConnectionStatus('disconnected');
    };

    const handleError = (error?: any) => {
      console.error('❌ Error de conexión Reverb:', error);
      setConnectionStatus('error');
    };

    const handleStateChange = (currentState: any) => {
      // El evento state_change puede venir como objeto {current, previous} o como string
      let current = currentState;
      let previous = 'unknown';
      
      if (typeof currentState === 'object' && currentState.current) {
        current = currentState.current;
        previous = currentState.previous || 'unknown';
      }
      
      console.log(`🔄 Estado de conexión cambió: ${previous} → ${current}`);
      
      if (current === 'connected') {
        handleConnected();
      } else if (current === 'disconnected' || current === 'failed' || current === 'unavailable') {
        handleDisconnected();
        if (current === 'failed') {
          setConnectionStatus('error');
        }
      }
    };

    // Eventos de Pusher/Echo - siguiendo el patrón de ChatTest.tsx
    const connector = echo.connector as any;
    if (connector && connector.pusher) {
      const pusher = connector.pusher;
      
      // Escuchar eventos de conexión
      pusher.connection.bind('connected', handleConnected);
      pusher.connection.bind('disconnected', handleDisconnected);
      pusher.connection.bind('error', handleError);
      pusher.connection.bind('state_change', handleStateChange);
      
      // También escuchar el estado inicial
      const initialState = pusher.connection.state;
      console.log('🔌 Estado inicial de conexión:', initialState);
      
      if (initialState === 'connected') {
        handleConnected();
      } else if (initialState === 'failed' || initialState === 'unavailable') {
        setConnectionStatus('error');
      } else if (initialState === 'connecting') {
        setConnectionStatus('connecting');
      } else {
        setConnectionStatus('disconnected');
      }
    } else {
      console.error('Echo connector o pusher no está disponible');
      setConnectionStatus('error');
      return;
    }

    // Cleanup
    return () => {
      const connector = echoRef.current?.connector as any;
      if (connector && connector.pusher) {
        const pusher = connector.pusher;
        pusher.connection.unbind('connected', handleConnected);
        pusher.connection.unbind('disconnected', handleDisconnected);
        pusher.connection.unbind('error', handleError);
        pusher.connection.unbind('state_change', handleStateChange);
      }
    };
  }, []);

  return {
    connectionStatus,
    isConnected: connectionStatus === 'connected',
    isLoading: connectionStatus === 'connecting',
    hasError: connectionStatus === 'error'
  };
}