"use client";

import Link from "next/link";
import { useStudentCapabilities } from "@/features/students/hooks/capabilities/useStudentCapabilities";
import useGrades from "@/features/students/hooks/list/useGrades";
import { IconByName } from "@/components/ui/icons";
import StatCard from "./StatCard";
import ShortcutCard from "./ShortcutCard";
import StudentsDashboardSectionSkeleton from "./StudentsDashboardSectionSkeleton";

/**
 * Dashboard students block: bold stats + shortcuts, permission-gated, no duplicate links.
 */
export default function StudentsDashboardSection() {
  const { canList, canManagePhoto, canViewPhoto } = useStudentCapabilities();
  const { grades, totals, isLoading } = useGrades(canList);

  const showSection = canList || canManagePhoto || canViewPhoto;
  if (!showSection) return null;

  if (canList && isLoading) {
    return <StudentsDashboardSectionSkeleton />;
  }

  const activeGrades = grades.filter((g) => g.is_active !== false);

  const shortcuts =
    canList || canManagePhoto ? (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {canList ? (
          <ShortcutCard
            href="/students"
            title="Directorio"
            description={
              canManagePhoto
                ? "Expedientes, búsqueda por grado y captura de fotos"
                : "Expedientes y búsqueda por grado"
            }
            icon={<IconByName name="users" className="h-5 w-5" />}
          />
        ) : null}
        {canList ? (
          <ShortcutCard
            href="/students/credential-printing"
            title="Credenciales"
            description="Impresión, exportes y seguimiento de entrega"
            icon={<IconByName name="print" className="h-5 w-5" />}
          />
        ) : null}
      </div>
    ) : null;

  return (
    <article aria-label="Estudiantes" className="space-y-4">
      <header>
        <h3 className="text-lg font-semibold text-brand-strong tracking-tight">
          Estudiantes
        </h3>
        <p className="mt-0.5 text-sm text-fg-muted">
          Matrícula activa y accesos rápidos
        </p>
      </header>

      {canList ? (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(16rem,20rem)] lg:items-stretch">
          <div className="flex min-w-0 flex-col gap-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <StatCard
                href="/students"
                label="Alumnos activos"
                hint="Inscripciones con status activo"
                value={totals.total_students_all_grades}
                icon={<IconByName name="users" className="h-5 w-5" />}
              />
              <StatCard
                href="/students"
                label="Grupos"
                hint="Class groups"
                value={totals.total_groups}
                icon={<IconByName name="groups" className="h-5 w-5" />}
              />
              <StatCard
                href="/students"
                label="Grados"
                hint="Niveles escolares"
                value={totals.total_grades}
                icon={<IconByName name="book" className="h-5 w-5" />}
              />
            </div>
            {shortcuts}
          </div>

          <div className="flex min-h-[14rem] flex-col rounded-xl border border-border bg-surface-elevated p-4 shadow-sm lg:min-h-0">
            <p className="mb-3 shrink-0 text-xs font-semibold uppercase tracking-wider text-fg-muted">
              Por grado
            </p>
            <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto">
              {activeGrades.map((g) => (
                <Link
                  key={g.grade_id}
                  href="/students"
                  className="group flex items-center gap-3 rounded-xl border border-border/80 bg-surface-muted/40 px-3 py-2 transition-colors hover:border-primary/40 hover:bg-primary-soft/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-surface-elevated text-fg-muted group-hover:text-primary">
                    <IconByName name="book" className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">
                      {g.grade_name}° grado
                    </p>
                    <p className="text-xs text-fg-muted tabular-nums">
                      {g.total_groups} grupo
                      {g.total_groups === 1 ? "" : "s"}
                    </p>
                  </div>
                  <p className="shrink-0 text-lg font-semibold tabular-nums tracking-tight text-foreground leading-none">
                    {g.total_students}
                  </p>
                </Link>
              ))}
              {activeGrades.length === 0 ? (
                <p className="m-auto text-sm text-fg-muted">Sin grados activos</p>
              ) : null}
            </div>
          </div>
        </div>
      ) : (
        shortcuts
      )}
    </article>
  );
}
