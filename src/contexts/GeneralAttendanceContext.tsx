"use client";
import React, { createContext, useContext, ReactNode } from 'react';
import { Students } from '@/lib/types/general-attendance';
import { useGeneralAttendance } from '@/hooks/useGeneralAttendance';

interface GeneralAttendanceContextType {
  students: Students[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

const GeneralAttendanceContext = createContext<GeneralAttendanceContextType | undefined>(undefined);

interface GeneralAttendanceProviderProps {
  children: ReactNode;
}

export function GeneralAttendanceProvider({ children }: GeneralAttendanceProviderProps) {
  const attendanceData = useGeneralAttendance();

  return (
    <GeneralAttendanceContext.Provider value={attendanceData}>
      {children}
    </GeneralAttendanceContext.Provider>
  );
}

export function useGeneralAttendanceContext(): GeneralAttendanceContextType {
  const context = useContext(GeneralAttendanceContext);
  if (context === undefined) {
    throw new Error('useGeneralAttendanceContext must be used within a GeneralAttendanceProvider');
  }
  return context;
}
