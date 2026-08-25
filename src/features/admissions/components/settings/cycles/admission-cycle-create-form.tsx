"use client";

import { Button } from "@/components/ui/Button";
import { InputDateTime, InputText } from "@/components/ui/forms";
import { IconByName } from "@/components/ui/icons";
import type { CreateAdmissionCyclePayload } from "@/features/admissions/types/settings";
import { toDatetimeLocal } from "@/features/admissions/hooks/use-admission-settings-form";

type AdmissionCycleCreateFormProps = {
  value: CreateAdmissionCyclePayload;
  creating: boolean;
  onChange: (value: CreateAdmissionCyclePayload) => void;
  onCancel: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onSaveDraft: () => void;
  onCreateAndActivate: () => void;
};

export default function AdmissionCycleCreateForm({
  value,
  creating,
  onChange,
  onSubmit,
  onCancel,
  onSaveDraft,
  onCreateAndActivate,
}: AdmissionCycleCreateFormProps) {
  return (
    <div className="bg-surface-elevated p-4 rounded-lg border border-border">
      <h3 className="font-medium mb-3 flex items-center gap-2">
        <IconByName name="calendar" />
        Crear nuevo periodo
      </h3>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">
            Nombre del periodo
          </label>
          <InputText
            required
            placeholder="Ej: Preinscripciones 2026"
            value={value.name}
            onChange={(e) => onChange({ ...value, name: e.target.value })}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Fecha inicio
            </label>
            <InputDateTime
              required
              value={toDatetimeLocal(value.start_at)}
              onChange={(e) => onChange({ ...value, start_at: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Fecha fin
            </label>
            <InputDateTime
              required
              value={toDatetimeLocal(value.end_at)}
              onChange={(e) => onChange({ ...value, end_at: e.target.value })}
            />
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="primary"
            loading={creating}
            loadingText="Creando..."
            onClick={onSaveDraft}
          >
            Guardar periodo
          </Button>
          <Button
            type="submit"
            variant="primary"
            loading={creating}
            loadingText="Procesando..."
            className="bg-success/10 hover:bg-success/30 text-success border border-success"
            onClick={onCreateAndActivate}
          >
            Crear y activar
          </Button>
        </div>
      </form>
    </div>
  );
}
