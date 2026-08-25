"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Modal from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { IconByName } from "@/components/ui/icons";
import { useToast } from "@/contexts/ToastContext";
import { useAcademicYears } from "@/features/academic-years";
import {
  createConversionBatch,
  retryFailedConversionBatch,
  type BulkConversionResult,
} from "@/features/admissions/services/admissions.service";
import type { PreEnrollmentListItem } from "@/features/admissions/types/pre-enrollment-api";
import { handleApiError } from "@/lib/api";
import { randomUuid } from "@/lib/utils/random-uuid";

type Props = {
  open: boolean;
  selected: PreEnrollmentListItem[];
  onClose: () => void;
  onFinished: () => void;
};

function isReadyForBulk(row: PreEnrollmentListItem): boolean {
  return (
    !row.converted_student_id &&
    row.status === "in_review" &&
    row.documents_status === "complete" &&
    row.payment_status === "validated"
  );
}

export default function BulkConvertToStudentsModal({
  open,
  selected,
  onClose,
  onFinished,
}: Props) {
  const { data: years, loading: yearsLoading } = useAcademicYears();
  const { showError, showSuccess } = useToast();
  const [academicYearId, setAcademicYearId] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [retrying, setRetrying] = useState(false);
  const [result, setResult] = useState<BulkConversionResult | null>(null);
  const idempotencyKeyRef = useRef<string | null>(null);

  const ready = useMemo(() => selected.filter(isReadyForBulk), [selected]);
  const excluded = selected.length - ready.length;

  useEffect(() => {
    if (!open) return;
    const active = years.find((year) => year.is_active) ?? years[0];
    setAcademicYearId(active?.id ?? null);
    setResult(null);
    idempotencyKeyRef.current = null;
  }, [open, years]);

  const handleSubmit = async () => {
    if (!academicYearId || ready.length === 0) return;
    setSubmitting(true);
    setResult(null);

    if (!idempotencyKeyRef.current) {
      idempotencyKeyRef.current = randomUuid();
    }

    try {
      const ids = ready.map((row) => row.id);
      const next = await createConversionBatch({
        pre_enrollment_ids: ids,
        academic_year_id: academicYearId,
        expected_count: ids.length,
        idempotencyKey: idempotencyKeyRef.current,
      });
      setResult(next);
      if (next.failed === 0) {
        showSuccess(
          "Inscripción masiva completada",
          `${next.converted} aspirante${next.converted === 1 ? "" : "s"} inscrito${next.converted === 1 ? "" : "s"}.`
        );
        idempotencyKeyRef.current = null;
      }
      onFinished();
    } catch (error) {
      showError(
        "No se pudo ejecutar el lote",
        handleApiError(error).message || "Intenta nuevamente."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleRetryFailed = async () => {
    if (!result?.id) return;
    setRetrying(true);
    try {
      const next = await retryFailedConversionBatch(result.id);
      setResult(next);
      if (next.failed === 0) {
        showSuccess("Reintento completado", "Los fallidos se procesaron correctamente.");
      }
      onFinished();
    } catch (error) {
      showError(
        "No se pudo reintentar",
        handleApiError(error).message || "Intenta nuevamente."
      );
    } finally {
      setRetrying(false);
    }
  };

  const failures = result?.results.filter((item) => item.status === "failed") ?? [];

  return (
    <Modal
      isOpen={open}
      onClose={submitting || retrying ? undefined : onClose}
      title="Inscribir aspirantes seleccionados"
      maxWidth="lg"
      footerActions
      footerActionsContent={
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={onClose} disabled={submitting || retrying}>
            {result ? "Cerrar" : "Cancelar"}
          </Button>
          {!result ? (
            <Button
              onClick={handleSubmit}
              loading={submitting}
              loadingText="Inscribiendo..."
              disabled={!academicYearId || ready.length === 0 || yearsLoading}
            >
              Inscribir {ready.length}
            </Button>
          ) : failures.length > 0 && result.id ? (
            <Button
              onClick={handleRetryFailed}
              loading={retrying}
              loadingText="Reintentando..."
              variant="secondary"
            >
              Reintentar fallidos ({failures.length})
            </Button>
          ) : null}
        </div>
      }
    >
      <div className="space-y-5">
        <div className="rounded-lg border border-border bg-surface-muted/40 p-4">
          <div className="flex items-start gap-3">
            <IconByName name="users" className="mt-0.5 h-5 w-5 text-primary" />
            <div>
              <p className="font-medium text-foreground">
                {ready.length} de {selected.length} seleccionados están listos
              </p>
              <p className="mt-1 text-sm text-fg-muted">
                El lote no aplica excepciones. Solo incluye solicitudes aceptadas,
                con documentos completos y pago validado.
              </p>
            </div>
          </div>
        </div>

        {excluded > 0 ? (
          <div className="rounded-lg border border-warning/30 bg-warning/10 px-4 py-3 text-sm text-warning-foreground">
            {excluded} registro{excluded === 1 ? "" : "s"} se excluirá
            {excluded === 1 ? "" : "n"} por estar pendiente, rechazado, ya inscrito
            o con requisitos incompletos.
          </div>
        ) : null}

        <label className="block space-y-1">
          <span className="text-xs font-medium text-fg-muted">Ciclo escolar</span>
          <select
            className="w-full rounded-lg border border-border bg-surface-elevated px-3 py-2 text-sm"
            value={academicYearId ?? ""}
            disabled={yearsLoading || submitting || !!result}
            onChange={(event) =>
              setAcademicYearId(
                event.target.value ? Number(event.target.value) : null
              )
            }
          >
            <option value="" disabled>
              Selecciona...
            </option>
            {years.map((year) => (
              <option key={year.id} value={year.id}>
                {year.description}
                {year.is_active ? " (activo)" : ""}
              </option>
            ))}
          </select>
        </label>

        {result ? (
          <section className="space-y-3" aria-live="polite">
            {result.id ? (
              <p className="text-xs text-fg-muted">Lote #{result.id}</p>
            ) : null}
            <div className="grid grid-cols-3 gap-2 text-center">
              <ResultStat label="Inscritos" value={result.converted} tone="success" />
              <ResultStat label="Omitidos" value={result.skipped} />
              <ResultStat label="Con error" value={result.failed} tone="danger" />
            </div>

            {failures.length > 0 ? (
              <div className="max-h-56 overflow-y-auto rounded-lg border border-danger/30">
                <ul className="divide-y divide-border text-sm">
                  {failures.map((failure) => (
                    <li key={failure.pre_enrollment_id} className="px-3 py-2">
                      <span className="font-mono text-xs text-fg-muted">
                        {failure.folio ?? `#${failure.pre_enrollment_id}`}
                      </span>
                      <p className="text-danger">{failure.message}</p>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </section>
        ) : null}
      </div>
    </Modal>
  );
}

function ResultStat({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone?: "success" | "danger";
}) {
  const toneClass =
    tone === "success"
      ? "text-success"
      : tone === "danger"
        ? "text-danger"
        : "text-foreground";

  return (
    <div className="rounded-lg border border-border bg-surface-elevated p-3">
      <p className={`text-2xl font-semibold ${toneClass}`}>{value}</p>
      <p className="text-xs text-fg-muted">{label}</p>
    </div>
  );
}
