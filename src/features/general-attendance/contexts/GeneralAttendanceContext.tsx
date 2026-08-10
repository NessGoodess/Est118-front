"use client";
import React, { createContext, useContext, ReactNode } from "react";
import {
  AcademicYearInfo,
  DailyAttendanceRules,
  DailyAttendanceStudent,
  DailyAttendanceSummary,
} from "@/features/general-attendance/types/general-attendance";
import { useGeneralAttendance } from "@/features/general-attendance/hooks/useGeneralAttendance";

interface GeneralAttendanceContextType {
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  students: DailyAttendanceStudent[];
  summary: DailyAttendanceSummary;
  rules: DailyAttendanceRules | null;
  academicYear: AcademicYearInfo | null;
  activeAcademicYear: AcademicYearInfo | null;
  loading: boolean;
  statusesLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

const GeneralAttendanceContext = createContext<
  GeneralAttendanceContextType | undefined
>(undefined);

interface GeneralAttendanceProviderProps {
  children: ReactNode;
}

export function GeneralAttendanceProvider({
  children,
}: GeneralAttendanceProviderProps) {
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
    throw new Error(
      "useGeneralAttendanceContext must be used within a GeneralAttendanceProvider"
    );
  }
  return context;
}
