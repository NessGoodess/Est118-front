"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useGeneralAttendanceContext } from "@/features/general-attendance/contexts/GeneralAttendanceContext";
import { useGeneralAttendanceCapabilities } from "@/features/general-attendance/hooks/capabilities/useGeneralAttendanceCapabilities";
import MonthlyCalendar from "@/components/ui/MonthlyCalendar";
import AttendanceListTable from "./list/AttendanceListTable";
import AcademicYearBanner from "./AcademicYearBanner";
import StudentCard from "./card/StudentCard";
import SummaryCard from "./SummryCard";
import { SUMMARY_FILTER_CARDS } from "./summary-filters.config";
import AttendanceRulesForm from "@/features/general-attendance/components/settings/AttendanceRulesForm";
import Modal from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import AttendanceRosterSkeleton from "@/features/general-attendance/components/skeletons/AttendanceRosterSkeleton";
import HistoryToolbar, { type HistoryViewMode } from "./HistoryToolbar";
import { useAttendanceRosterFilters } from "./useAttendanceRosterFilters";

const PAGE_SIZE = 36;

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
    refetch,
  } = useGeneralAttendanceContext();
  const { canEdit } = useGeneralAttendanceCapabilities();

  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [viewMode, setViewMode] = useState<HistoryViewMode>("cards");
  const [rulesModalOpen, setRulesModalOpen] = useState(false);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const { query, setQuery, statusFilter, setStatusFilter, gradeFilter, selectGrade,
    groupFilter, setGroupFilter, gradeOptions, groupOptions, listStudents, cardStudents,
  } = useAttendanceRosterFilters(students);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [
    selectedDate,
    cardStudents.length,
    viewMode,
    gradeFilter,
    groupFilter,
    statusFilter,
  ]);

  useEffect(() => {
    if (viewMode !== "cards") return;
    const node = loadMoreRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisibleCount((count) =>
            Math.min(count + PAGE_SIZE, cardStudents.length)
          );
        }
      },
      { rootMargin: "200px" }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [cardStudents.length, visibleCount, viewMode]);

  const visibleStudents = useMemo(
    () => cardStudents.slice(0, visibleCount),
    [cardStudents, visibleCount]
  );

  return (
    <div className="space-y-6">
      <AcademicYearBanner
        academicYear={academicYear}
        activeAcademicYear={activeAcademicYear}
      />

      <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
        <div className="space-y-4">
          <div className="hidden lg:block">
            <MonthlyCalendar
              selectedDate={selectedDate}
              onDateClick={setSelectedDate}
            />
          </div>

          {rules && (
            <div className="space-y-2 rounded-lg border border-border bg-surface-elevated p-3 text-xs text-fg-muted">
              <div className="flex items-center justify-between gap-2">
                <p className="font-medium text-foreground">Horario vigente</p>
                {canEdit ? (
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => setRulesModalOpen(true)}
                  >
                    Editar
                  </Button>
                ) : null}
              </div>
              <p>
                Entrada: {rules.entry_time} · Tolerancia:{" "}
                {rules.tolerance_minutes} min
              </p>
              <p>Retardo desde: {rules.late_after}</p>
              <p>Salida desde: {rules.exit_from}</p>
              <p>Cierre entrada: {rules.entry_window_closes_at}</p>
            </div>
          )}
        </div>

        <div className="relative min-w-0 space-y-4">
          <HistoryToolbar
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
            gradeFilter={gradeFilter}
            groupFilter={groupFilter}
            gradeOptions={gradeOptions}
            groupOptions={groupOptions}
            onGradeChange={selectGrade}
            onGroupChange={setGroupFilter}
            query={query}
            onQueryChange={setQuery}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />

          {loading && students.length === 0 ? (
            <AttendanceRosterSkeleton />
          ) : (
            <div className="grid grid-cols-3 gap-2 rounded-lg bg-surface-elevated p-3 shadow-sm lg:grid-cols-6 lg:gap-3 2xl:gap-4">
              {SUMMARY_FILTER_CARDS.map((filter) => (
                <SummaryCard
                  key={filter.status}
                  label={filter.label}
                  value={summary[filter.metric]}
                  tone={filter.tone}
                  selected={statusFilter === filter.status}
                  onClick={() => setStatusFilter(filter.status)}
                  loading={statusesLoading}
                />
              ))}
            </div>
          )}

          {!loading && error && <ErrorMessage error={error} />}

          {!loading &&
            !error &&
            viewMode === "cards" &&
            cardStudents.length === 0 && (
              <EmptyMessage count={students.length} />
            )}

          {cardStudents.length > 0 && viewMode === "cards" && (
            <>
              <div className="relative grid gap-2 rounded-lg bg-surface-elevated p-3 shadow-sm md:grid-cols-2 lg:gap-3 xl:grid-cols-3 2xl:grid-cols-4 2xl:gap-4">
                {visibleStudents.map((student) => (
                  <StudentCard
                    key={student.student_id}
                    student={student}
                  />
                ))}
              </div>
              {visibleCount < cardStudents.length && (
                <div
                  ref={loadMoreRef}
                  className="py-4 text-center text-sm text-fg-muted"
                >
                  Cargando más alumnos…
                </div>
              )}
            </>
          )}

          {viewMode === "list" && (
            <AttendanceListTable
              students={listStudents}
              loading={loading || statusesLoading}
              emptyMessage={
                students.length === 0
                  ? "No hay inscripciones activas para esta fecha."
                  : "Ningún alumno coincide con el filtro seleccionado."
              }
            />
          )}
        </div>
      </div>

      {canEdit ? (
        <Modal
          isOpen={rulesModalOpen}
          onClose={() => setRulesModalOpen(false)}
          title="Editar horarios de asistencia"
          maxWidth="lg"
        >
          <AttendanceRulesForm
            onSuccess={async () => {
              await refetch();
              setRulesModalOpen(false);
            }}
          />
        </Modal>
      ) : null}
    </div>
  );
}

function ErrorMessage({ error }: { error: string }) {
  return (
    <div className="rounded-lg border border-danger/30 bg-danger/10 p-6">
      <h3 className="text-sm font-medium text-danger">
        Error al cargar los datos
      </h3>
      <p className="mt-1 text-sm text-danger">{error}</p>
    </div>
  );
}

function EmptyMessage({ count }: { count: number }) {
  return (
    <div className="py-12 text-center">
      <h3 className="mt-2 text-sm font-medium text-foreground">Sin resultados</h3>
      <p className="mt-1 text-sm text-fg-muted">
        {count === 0
          ? "No hay inscripciones activas para esta fecha."
          : "Ningún alumno coincide con la búsqueda o el filtro."}
      </p>
    </div>
  );
}
