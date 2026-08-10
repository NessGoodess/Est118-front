"use client";

import type { DailyAttendanceRules } from "@/features/general-attendance/types/general-attendance";
import { useAttendanceRulesForm } from "@/features/general-attendance/hooks/settings/useAttendanceRulesForm";
import { Button } from "@/components/ui/Button";
import { FloatingInput } from "@/components/ui/FloatingInputs";
import { IconByName } from "@/components/ui/icons";
import { SkeletonBone } from "@/components/ui/skeleton/SectionSkeleton";

type AttendanceRulesFormProps = {
  onSuccess?: (rules: DailyAttendanceRules) => void;
  submitLabel?: string;
};

function AttendanceRulesFormSkeleton() {
  return (
    <div
      className="animate-pulse space-y-3"
      aria-busy="true"
      aria-label="Cargando horarios"
    >
      <div className="grid min-w-0 grid-cols-1 gap-x-4 gap-y-4 rounded-lg border border-border bg-surface-elevated p-4 2xl:grid-cols-2 2xl:gap-y-5">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonBone key={i} className="h-12 w-full rounded-xl" />
        ))}
        <div className="space-y-3 2xl:col-span-2">
          <SkeletonBone className="h-12 w-full rounded-xl" />
          <SkeletonBone className="h-12 w-full rounded-lg" />
        </div>
      </div>
      <div className="flex justify-end pt-1">
        <SkeletonBone className="h-10 w-36" />
      </div>
    </div>
  );
}

export default function AttendanceRulesForm({
  onSuccess,
  submitLabel = "Guardar cambios",
}: AttendanceRulesFormProps) {
  const { form, loading, saving, previewLate, onChange, onSubmit } =
    useAttendanceRulesForm({ onSuccess });

  if (loading) {
    return <AttendanceRulesFormSkeleton />;
  }

  return (
    <>
      <div className="border-x border-t border-border rounded-t-lg bg-surface-elevated px-4 pt-4 pb-1">
        <h3 className="text-sm lg:text-base font-semibold text-foreground">Horarios</h3>
        <p className="mt-1 text-xs lg:text-sm text-fg-muted">
          Entrada, tolerancia, cierre de ventana y salida más temprana para el
          pase NFC.
        </p>
      </div>
      <form onSubmit={onSubmit} className="space-y-3" noValidate>
        <div className="grid min-w-0 grid-cols-1 items-start gap-x-4 gap-y-4 p-4 2xl:grid-cols-2 2xl:gap-y-5 [&_label]:whitespace-nowrap 
        bg-surface-elevated border-x border-b border-border rounded-b-lg">
          <FloatingInput
            label="Hora de entrada"
            type="time"
            name="entry_time"
            required
            value={form.entry_time}
            onChange={onChange("entry_time")}
            icon={<IconByName name="clock" className="h-4 w-4" />}
            hideMessage
          />

          <FloatingInput
            label="Tolerancia (minutos)"
            type="number"
            name="tolerance_minutes"
            min={0}
            max={180}
            required
            value={form.tolerance_minutes}
            onChange={onChange("tolerance_minutes")}
            icon={<IconByName name="timer" className="h-4 w-4" />}
            hideMessage
          />

          <FloatingInput
            label="Cierre ventana de entrada"
            type="time"
            name="entry_window_closes_at"
            required
            value={form.entry_window_closes_at}
            onChange={onChange("entry_window_closes_at")}
            helperText="Después de esta hora, falta."
            icon={<IconByName name="calendar" className="h-4 w-4" />}
            hideMessage
          />

          <FloatingInput
            label="Salida más temprana"
            type="time"
            name="exit_earliest"
            required
            value={form.exit_earliest}
            onChange={onChange("exit_earliest")}
            icon={<IconByName name="clock" className="h-4 w-4" />}
            hideMessage
          />

          <div className="min-w-0 2xl:col-span-2">
            <FloatingInput
              label="Zona horaria"
              type="text"
              name="timezone"
              value={form.timezone}
              readOnly
              icon={<IconByName name="globe" className="h-4 w-4" />}
              hideMessage
            />

            <div className="mt-2 rounded-lg bg-primary-soft p-2 text-xs text-primary">
              Retardo a partir de: <strong>{previewLate}</strong> (entrada +
              tolerancia)
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-1">
          <Button type="submit" variant="primary" disabled={saving}>
            {saving ? "Guardando…" : submitLabel}
          </Button>
        </div>
      </form>
    </>
  );
}
