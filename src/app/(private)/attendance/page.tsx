"use client"
import ClassCard from "@/components/ui/ClassCard";
import { useSchedules } from "@/hooks/useSchedules";
import { useAttendance } from "@/hooks/useAttendance";
import AttendanceTable from "@/components/private/attendance/AttendanceTable";
import MonthlyCalendar from "@/components/ui/MonthlyCalendar";
import DateInput from "@/components/ui/DateInput";
import { useEffect, useRef } from "react";
import { selectActiveScheduleToday, selectFirstScheduleToday } from "@/lib/utils/schedules";
import { AttendanceStatus } from "@/lib/types/attendance";

export default function AsistenciaPage() {
  const { schedules, loading: schedulesLoading, error: schedulesError } = useSchedules();
  const { students, markedDates, loading: attendanceLoading, error: attendanceError, selectedClass, selectedDate,
    attendanceStats, loadClassStudents, updateAttendance, setSelectedDate, } = useAttendance();
  const now = new Date().toISOString().split("T")[0]

  const didAutoSelect = useRef(false);

  useEffect(() => {
    if (didAutoSelect.current) return;
    if (!schedules || schedules.length === 0) return;
    if (!selectedDate) return;

    let candidate = selectActiveScheduleToday(schedules);
    if (!candidate) {
      candidate = selectFirstScheduleToday(schedules);
    }

    if (candidate) {
      didAutoSelect.current = true;
      loadClassStudents(candidate.class_group_id, selectedDate);
    }
  }, [schedules, selectedDate, loadClassStudents]);

  const handleClassSelect = (scheduleId: number) => {
    if (selectedDate) {
      loadClassStudents(scheduleId, selectedDate);
    }
  };

  const handleDateChange = (date: string) => {
    setSelectedDate(date);
    // Si hay una clase seleccionada, recargar estudiantes con la nueva fecha
    if (selectedClass) {
      loadClassStudents(selectedClass, date);
    }
  };

  const handleAttendanceChange = (studentId: number, status: AttendanceStatus) => {
    if (selectedClass && selectedDate) {
      updateAttendance(studentId, status, selectedClass, selectedDate);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 p-4 min-h-screen">
      {/* ====================== COLUMNA PRINCIPAL ====================== */}
      <section className="col-span-3 flex flex-col gap-4">
        {/* Horarios de clases */}
        <article className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Horarios de Clases</h2>
          {schedulesError && (
            <div className="text-red-600 mb-4 p-3 bg-red-50 rounded">
              Error: {schedulesError}
            </div>
          )}
          <div className="flex gap-4 overflow-x-auto pb-2">
            {schedulesLoading ? (
              <div className="text-gray-500 text-center w-full">Cargando horarios...</div>
            ) : schedules.length === 0 ? (
              <div className="text-gray-500 text-center w-full">No hay horarios disponibles</div>
            ) : (
              schedules.map((schedule) => (
                <ClassCard
                  key={schedule.id}
                  {...schedule}
                  onClick={handleClassSelect}
                  isSelected={selectedClass === schedule.class_group_id}
                />
              ))
            )}
          </div>
        </article>

        {/* Lista de estudiantes */}
        <article className="bg-white flex-1 p-4 rounded-lg shadow overflow-auto">
          <header className="mb-4">
            <h2 className="text-xl font-bold">
              Asistencia {selectedClass && `- Grupo ${selectedClass}`}
            </h2>
          </header>

          {attendanceError && (
            <div className="text-red-600 mb-4 p-3 bg-red-50 rounded">
              Error: {attendanceError}
            </div>
          )}

          <form>
            <fieldset>
              <legend className="sr-only">Seleccionar Fecha de Asistencia</legend>
              <DateInput
                label="Fecha"
                name="attendance-date"
                value={selectedDate}
                onChange={handleDateChange}
                className="mb-4 max-w-xs"
              />
            </fieldset>

            <section aria-label="Tabla de Asistencia">
              <h2 id="tabla-section" className="text-lg font-semibold mb-3">
                {selectedDate
                  ? `Asistencia del ${selectedDate}`
                  : "Selecciona una fecha"}
              </h2>

              {attendanceLoading ? (
                <div className="text-gray-500 text-center py-8">
                  Cargando estudiantes...
                </div>
              ) : students.length === 0 && selectedClass ? (
                <div className="text-gray-500 text-center py-8">
                  No hay estudiantes en este grupo para la fecha seleccionada
                </div>
              ) : (
                <AttendanceTable
                  students={students}
                  onAttendanceChange={handleAttendanceChange}
                />
              )}
            </section>
          </form>
        </article>
      </section>

      {/* ====================== COLUMNA LATERAL DERECHA ====================== */}
      <aside className="col-span-1 flex flex-col gap-4">
        {/* Calendario */}
        <article className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Calendario</h2>
          <MonthlyCalendar 
            markedDates={markedDates}
            onDateClick={(date) => {
              setSelectedDate(date);
              if (selectedClass) {
                loadClassStudents(selectedClass, date);
              }
            }}
          />
        </article>

        {/* Panel extra o resumen */}
        <article className="bg-white p-4 rounded-lg shadow flex-1">
          <h2 className="text-lg font-semibold mb-2">Resumen</h2>
          <div className="text-gray-600 space-y-2">
            <p>Total estudiantes: {attendanceStats.total}</p>
            <p>Presentes: {attendanceStats.present}</p>
            <p>Ausentes: {attendanceStats.absent}</p>
            <p>Tardanzas: {attendanceStats.late}</p>
            <p>Justificados: {attendanceStats.excused}</p>
          </div>

          {attendanceStats.total > 0 && (
            <div className="mt-4 pt-4 border-t">
              <div className="text-sm text-gray-500">
                Porcentaje de asistencia: {Math.round((attendanceStats.present / attendanceStats.total) * 100)}%
              </div>
            </div>
          )}
        </article>
        <article>

        </article>
      </aside>
    </div>
  );

} 