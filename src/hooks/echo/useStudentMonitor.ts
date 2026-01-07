// hooks/useStudentMonitor.ts
'use client'
import { useStudentEcho } from '../useStudentsEcho'
import { useEchoConnection } from './useEchoConnection'

export function useStudentMonitor() {
  const studentEcho = useStudentEcho();
  const connection = useEchoConnection();

  return {
    studentData: studentEcho.studentData,
    dataReceived: studentEcho.dataReceived,
    resetData: studentEcho.resetData,
    
    // Estado de conexión
    connectionStatus: connection.connectionStatus,
    isConnected: connection.isConnected,
    isLoading: connection.isLoading,
    hasError: connection.hasError
  };
}