"use client";

import { Button } from "@/components/ui/Button";
import { FloatingInput } from "@/components/ui/FloatingInputs";
import { IconByName } from "@/components/ui/icons";
import type { AcademicYearCreateFormState } from "@/features/academic-years/hooks/useAcademicYearsPanel";

type AcademicYearCreateFormProps = {
  form: AcademicYearCreateFormState;
  previewLabel: string | null;
  saving: boolean;
  onChange: (next: AcademicYearCreateFormState) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
};

export default function AcademicYearCreateForm({
  form,
  previewLabel,
  saving,
  onChange,
  onSubmit,
  onCancel,
}: AcademicYearCreateFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      <header className="space-y-1 border-b border-border pb-4">
        <h2 className="text-sm font-semibold text-foreground sm:text-base">
          Nuevo ciclo escolar
        </h2>
        <p className="text-xs text-fg-muted sm:text-sm">
          Indica el rango real del calendario. El nombre del ciclo se genera
          automáticamente.
        </p>
      </header>

      <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2">
        <FloatingInput
          label="Fecha de inicio"
          type="date"
          name="starts_on"
          required
          value={form.starts_on}
          onChange={(e) => onChange({ ...form, starts_on: e.target.value })}
          icon={<IconByName name="calendar" className="h-4 w-4" />}
          hideMessage
        />
        <FloatingInput
          label="Fecha de fin"
          type="date"
          name="ends_on"
          required
          value={form.ends_on}
          onChange={(e) => onChange({ ...form, ends_on: e.target.value })}
          icon={<IconByName name="calendar" className="h-4 w-4" />}
          hideMessage
        />
      </div>

      <div
        className={`flex items-start gap-3 rounded-lg border px-3 py-3 text-sm ${
          previewLabel
            ? "border-primary/25 bg-primary-soft text-primary"
            : "border-border bg-surface-muted text-fg-muted"
        }`}
      >
        <IconByName name="calendar" className="mt-0.5 h-4 w-4 shrink-0" />
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wide opacity-80">
            Nombre del ciclo
          </p>
          <p className="mt-0.5 font-semibold text-foreground">
            {previewLabel ?? "Selecciona inicio y fin para ver la etiqueta"}
          </p>
        </div>
      </div>

      <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-border bg-surface-muted/60 px-3 py-3 text-sm text-foreground">
        <input
          type="checkbox"
          className="mt-0.5"
          checked={form.generate_class_groups}
          onChange={(e) =>
            onChange({
              ...form,
              generate_class_groups: e.target.checked,
            })
          }
        />
        <span>
          <span className="font-medium">Generar grupos A–H</span>
          <span className="mt-0.5 block text-xs text-fg-muted">
            Crea los grupos estándar para 1°, 2° y 3° al guardar el ciclo.
          </span>
        </span>
      </label>

      <div className="flex justify-end gap-3 border-t border-border pt-4">
        <Button type="submit" variant="primary" size="md" loading={saving} disabled={!form.starts_on || !form.ends_on}>
          Crear ciclo
        </Button>
        <Button type="button" variant="secondary" size="md" onClick={onCancel}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}
