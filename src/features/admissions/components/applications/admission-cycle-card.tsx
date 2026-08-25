"use client";

import type { AdmissionCycle } from "@/features/admissions/types/pre-enrollment-api";
import { formatWithoutYear } from "@/lib/utils/dateFormatter";

type CycleStatus = AdmissionCycle["status"];

const STATUS_UI: Record<
  CycleStatus,
  { label: string; badge: string; dot: string }
> = {
  active: {
    label: "Activo",
    badge: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    dot: "bg-emerald-500",
  },
  closed: {
    label: "Cerrado",
    badge: "bg-surface-muted text-fg-muted border border-border",
    dot: "bg-fg-muted",
  },
  draft: {
    label: "Borrador",
    badge: "bg-sky-50 text-sky-700 border border-sky-200",
    dot: "bg-sky-500",
  },
};

type AdmissionCycleCardProps = {
  cycle: AdmissionCycle;
  selected?: boolean;
  onClick?: (cycle: AdmissionCycle) => void;
};

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-wider text-fg-muted font-medium mb-0.5">
        {label}
      </p>
      <p className="text-sm font-medium text-foreground">{value}</p>
    </div>
  );
}

export default function AdmissionCycleCard({
  cycle,
  selected = false,
  onClick,
}: AdmissionCycleCardProps) {
  const status = STATUS_UI[cycle.status] ?? STATUS_UI.draft;
  const startDate = cycle.start_at ? formatWithoutYear(cycle.start_at) : "—";
  const endDate = cycle.end_at ? formatWithoutYear(cycle.end_at) : "—";
  const students =
    cycle.preenrollments_count > 0
      ? cycle.preenrollments_count.toLocaleString("es-MX")
      : "Sin registros";
  const lastFolio = cycle.last_folio_number
    ? cycle.last_folio_number.toString().padStart(4, "0")
    : "0000";

  return (
    <button
      type="button"
      onClick={() => onClick?.(cycle)}
      aria-pressed={selected}
      className={`relative bg-surface-elevated min-w-sm max-w-lg shrink-0 rounded-xl border px-5 py-4 text-left transition-all duration-200 cursor-pointer focus-visible:outline-none ${selected
          ? "border-primary border-2 -translate-y-1 -translate-x-1 shadow-lg active:translate-y-0 active:translate-x-0 active:shadow-none"
          : "hover:border-2 border-border hover:-translate-y-1 hover:-translate-x-1 hover:shadow-lg active:translate-y-0 active:translate-x-0 active:shadow-none"
        }`}
      >
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-foreground leading-tight">
            {cycle.name}
          </p>
          <p className="mt-0.5 text-xs text-fg-muted">
            {cycle.status === "active"
              ? "Periodo Activo"
              : cycle.status === "closed"
                ? "Periodo Cerrado"
                : "Borrador"}
          </p>
        </div>

        <span
          className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${status.badge}`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
          {status.label}
        </span>
      </div>

      <div className="my-3 border-t border-border" />

      <div className="grid grid-cols-3 gap-3">
        <Meta label="Fecha inicio" value={startDate} />
        <Meta label="Fecha fin" value={endDate} />
        <Meta label="Alumnos" value={students} />
      </div>

      <div className="mt-3">
        <p className="mb-0.5 text-[10px] font-medium uppercase tracking-wider text-fg-muted">
          Último folio
        </p>
        <p className="font-mono text-xs font-medium tracking-wide text-foreground">
          {lastFolio}
        </p>
      </div>
    </button>
  );
}
