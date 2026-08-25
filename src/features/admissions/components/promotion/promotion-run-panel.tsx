"use client";

import { useEffect, useMemo, useState } from "react";
import { useToast } from "@/contexts/ToastContext";
import { useConfirm } from "@/components/ui/confirm";
import { Button } from "@/components/ui/Button";
import {
  useAcademicYears,
  type PromoteAcademicYearSummary,
} from "@/features/academic-years";
import { runAcademicYearPromotion } from "@/features/admissions/services/admissions.service";
import { ApiError } from "@/lib/types/auth";
import { handleApiError } from "@/lib/api";

function formatSummary(s: PromoteAcademicYearSummary) {
  return `Procesados: ${s.processed}
Promovidos: ${s.promoted}
Reprobados retenidos: ${s.retained}
Egresados: ${s.graduated}
Errores: ${s.errors.length}`;
}

export default function PromotionRunPanel() {
  const { data: years, loading: yearsLoading, error: yearsError } = useAcademicYears();
  const { showError, showSuccess } = useToast();
  const { confirm } = useConfirm();

  const [fromId, setFromId] = useState<number | null>(null);
  const [toId, setToId] = useState<number | null>(null);
  const [running, setRunning] = useState(false);
  const [lastSummary, setLastSummary] = useState<PromoteAcademicYearSummary | null>(null);
  const [lastMode, setLastMode] = useState<"dry" | "run" | null>(null);

  useEffect(() => {
    if (!yearsError) return;
    showError("Error", yearsError.message || "No se pudo cargar ciclos escolares.");
  }, [yearsError, showError]);

  const options = useMemo(() => years, [years]);

  useEffect(() => {
    if (options.length === 0) return;
    // Defaults: from = active, to = next (si existe)
    const active = options.find((y) => y.is_active) ?? options[0];
    setFromId((prev) => prev ?? active.id);

    const byStartDesc = [...options].sort((a, b) => Number(b.year_start) - Number(a.year_start));
    const activeIndex = byStartDesc.findIndex((y) => y.id === active.id);
    const next = activeIndex > 0 ? byStartDesc[activeIndex - 1] : byStartDesc[0];
    setToId((prev) => prev ?? (next?.id ?? active.id));
  }, [options]);

  const run = async (dryRun: boolean) => {
    if (!fromId || !toId) {
      showError("Faltan datos", "Selecciona ciclo origen y destino.");
      return;
    }

    setRunning(true);
    setLastSummary(null);
    setLastMode(dryRun ? "dry" : "run");

    try {
      const summary = await runAcademicYearPromotion({
        from_academic_year_id: fromId,
        to_academic_year_id: toId,
        dry_run: dryRun,
      });
      setLastSummary(summary);
      showSuccess(
        dryRun ? "Simulación completada" : "Promoción completada",
        `Procesados: ${summary.processed} · Errores: ${summary.errors.length}`
      );
    } catch (err) {
      const apiError = handleApiError(err) as ApiError;
      showError("Error", apiError.message || "No se pudo ejecutar la promoción.");
    } finally {
      setRunning(false);
    }
  };

  const handleSimulate = () => {
    confirm({
      title: "Simular promoción anual",
      description:
        "Esto NO guarda cambios. Sirve para validar que todo está listo (y detectar errores de grupos faltantes, decisiones pendientes, etc.).",
      confirmLabel: "Simular",
      cancelLabel: "Cancelar",
      variant: "default",
      onConfirm: () => run(true),
    });
  };

  const handleExecute = () => {
    confirm({
      title: "Ejecutar promoción anual",
      description:
        "Esto SÍ guarda cambios y crea inscripciones del ciclo destino. Úsalo solo cuando ya estén capturadas todas las decisiones (aprobado/reprobado).",
      confirmLabel: "Ejecutar",
      cancelLabel: "Cancelar",
      variant: "danger",
      onConfirm: () => run(false),
    });
  };

  return (
    <section className="bg-surface-elevated rounded-xl shadow-sm border p-4 sm:p-6 space-y-4">
      <header>
        <h2 className="text-lg font-semibold text-foreground">Promoción anual</h2>
        <p className="text-sm text-fg-muted">
          Ejecuta el proceso anual: 1°→2°, 2°→3°, 3° egresa. Reprobados conservan grado y grupo.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-medium text-fg-muted">Ciclo origen</label>
          <select
            className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm bg-surface-elevated"
            disabled={yearsLoading || running}
            value={fromId ?? ""}
            onChange={(e) => setFromId(Number(e.target.value))}
          >
            <option value="" disabled>
              Selecciona...
            </option>
            {options.map((y) => (
              <option key={y.id} value={y.id}>
                {y.description} {y.is_active ? "(activo)" : ""}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs font-medium text-fg-muted">Ciclo destino</label>
          <select
            className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm bg-surface-elevated"
            disabled={yearsLoading || running}
            value={toId ?? ""}
            onChange={(e) => setToId(Number(e.target.value))}
          >
            <option value="" disabled>
              Selecciona...
            </option>
            {options.map((y) => (
              <option key={y.id} value={y.id}>
                {y.description}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        <Button variant="secondary" onClick={handleSimulate} loading={running}>
          Simular
        </Button>
        <Button variant="danger" onClick={handleExecute} loading={running}>
          Ejecutar
        </Button>
      </div>

      {lastSummary && (
        <div className="bg-surface-muted border border-border rounded-lg p-4 text-sm text-foreground whitespace-pre-line">
          <div className="font-medium mb-2">
            Resultado ({lastMode === "dry" ? "simulación" : "ejecución"})
          </div>
          {formatSummary(lastSummary)}

          {lastSummary.errors.length > 0 && (
            <div className="mt-3 text-xs text-danger">
              <div className="font-medium mb-1">Errores (primeros 5)</div>
              <ul className="list-disc pl-5 space-y-1">
                {lastSummary.errors.slice(0, 5).map((e, idx) => (
                  <li key={idx}>
                    enrollment_id={e.enrollment_id} student_id={e.student_id} · {e.message}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </section>
  );
}

