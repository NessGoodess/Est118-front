"use client";

import { Button } from "@/components/ui/Button";
import { IconByName } from "@/components/ui/icons";
import { SkeletonBone } from "@/components/ui/skeleton/SectionSkeleton";
import type { AcademicYearListItem } from "@/features/academic-years/types/academic-year";
import { formatDate } from "@/lib/utils/dateFormatter";

function toDateInputValue(value?: string | null): string {
  if (!value) return "";
  return value.slice(0, 10);
}

type AcademicYearListProps = {
  years: AcademicYearListItem[];
  loading: boolean;
  saving: boolean;
  canCreate: boolean;
  canDelete: boolean;
  onActivate: (year: AcademicYearListItem) => void;
  onGenerateGroups: (year: AcademicYearListItem) => void;
  onDelete: (year: AcademicYearListItem) => void;
};

function AcademicYearListSkeleton() {
  return (
    <div className="space-y-3" aria-busy="true" aria-label="Cargando ciclos">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="flex flex-col gap-3 rounded-xl border border-border p-4 md:flex-row md:items-center md:justify-between"
        >
          <div className="min-w-0 flex-1 space-y-2">
            <SkeletonBone className="h-5 w-48" />
            <SkeletonBone className="h-4 w-72 max-w-full" />
          </div>
          <div className="flex gap-2">
            <SkeletonBone className="h-9 w-20" />
            <SkeletonBone className="h-9 w-28" />
          </div>
        </div>
      ))}
    </div>
  );
}

function DateRange({
  startsOn,
  endsOn,
}: {
  startsOn?: string | null;
  endsOn?: string | null;
}) {
  return (
    <div className="mt-2 flex flex-wrap md:flex-nowrap items-center gap-x-2 gap-y-1 text-sm text-fg-muted">
      <span className="inline-flex items-center gap-1.5 rounded-md bg-surface-muted px-2 py-1 text-foreground whitespace-nowrap">
        <IconByName name="calendar" className="h-3.5 w-3.5 text-fg-muted" />
        {formatDate(toDateInputValue(startsOn), "medium")}
      </span>
      <span className="text-fg-muted" aria-hidden>
        →
      </span>
      <span className="inline-flex items-center gap-1.5 rounded-md bg-surface-muted px-2 py-1 text-foreground whitespace-nowrap">
        <IconByName name="calendar" className="h-3.5 w-3.5 text-fg-muted" />
        {formatDate(toDateInputValue(endsOn), "medium")}
      </span>
    </div>
  );
}

export default function AcademicYearList({
  years,
  loading,
  saving,
  canCreate,
  canDelete,
  onActivate,
  onGenerateGroups,
  onDelete,
}: AcademicYearListProps) {
  if (loading) {
    return <AcademicYearListSkeleton />;
  }

  if (years.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-surface-muted/40 px-6 py-12 text-center">
        <IconByName name="calendar" className="h-8 w-8 text-fg-muted" />
        <p className="text-sm font-medium text-foreground">
          Sin ciclos escolares
        </p>
        <p className="max-w-sm text-xs text-fg-muted">
          Crea el primero para habilitar reinscripciones y resolver asistencia
          por fechas reales.
        </p>
      </div>
    );
  }

  return (
    <>
      <header className="flex items-end justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-foreground sm:text-base">
            Ciclos registrados
          </h2>
          <p className="mt-0.5 text-xs text-fg-muted">
            Solo un ciclo puede estar activo a la vez.
          </p>
        </div>
        {!loading ? (
          <span className="shrink-0 text-xs font-medium text-fg-muted">
            {years.length} {years.length === 1 ? "ciclo" : "ciclos"}
          </span>
        ) : null}
      </header>
      <ul className="divide-y divide-border rounded-xl border border-border overflow-hidden">
        {years.map((year) => (
          <li
            key={year.id}
            className={`flex flex-wrap items-center gap-4 bg-surface-elevated p-4 transition-colors hover:bg-surface-muted/40 ${
              year.is_active
                ? "border-l-4 border-l-success"
                : "border-l-4 border-l-transparent"
            }`}
          >
            <div className="max-w-full shrink-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="whitespace-nowrap text-base font-semibold text-foreground">
                  {year.description}
                </h3>
                {year.is_active ? (
                  <span className="inline-flex items-center gap-1 rounded-md bg-success/15 px-2 py-0.5 text-xs font-semibold text-success">
                    <IconByName name="check" className="h-3.5 w-3.5" />
                    Activo
                  </span>
                ) : (
                  <span className="rounded-md bg-surface-muted px-2 py-0.5 text-xs font-medium text-fg-muted">
                    Inactivo
                  </span>
                )}
              </div>

              <DateRange startsOn={year.starts_on} endsOn={year.ends_on} />

              <p className="mt-2 inline-flex items-center gap-1.5 text-xs text-fg-muted">
                <IconByName name="groups" className="h-3.5 w-3.5" />
                {year.class_groups_count ?? 0} grupos generados
              </p>
            </div>

            <div className="flex min-w-[12rem] grow flex-wrap justify-end gap-2">
              {canCreate && !year.is_active ? (
                <Button
                  size="sm"
                  onClick={() => onActivate(year)}
                  disabled={saving}
                >
                  Activar
                </Button>
              ) : null}
              {canCreate && year.class_groups_count === 0 ? (
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => onGenerateGroups(year)}
                  disabled={saving}
                >
                  Generar grupos
                </Button>
              ) : null}
              {canDelete && !year.is_active ? (
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => onDelete(year)}
                  disabled={saving}
                >
                  Eliminar
                </Button>
              ) : null}
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
