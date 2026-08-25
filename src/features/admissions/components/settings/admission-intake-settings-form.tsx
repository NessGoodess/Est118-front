"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/contexts/ToastContext";
import { useAdmissionIntakeSettings } from "@/features/admissions/hooks/use-admission-intake-settings";
import type {
  AdmissionIntakeSettings,
  ScoreMode,
  SeparationMode,
  SiblingDetection,
} from "@/features/admissions/types/intake-settings";
import { handleApiError } from "@/lib/api";
import { SkeletonBone } from "@/components/ui/skeleton/SectionSkeleton";
import { useAdmissionCapabilities } from "@/features/admissions/hooks/capabilities/useAdmissionCapabilities";

function Toggle({
  checked,
  onChange,
  label,
  hint,
  disabled = false,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  hint?: string;
  disabled?: boolean;
}) {
  return (
    <label className={`flex items-start gap-3 rounded-lg border border-border bg-surface-muted/50 px-3 py-3 ${disabled ? "cursor-default opacity-70" : "cursor-pointer"}`}>
      <input
        type="checkbox"
        className="mt-0.5"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span>
        <span className="block text-sm font-medium text-foreground">{label}</span>
        {hint ? <span className="mt-0.5 block text-xs text-fg-muted">{hint}</span> : null}
      </span>
    </label>
  );
}

function SelectField<T extends string>({
  label,
  value,
  onChange,
  options,
  disabled = false,
}: {
  label: string;
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
  disabled?: boolean;
}) {
  return (
    <label className="block space-y-1">
      <span className="text-xs font-medium text-fg-muted">{label}</span>
      <select
        className="w-full rounded-lg border border-border bg-surface-elevated px-3 py-2 text-sm text-foreground disabled:opacity-60"
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value as T)}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export default function AdmissionIntakeSettingsForm() {
  const { canEditEnrollment } = useAdmissionCapabilities();
  const { data, loading, saving, error, save } = useAdmissionIntakeSettings();
  const { showError, showSuccess } = useToast();
  const [form, setForm] = useState<AdmissionIntakeSettings | null>(null);

  useEffect(() => {
    if (data) setForm(data);
  }, [data]);

  useEffect(() => {
    if (error) showError("Error", error.message);
  }, [error, showError]);

  if (loading || !form) {
    return (
      <div className="space-y-3" aria-busy="true">
        <SkeletonBone className="h-24 w-full" />
        <SkeletonBone className="h-40 w-full" />
        <SkeletonBone className="h-40 w-full" />
      </div>
    );
  }

  const patch = <K extends keyof AdmissionIntakeSettings>(
    key: K,
    value: AdmissionIntakeSettings[K]
  ) => setForm((prev) => (prev ? { ...prev, [key]: value } : prev));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canEditEnrollment) return;
    try {
      await save(form);
      showSuccess("Guardado", "Política de ingreso actualizada.");
    } catch (err) {
      showError("Error", handleApiError(err).message);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <fieldset
        disabled={!canEditEnrollment}
        className="min-w-0 space-y-6 border-0 p-0 disabled:opacity-90"
      >
      <section className="space-y-3 rounded-xl border border-border bg-surface-elevated p-4 sm:p-5">
        <header>
          <h2 className="text-sm font-semibold text-foreground sm:text-base">
            Puntaje y asignación por lote
          </h2>
          <p className="mt-0.5 text-xs text-fg-muted">
            Define cómo se ordenan y colocan los nuevos ingresos en la corrida
            masiva de grupos.
          </p>
        </header>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <SelectField<ScoreMode>
            label="Fuente de puntaje"
            value={form.score_mode}
            onChange={(v) => patch("score_mode", v)}
            options={[
              { value: "school_average", label: "Promedio de procedencia" },
              { value: "exam", label: "Examen de admisión" },
              { value: "combined", label: "Combinado (examen + promedio)" },
            ]}
          />
          <SelectField<SeparationMode>
            label="Misma escuela de procedencia"
            value={form.separate_same_school}
            onChange={(v) => patch("separate_same_school", v)}
            options={[
              { value: "off", label: "No considerar" },
              { value: "soft", label: "Preferir separar (soft)" },
              { value: "hard", label: "Forzar separar (hard)" },
            ]}
          />
          <SelectField<SeparationMode>
            label="Hermanos / mismo tutor"
            value={form.separate_siblings}
            onChange={(v) => patch("separate_siblings", v)}
            options={[
              { value: "off", label: "No considerar" },
              { value: "soft", label: "Preferir separar (soft)" },
              { value: "hard", label: "Forzar separar (hard)" },
            ]}
          />
          <SelectField<SiblingDetection>
            label="Detección de hermanos"
            value={form.sibling_detection}
            onChange={(v) => patch("sibling_detection", v)}
            options={[
              { value: "guardian_curp", label: "CURP tutor (+ apellido)" },
              { value: "lastname_warn", label: "Solo apellido (aviso)" },
              { value: "linked_only", label: "Solo vínculos explícitos" },
            ]}
          />
        </div>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <Toggle
            checked={form.balance_load}
            onChange={(v) => patch("balance_load", v)}
            label="Balancear cupos"
            hint="Preferir grupos con menos alumnos."
          />
          <Toggle
            checked={form.balance_scores}
            onChange={(v) => patch("balance_scores", v)}
            label="Balancear rendimiento"
            hint="Evitar concentrar altos puntajes en un solo grupo."
          />
          <Toggle
            checked={form.require_score_before_placement}
            onChange={(v) => patch("require_score_before_placement", v)}
            label="Advertir si falta puntaje al asignar"
          />
          {form.score_mode === "combined" ? (
            <>
              <label className="block space-y-1">
                <span className="text-xs font-medium text-fg-muted">
                  Peso examen ({form.exam_weight.toFixed(2)})
                </span>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={form.exam_weight}
                  onChange={(e) => {
                    const exam = Number(e.target.value);
                    patch("exam_weight", exam);
                    patch("average_weight", Math.max(0, 1 - exam));
                  }}
                  className="w-full"
                />
              </label>
              <p className="text-xs text-fg-muted md:col-span-2">
                Promedio: {form.average_weight.toFixed(2)} · Examen:{" "}
                {form.exam_weight.toFixed(2)}
              </p>
            </>
          ) : null}
        </div>
      </section>

      <section className="space-y-3 rounded-xl border border-border bg-surface-elevated p-4 sm:p-5">
        <header>
          <h2 className="text-sm font-semibold text-foreground sm:text-base">
            Excepciones al inscribir (convertir)
          </h2>
          <p className="mt-0.5 text-xs text-fg-muted">
            Permite saltar requisitos solo si el staff marca la excepción en la
            conversión.
          </p>
        </header>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <Toggle
            checked={form.allow_convert_without_complete_docs}
            onChange={(v) => patch("allow_convert_without_complete_docs", v)}
            label="Permitir sin documentos completos"
          />
          <Toggle
            checked={form.allow_convert_without_complete_data}
            onChange={(v) => patch("allow_convert_without_complete_data", v)}
            label="Permitir sin datos mínimos completos"
          />
          <Toggle
            checked={form.allow_convert_without_payment}
            onChange={(v) => patch("allow_convert_without_payment", v)}
            label="Permitir sin pago validado"
          />
          <Toggle
            checked={form.require_exam_before_convert}
            onChange={(v) => patch("require_exam_before_convert", v)}
            label="Exigir examen antes de inscribir"
          />
        </div>
      </section>

      <section className="space-y-3 rounded-xl border border-border bg-surface-elevated p-4 sm:p-5">
        <header>
          <h2 className="text-sm font-semibold text-foreground sm:text-base">
            Ingresos tardíos y cambios de grupo
          </h2>
        </header>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <Toggle
            checked={form.late_intake_enabled}
            onChange={(v) => patch("late_intake_enabled", v)}
            label="Habilitar ingresos tardíos"
            hint="Fuera de la campaña principal."
          />
          <Toggle
            checked={form.late_requires_manual_group}
            onChange={(v) => patch("late_requires_manual_group", v)}
            label="Tardío exige elegir grupo"
            hint="Inscripción 1 a 1 con grupo manual."
          />
          <Toggle
            checked={form.late_suggest_group}
            onChange={(v) => patch("late_suggest_group", v)}
            label="Sugerir grupo en ingreso tardío"
          />
          <Toggle
            checked={form.late_lock_batch_rebalance}
            onChange={(v) => patch("late_lock_batch_rebalance", v)}
            label="No mover tardíos / ya colocados en el lote"
          />
          <Toggle
            checked={form.allow_manual_group_change}
            onChange={(v) => patch("allow_manual_group_change", v)}
            label="Permitir cambio manual de grupo después"
          />
        </div>
      </section>

      {canEditEnrollment ? (
        <div className="flex justify-end">
          <Button type="submit" loading={saving}>
            Guardar política
          </Button>
        </div>
      ) : (
        <p className="text-xs text-fg-muted">
          Solo consulta. No tienes permiso para editar la política de ingreso.
        </p>
      )}
      </fieldset>
    </form>
  );
}
