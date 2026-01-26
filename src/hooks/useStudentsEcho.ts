// hooks/useStudentEcho.ts
'use client'
import { useState, useCallback } from 'react'
import { useEcho } from './echo/useEcho'
import { useEchoConnection } from './echo/useEchoConnection'
import { CurrentStudent, CurrentData } from '@/lib/types/echo';

export function useStudentEcho(
  channelName: string = 'credential-read-channel',
  eventName: string = '.credential-read-event'
) {
  const [studentData, setStudentData] = useState<CurrentStudent | null>(null);
  const [dataReceived, setDataReceived] = useState<CurrentData | null>(null);

  const { connectionStatus, isConnected, isLoading, hasError } = useEchoConnection();

  const handleMessage = useCallback((data: unknown) => {
    const typedData = data as CurrentData;
    console.log(' Datos de estudiante recibidos:', typedData);
    setDataReceived(typedData);
    setStudentData(typedData.student);
  }, []);

  useEcho(channelName, eventName, handleMessage);

  const resetData = useCallback(() => {
    setStudentData(null);
    setDataReceived(null);
  }, []);

  return {
    studentData,
    dataReceived,
    connectionStatus,
    resetData,
    isLoading,
    isConnected,
    hasError
  };
}