"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useGeneralAttendanceContext } from "@/contexts/GeneralAttendanceContext";
import MonthlyCalendar from "@/components/ui/MonthlyCalendar";
import { DataTable } from "@/components/ui/DataTable";
import { formatLongWithoutTime, formatTime } from "@/lib/utils/dateFormatter";
import {GeneralAttendanceStatus} from "@/lib/types/general-attendance";
import { attendanceListTableConfig } from "./attendance-list.config";
import { attendanceListRenderers, toAttendanceTableRows } from "./attendance-list.renderers";
import AcademicYearBanner from "../AcademicYearBanner";
import StudentCard from "./StudentCard";
import SummaryCard from "./SummryCard";

const PAGE_SIZE = 36;
type ViewMode = "cards" | "list";

export default function StudentAttendanceList() {
  const {
    students,
    summary,
    rules,
    selectedDate,
    setSelectedDate,
    academicYear,
    activeAcademicYear,
    loading,
    statusesLoading,
    error,
  } = useGeneralAttendanceContext();

  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [viewMode, setViewMode] = useState<ViewMode>("cards");
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<GeneralAttendanceStatus | "all">("all");
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const statusFilteredStudents = useMemo(() => {
    if (statusFilter === "all") return students;
    return students.filter((student) => student.status === statusFilter);
  }, [students, statusFilter]);

  const cardFilteredStudents = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return statusFilteredStudents;
    return statusFilteredStudents.filter((student) =>
      student.name.toLowerCase().includes(q) ||
      (student.credential_id ?? "").toLowerCase().includes(q) ||
      (student.group ?? "").toLowerCase().includes(q) ||
      (student.grade ?? "").toLowerCase().includes(q)
    );
  }, [statusFilteredStudents, query]);

  const tableRows = useMemo(
    () => toAttendanceTableRows(statusFilteredStudents, (iso: string | null) => iso ? formatTime(iso) : null ),
    [statusFilteredStudents]
  );

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [selectedDate, cardFilteredStudents.length, viewMode]);

  useEffect(() => {
    if (viewMode !== "cards") return;
    const node = loadMoreRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisibleCount((count) =>
            Math.min(count + PAGE_SIZE, cardFilteredStudents.length)
          );
        }
      },
      { rootMargin: "200px" }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [cardFilteredStudents.length, visibleCount, viewMode]);

  const visibleStudents = useMemo(
    () => cardFilteredStudents.slice(0, visibleCount),
    [cardFilteredStudents, visibleCount]
  );

  return (
    <div className="space-y-6">
      <AcademicYearBanner
        academicYear={academicYear}
        activeAcademicYear={activeAcademicYear}
      />

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <div className="space-y-4">
          <MonthlyCalendar
            selectedDate={selectedDate}
            onDateClick={setSelectedDate}
          />
          {rules && (
            <div className="rounded-lg border border-gray-200 bg-white p-3 text-xs text-gray-600 space-y-1">
              <p>
                Entrada: {rules.entry_time} · Tolerancia:{" "}
                {rules.tolerance_minutes} min
              </p>
              <p>Retardo desde: {rules.late_after}</p>
              <p>Salida desde: {rules.exit_from}</p>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Asistencia del {formatLongWithoutTime(selectedDate)}
              </h2>
              {statusesLoading && (
                <p className="text-xs text-blue-600">Actualizando estados…</p>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {viewMode === "cards" && (
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Buscar alumno…"
                  className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm"
                />
              )}
              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value as GeneralAttendanceStatus | "all")
                }
                className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm"
              >
                <option value="all">Todos</option>
                <option value="present">Presentes</option>
                <option value="late">Retardos</option>
                <option value="absent">Ausencias</option>
                <option value="excused">Justificados</option>
                <option value="pending">Pendientes</option>
              </select>
              <div className="inline-flex rounded-lg border border-slate-300 p-0.5">
                <button
                  type="button"
                  onClick={() => setViewMode("cards")}
                  className={`rounded-md px-3 py-1.5 text-sm ${viewMode === "cards"
                      ? "bg-blue-600 text-white"
                      : "text-slate-600 hover:bg-slate-50"
                    }`}
                >
                  Cards
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("list")}
                  className={`rounded-md px-3 py-1.5 text-sm ${viewMode === "list"
                      ? "bg-blue-600 text-white"
                      : "text-slate-600 hover:bg-slate-50"
                    }`}
                >
                  Lista
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6 bg-white rounded-lg p-3 shadow-sm">
            <SummaryCard label="Total" value={summary.total} tone="neutral" />
            <SummaryCard label="Presentes" value={summary.present} tone="success" />
            <SummaryCard label="Retardos" value={summary.late} tone="warning" />
            <SummaryCard label="Ausencias" value={summary.absent} tone="danger" />
            <SummaryCard label="Justificados" value={summary.excused} tone="info" />
            <SummaryCard label="Pendientes" value={summary.pending} tone="neutral" />
          </div>

          {loading && students.length === 0 && (
            <div className="flex items-center justify-center py-12">
              <div className="flex flex-col items-center space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
                <p className="text-gray-600">Cargando asistencia...</p>
              </div>
            </div>
          )}

          {!loading && error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <h3 className="text-sm font-medium text-red-800">
                Error al cargar los datos
              </h3>
              <p className="mt-1 text-sm text-red-700">{error}</p>
            </div>
          )}

          {!loading && !error && viewMode === "cards" && cardFilteredStudents.length === 0 && (
            <div className="text-center py-12">
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                Sin resultados
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {students.length === 0
                  ? "No hay inscripciones activas para esta fecha."
                  : "Ningún alumno coincide con la búsqueda o el filtro."}
              </p>
            </div>
          )}

          {cardFilteredStudents.length > 0 && viewMode === "cards" && (
            <>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 bg-white rounded-lg p-3 shadow-sm">
                {visibleStudents.map((student) => (
                  <StudentCard key={student.student_id} student={student} />
                ))}
              </div>
              {visibleCount < cardFilteredStudents.length && (
                <div
                  ref={loadMoreRef}
                  className="py-4 text-center text-sm text-gray-500"
                >
                  Cargando más alumnos…
                </div>
              )}
            </>
          )}

          {viewMode === "list" && (
            <DataTable
              config={attendanceListTableConfig}
              data={tableRows}
              renderers={attendanceListRenderers}
              emptyMessage={
                students.length === 0
                  ? "No hay inscripciones activas para esta fecha."
                  : "Ningún alumno coincide con el filtro seleccionado."
              }
              loading={loading || statusesLoading}
              minRows={10}
            />
          )}
        </div>
      </div>
    </div>
  );
}


