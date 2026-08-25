"use client";

import { Button } from "@/components/ui/Button";
import { IconByName } from "@/components/ui/icons";
import { useAdmissionCapabilities } from "@/features/admissions/hooks/capabilities/useAdmissionCapabilities";
import type { AdmissionCycle } from "@/features/admissions/types/settings";
import { isCycleExpired } from "@/features/admissions/hooks/use-admission-settings-form";
import { formatWithoutYearWithTime } from "@/lib/utils/dateFormatter";

type AdmissionCycleListProps = {
  cycles: AdmissionCycle[];
  toggling: number | null;
  onActivate: (cycle: AdmissionCycle) => void;
  onClose: (cycle: AdmissionCycle) => void;
  onReopen: (cycle: AdmissionCycle) => void;
  onDelete: (cycle: AdmissionCycle) => void;
};

const STATUS_UI: Record<AdmissionCycle["status"], { label: string; badge: string; accent: string }> = {
  active: {
    label: "Activo",
    badge: "bg-success/15 text-success",
    accent: "border-l-success",
  },
  closed: {
    label: "Cerrado",
    badge: "bg-danger/15 text-danger",
    accent: "border-l-danger",
  },
  draft: {
    label: "Borrador",
    badge: "bg-surface-muted text-fg-muted",
    accent: "border-l-transparent",
  },
};

export default function AdmissionCycleList({
  cycles, toggling, onActivate, onClose, onReopen, onDelete,
}: AdmissionCycleListProps) {
  if (cycles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-surface-muted/40 px-6 py-12 text-center">
        <IconByName name="calendar" className="h-8 w-8 text-fg-muted" />
        <p className="text-sm font-medium text-foreground">Sin periodos de registro</p>
        <p className="max-w-sm text-xs text-fg-muted">
          Crea el primero para abrir el formulario público de aspirantes.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3 bg-surface-elevated border border-border rounded-lg p-6">
      <header className="flex items-end justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-foreground sm:text-base">
            Periodos registrados
          </h2>
          <p className="mt-0.5 text-xs text-fg-muted">
            Solo un periodo puede estar activo a la vez.
          </p>
        </div>
        <span className="shrink-0 text-xs font-medium text-fg-muted">
          {cycles.length} {cycles.length === 1 ? "periodo" : "periodos"}
        </span>
      </header>

      <ul className="divide-y divide-border overflow-hidden rounded-xl border border-border">
        {cycles.map((cycle) => {
          const expired = isCycleExpired(cycle);
          const status = STATUS_UI[cycle.status];
          const folio = cycle.last_folio_number
            ? cycle.last_folio_number.toString().padStart(4, "0")
            : "0000";

          return (
            <li
              key={cycle.id}
              className={`flex flex-wrap items-center gap-4 bg-surface-elevated p-4 transition-colors hover:bg-surface-muted/40 border-l-4 ${status.accent}`}
            >
              <div className="min-w-0 grow">
                <div className="flex flex-nowrap items-center gap-2">
                  <h3 className="text-base font-semibold text-foreground">
                    {cycle.name}
                  </h3>
                  <span
                    className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-semibold ${status.badge}`}
                  >
                    {cycle.status === "active" && (
                      <IconByName name="check" className="h-3.5 w-3.5" />
                    )}
                    {status.label}
                  </span>
                  {expired && (
                    <span className="inline-flex items-center gap-1 rounded-md bg-warning/15 px-2 py-0.5 text-xs font-semibold text-warning-foreground">
                      <IconByName name="alert" className="h-3.5 w-3.5" />
                      Expirado
                    </span>
                  )}
                </div>

                <div className="mt-2 flex flex-wrap lg:flex-nowrap items-center gap-x-2 gap-y-1 text-sm text-fg-muted">
                  <DateChip value={cycle.start_at} />
                  <span aria-hidden>→</span>
                  <DateChip value={cycle.end_at} />
                </div>

                <div className="mt-2 flex flex-nowrap items-center gap-x-4 gap-y-1 text-xs text-fg-muted">
                  <span className="inline-flex items-center gap-1.5">
                    <IconByName name="clipboard" className="h-3.5 w-3.5" />
                    Folio {folio}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <IconByName name="groups" className="h-3.5 w-3.5" />
                    {cycle.preenrollments_count.toLocaleString("es-MX")}{" "}
                    {cycle.preenrollments_count === 1 ? "registro" : "registros"}
                  </span>
                </div>
              </div>

              <div className="flex grow flex-wrap justify-end gap-2">
                <CycleActions
                  cycle={cycle}
                  busy={toggling === cycle.id}
                  expired={expired}
                  onActivate={onActivate}
                  onClose={onClose}
                  onReopen={onReopen}
                  onDelete={onDelete}
                />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function CycleActions({
  cycle,
  busy,
  expired,
  onActivate,
  onClose,
  onReopen,
  onDelete,
}: {
  cycle: AdmissionCycle;
  busy: boolean;
  expired: boolean;
  onActivate: (cycle: AdmissionCycle) => void;
  onClose: (cycle: AdmissionCycle) => void;
  onReopen: (cycle: AdmissionCycle) => void;
  onDelete: (cycle: AdmissionCycle) => void;
}) {
  const { canCreate, canEdit, canDelete } = useAdmissionCapabilities();

  if (cycle.status === "draft") {
    return (
      <>
        {canCreate ? (
          <Button
            type="button"
            size="sm"
            loading={busy}
            loadingText="Activando..."
            onClick={() => onActivate(cycle)}
          >
            Activar
          </Button>
        ) : null}
        {canDelete ? (
          <Button
            type="button"
            variant="danger"
            size="sm"
            loading={busy}
            loadingText="Eliminando..."
            leftIcon={<IconByName name="trash" className="h-3.5 w-3.5" />}
            onClick={() => onDelete(cycle)}
          >
            Eliminar
          </Button>
        ) : null}
      </>
    );
  }

  if (cycle.status === "active") {
    if (!canEdit) return null;
    return (
      <Button
        type="button"
        variant="danger"
        size="sm"
        loading={busy}
        loadingText="Cerrando..."
        onClick={() => onClose(cycle)}
      >
        Cerrar
      </Button>
    );
  }

  if (!canEdit) return null;
  return (
    <Button
      type="button"
      variant="secondary"
      size="sm"
      leftIcon={expired ? <IconByName name="alert" className="text-warning-foreground" /> : null}
      loading={busy}
      loadingText="Reabriendo..."
      onClick={() => onReopen(cycle)}
    >
      Reabrir
    </Button>
  );
}

function DateChip({ value }: { value: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-md bg-surface-muted px-2 py-1 text-foreground whitespace-nowrap">
      <IconByName name="calendar" className="h-3.5 w-3.5 text-fg-muted" />
      {formatWithoutYearWithTime(value)}
    </span>
  );
}