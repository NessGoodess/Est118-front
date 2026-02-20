// hooks/useStudentEcho.ts
'use client'
import { useState, useCallback, useEffect } from 'react'
import { useEcho } from './echo/useEcho'
import { useEchoConnection } from './echo/useEchoConnection'
import { CurrentStudent, CurrentData, ReaderStatusData } from '@/lib/types/echo'
import apiClient, { API_ENDPOINTS } from '@/lib/config/api'

const INITIAL_READER_STATUS: ReaderStatusData = {
  event: 'reader_status_changed',
  connected: false,
  ready: false,
  readers: [],
  timestamp: ''
}

export function useStudentEcho(
  channelName: string = 'credential-read-channel',
  eventName: string = '.credential-read-event'
) {
  const [studentData, setStudentData] = useState<CurrentStudent | null>(null)
  const [dataReceived, setDataReceived] = useState<CurrentData | null>(null)
  const [readerStatus, setReaderStatus] = useState<ReaderStatusData>(INITIAL_READER_STATUS)

  const { connectionStatus, isConnected, isLoading, hasError } = useEchoConnection()

  // reader status (cache backend syncronization)
  useEffect(() => {
    apiClient
      .get<ReaderStatusData>(API_ENDPOINTS.READER.STATUS)
      .then(({ data }) => {
        setReaderStatus({
          event: 'reader_status_changed',
          connected: data.connected ?? false,
          ready: data.ready ?? false,
          readers: data.readers ?? [],
          timestamp: data.timestamp ?? '',
        })
      })
      .catch(() => {
        
      })
  }, [])

  const handleMessage = useCallback((data: unknown) => {
    const payload = data as CurrentData & Partial<ReaderStatusData>
    if (payload.event === 'reader_status_changed') {
      setReaderStatus({
        event: 'reader_status_changed',
        connected: payload.connected ?? false,
        ready: payload.ready ?? false,
        readers: payload.readers ?? [],
        timestamp: payload.timestamp ?? ''
      })
      return
    }
    const typedData = payload as CurrentData
    setDataReceived(typedData)
    setStudentData(typedData.student ?? null)
  }, [])

  useEcho(channelName, eventName, handleMessage)

  const resetData = useCallback(() => {
    setStudentData(null)
    setDataReceived(null)
  }, [])

  return {
    studentData,
    dataReceived,
    readerStatus,
    connectionStatus,
    resetData,
    isLoading,
    isConnected,
    hasError
  }
}