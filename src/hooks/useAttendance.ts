import { useState, useCallback } from "react";
import { Student, AttendanceRecord, ClassAttendanceResponse, AttendanceStats, MarkedDates, AttendanceStatus } from "@/lib/types/attendance";
import apiClient, { API_ENDPOINTS } from "@/lib/api";
import { globalToast } from "@/lib/toast/globalToast";

interface UseAttendanceResult {
  students: Student[];
  markedDates: MarkedDates;
  loading: boolean;
  error: string | null;
  selectedClass: number | null;
  selectedDate: string;
  attendanceStats: AttendanceStats;
  loadClassStudents: (scheduleId: number, date: string) => Promise<void>;
  updateAttendance: (studentId: number, status: AttendanceStatus, scheduleId: number, date: string) => Promise<void>;
  setSelectedDate: (date: string) => void;
  setSelectedClass: (classId: number | null) => void;
  clearStudents: () => void;
  updateMarkedDates: (updatingDates: Partial<MarkedDates>) => void;
}

export function useAttendance(): UseAttendanceResult {
  const [students, setStudents] = useState<Student[]>([]);
  const [markedDates, setMarkedDates] = useState<MarkedDates>({
    completedDates: [],
    incompleteDates: [],
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedClass, setSelectedClass] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split("T")[0]);

  const updateMarkedDates = (updatingDates: Partial<MarkedDates>) => {
    setMarkedDates(prev => ({ ...prev, ...updatingDates }));
  };

  const attendanceStats: AttendanceStats = {
    total: students.length,
    present: students.filter(s => s.current_attendance?.status === 'present').length,
    absent: students.filter(s => s.current_attendance?.status === 'absent').length,
    late: students.filter(s => s.current_attendance?.status === 'late').length,
    excused: students.filter(s => s.current_attendance?.status === 'excused').length,
  };

  const loadClassStudents = useCallback(async (scheduleId: number, date: string): Promise<void> => {
    setSelectedClass(scheduleId);
    setSelectedDate(date);
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.get<ClassAttendanceResponse>(
        API_ENDPOINTS.CLASS_STUDENTS(scheduleId, date)
      );

      const data = response.data;

      if (data.success) {
        setStudents(data.students || []);
        setMarkedDates(data.markedDates);
      } else {
        throw new Error("Error en la respuesta del servidor");
      }
    } catch (err: unknown) {
      const errorMessage = (err && typeof err === 'object' && 'response' in err && err.response && typeof err.response === 'object' && 'data' in err.response && err.response.data && typeof err.response.data === 'object' && 'message' in err.response.data ? String(err.response.data.message) : null) || (err && typeof err === 'object' && 'message' in err ? String(err.message) : null) || "Error al cargar estudiantes";
      setError(errorMessage);
      setStudents([]);

      globalToast.error("Error al cargar estudiantes", errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateAttendance = useCallback(async (
    studentId: number,
    status: AttendanceStatus,
    scheduleId: number,
    date: string
  ): Promise<void> => {
    setStudents(prev => {
      const updated = prev.map(student =>
        student.student_id === studentId
          ? {
            ...student,
            current_attendance: {
              status,
              recorded_at: new Date().toISOString()
            }
          }
          : student
      );

      // calcular counts usando `updated`
      const studentCount = updated.length;
      const attendedCount = updated.filter(s => s.current_attendance).length;

      // actualizar markedDates en función del nuevo estado
      setMarkedDates(prevDates => {
        if (attendedCount === studentCount) {
          return {
            completedDates: [...prevDates.completedDates, date],
            incompleteDates: prevDates.incompleteDates.filter(d => d !== date),
          };
        } else {
          return prevDates.incompleteDates.includes(date)
            ? prevDates
            : { ...prevDates, incompleteDates: [...prevDates.incompleteDates, date] };
        }
      });

      return updated;
    });

    try {
      const attendanceRecord: AttendanceRecord = {
        student_id: studentId,
        schedule_id: scheduleId,
        date,
        status,
      };
      await apiClient.post(`${API_ENDPOINTS.ATTENDANCE}`, attendanceRecord);

      const statusText = {
        'present': 'Presente',
        'absent': 'Ausente',
        'late': 'Tardanza',
        'excused': 'Justificado'
      }[status] || status;

      globalToast.success("Asistencia guardada", `Estado actualizado a: ${statusText}`);
    } catch (err: unknown) {
      setStudents(prev => prev.map(student =>
        student.student_id === studentId
          ? {
            ...student,
            current_attendance: undefined
          }
          : student
      ));

      const errorMessage = (err && typeof err === 'object' && 'response' in err && err.response && typeof err.response === 'object' && 'data' in err.response && err.response.data && typeof err.response.data === 'object' && 'message' in err.response.data ? String(err.response.data.message) : null) || (err && typeof err === 'object' && 'message' in err ? String(err.message) : null) || "Error al guardar asistencia";
      setError(errorMessage);

      globalToast.error("Error al guardar asistencia", errorMessage);
    }
  }, []);

  const clearStudents = useCallback(() => {
    setStudents([]);
    setSelectedClass(null);
    setSelectedDate("");
    setError(null);
  }, []);

  return {
    students,
    markedDates,
    loading,
    error,
    selectedClass,
    selectedDate,
    attendanceStats,
    loadClassStudents,
    updateAttendance,
    setSelectedDate,
    setSelectedClass,
    clearStudents,
    updateMarkedDates,
  };
}
