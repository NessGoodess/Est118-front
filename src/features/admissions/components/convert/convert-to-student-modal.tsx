"use client";

import { useEffect, useMemo, useState } from "react";
import Modal from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/contexts/ToastContext";
import { useAcademicYears } from "@/features/academic-years";
import { useAdmissionIntakeSettings } from "@/features/admissions/hooks/use-admission-intake-settings";
import {
  getFirstGradeGroups,
  type FirstGradeGroupOption,
} from "@/features/admissions/services/first-grade-groups.service";
import type { ConvertStudentPayload } from "@/features/admissions/types/intake-settings";
import { convertPreEnrollmentToStudent } from "@/features/admissions/services/admissions.service";
import { handleApiError } from "@/lib/api";
import { randomUuid } from "@/lib/utils/random-uuid";

export type ConvertPreEnrollmentTarget = {
  id: number;
  folio?: string;
  status?: string | null;
  documents_status?: string | null;
  payment_status?: string | null;
  previous_school?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  curp?: string | null;
};

type Props = {
  open: boolean;
  target: ConvertPreEnrollmentTarget | null;
  onClose: () => void;
  onConverted: () => void;
};

export default function ConvertToStudentModal({
  open,
  target,
  onClose,
  onConverted,
}: Props) {
  const { showError, showSuccess } = useToast();
  const { data: settings, loading: settingsLoading } =
    useAdmissionIntakeSettings();
  const { data: years, loading: yearsLoading } = useAcademicYears();

  const [channel, setChannel] = useState<"campaign" | "late">("campaign");
  const [academicYearId, setAcademicYearId] = useState<number | null>(null);
  const [classGroupId, setClassGroupId] = useState<number | null>(null);
  const [groups, setGroups] = useState<FirstGradeGroupOption[]>([]);
  const [groupsLoading, setGroupsLoading] = useState(false);
  const [forceDocs, setForceDocs] = useState(false);
  const [forceData, setForceData] = useState(false);
  const [forcePay, setForcePay] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const docsOk = target?.documents_status === "complete";
  const payOk = target?.payment_status === "validated";
  const trackDataCompleteness =
    typeof target?.previous_school === "string" ||
    typeof target?.first_name === "string";
  const dataOk =
    !trackDataCompleteness ||
    Boolean(
      target?.first_name?.trim() &&
        target?.last_name?.trim() &&
        target?.curp?.trim() &&
        target?.previous_school?.trim()
    );

  useEffect(() => {
    if (!open) return;
    setChannel("campaign");
    setForceDocs(false);
    setForceData(false);
    setForcePay(false);
    setClassGroupId(null);
    const active = years.find((y) => y.is_active) ?? years[0];
    setAcademicYearId(active?.id ?? null);
  }, [open, target?.id, years]);

  useEffect(() => {
    if (!open || !academicYearId) {
      setGroups([]);
      return;
    }
    let cancelled = false;
    setGroupsLoading(true);
    getFirstGradeGroups(academicYearId)
      .then((rows) => {
        if (!cancelled) {
          setGroups(rows);
          const least = [...rows].sort(
            (a, b) => a.active_count - b.active_count
          )[0];
          if (channel === "late" && settings?.late_suggest_group && least) {
            setClassGroupId(least.id);
          }
        }
      })
      .catch((err) => {
        if (!cancelled) showError("Error", handleApiError(err).message);
      })
      .finally(() => {
        if (!cancelled) setGroupsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [
    open,
    academicYearId,
    channel,
    settings?.late_suggest_group,
    showError,
  ]);

  const lateEnabled = settings?.late_intake_enabled ?? false;
  const lateNeedsGroup = settings?.late_requires_manual_group ?? true;

  const canSubmit = useMemo(() => {
    if (!target) return false;
    if (target.status !== "in_review") return false;
    if (!docsOk && !(settings?.allow_convert_without_complete_docs && forceDocs))
      return false;
    if (!payOk && !(settings?.allow_convert_without_payment && forcePay))
      return false;
    if (!dataOk && !(settings?.allow_convert_without_complete_data && forceData))
      return false;
    if (channel === "late") {
      if (!lateEnabled) return false;
      if (lateNeedsGroup && !classGroupId) return false;
    }
    return true;
  }, [
    target,
    docsOk,
    payOk,
    dataOk,
    settings,
    forceDocs,
    forcePay,
    forceData,
    channel,
    lateEnabled,
    lateNeedsGroup,
    classGroupId,
  ]);

  const handleSubmit = async () => {
    if (!target || !canSubmit) return;
    setSubmitting(true);
    try {
      const payload: ConvertStudentPayload = {
        channel,
        academic_year_id: academicYearId ?? undefined,
        class_group_id: classGroupId ?? undefined,
        force_incomplete_docs: forceDocs || undefined,
        force_incomplete_data: forceData || undefined,
        force_without_payment: forcePay || undefined,
      };
      const result = await convertPreEnrollmentToStudent(
        target.id,
        payload,
        randomUuid()
      );
      const extras =
        result.exception_flags && result.exception_flags.length > 0
          ? ` Excepciones: ${result.exception_flags.join(", ")}.`
          : "";
      showSuccess(
        "Inscripción creada",
        `Canal: ${result.admission_channel ?? channel} · Estado: ${
          result.placement_status ?? "—"
        }.${extras}`
      );
      onConverted();
      onClose();
    } catch (err) {
      showError("No se pudo inscribir", handleApiError(err).message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={open}
      onClose={onClose}
      title="Inscribir aspirante"
      maxWidth="lg"
      footerActions
      footerActionsContent={
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={onClose} disabled={submitting}>
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            loading={submitting}
            disabled={!canSubmit || settingsLoading || yearsLoading}
          >
            Confirmar inscripción
          </Button>
        </div>
      }
    >
      {!target ? null : (
        <div className="space-y-4 bg-surface-elevated rounded-lg p-4 border border-border shadow-sm">
          <p className="text-sm text-fg-muted">
            Folio{" "}
            <span className="font-mono font-medium text-foreground">
              {target.folio ?? target.id}
            </span>
            . Revisa canal, excepciones y grupo antes de crear al alumno.
          </p>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <label className="block space-y-1">
              <span className="text-xs font-medium text-fg-muted">Canal</span>
              <select
                className="w-full rounded-lg border border-border bg-surface-elevated px-3 py-2 text-sm"
                value={channel}
                onChange={(e) =>
                  setChannel(e.target.value as "campaign" | "late")
                }
              >
                <option value="campaign">Campaña (lote / provisional)</option>
                <option value="late" disabled={!lateEnabled}>
                  Ingreso tardío {lateEnabled ? "" : "(deshabilitado)"}
                </option>
              </select>
            </label>

            <label className="block space-y-1">
              <span className="text-xs font-medium text-fg-muted">
                Ciclo escolar
              </span>
              <select
                className="w-full rounded-lg border border-border bg-surface-elevated px-3 py-2 text-sm"
                value={academicYearId ?? ""}
                onChange={(e) =>
                  setAcademicYearId(
                    e.target.value ? Number(e.target.value) : null
                  )
                }
              >
                {years.map((y) => (
                  <option key={y.id} value={y.id}>
                    {y.description}
                    {y.is_active ? " (activo)" : ""}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {(channel === "late" || channel === "campaign") && (
            <label className="block space-y-1">
              <span className="text-xs font-medium text-fg-muted">
                Grupo 1°
                {channel === "late" && lateNeedsGroup
                  ? " (obligatorio)"
                  : " (opcional)"}
              </span>
              <select
                className="w-full rounded-lg border border-border bg-surface-elevated px-3 py-2 text-sm"
                value={classGroupId ?? ""}
                disabled={groupsLoading || !academicYearId}
                onChange={(e) =>
                  setClassGroupId(
                    e.target.value ? Number(e.target.value) : null
                  )
                }
              >
                <option value="">
                  {channel === "campaign"
                    ? "Provisional (prioridad A)"
                    : "Selecciona grupo"}
                </option>
                {groups.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.label} · {g.active_count} alumnos
                  </option>
                ))}
              </select>
            </label>
          )}

          <div className="space-y-2 rounded-lg border border-border bg-surface-muted/40 p-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-fg-muted">
              Excepciones
            </p>
            {!docsOk ? (
              <label className="flex items-start gap-2 text-sm">
                <input
                  type="checkbox"
                  className="mt-0.5"
                  checked={forceDocs}
                  disabled={!settings?.allow_convert_without_complete_docs}
                  onChange={(e) => setForceDocs(e.target.checked)}
                />
                <span>
                  Inscribir sin documentos completos
                  {!settings?.allow_convert_without_complete_docs ? (
                    <span className="block text-xs text-danger">
                      Deshabilitado en política de ingreso.
                    </span>
                  ) : null}
                </span>
              </label>
            ) : null}
            {!payOk ? (
              <label className="flex items-start gap-2 text-sm">
                <input
                  type="checkbox"
                  className="mt-0.5"
                  checked={forcePay}
                  disabled={!settings?.allow_convert_without_payment}
                  onChange={(e) => setForcePay(e.target.checked)}
                />
                <span>
                  Inscribir sin pago validado
                  {!settings?.allow_convert_without_payment ? (
                    <span className="block text-xs text-danger">
                      Deshabilitado en política de ingreso.
                    </span>
                  ) : null}
                </span>
              </label>
            ) : null}
            {!dataOk ? (
              <label className="flex items-start gap-2 text-sm">
                <input
                  type="checkbox"
                  className="mt-0.5"
                  checked={forceData}
                  disabled={!settings?.allow_convert_without_complete_data}
                  onChange={(e) => setForceData(e.target.checked)}
                />
                <span>
                  Inscribir con datos mínimos incompletos
                  {!settings?.allow_convert_without_complete_data ? (
                    <span className="block text-xs text-danger">
                      Deshabilitado en política de ingreso.
                    </span>
                  ) : null}
                </span>
              </label>
            ) : null}
            {docsOk && payOk && dataOk ? (
              <p className="text-xs text-fg-muted">
                Requisitos básicos cumplidos. No se requieren excepciones.
              </p>
            ) : null}
          </div>
        </div>
      )}
    </Modal>
  );
}
