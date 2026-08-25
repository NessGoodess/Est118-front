"use client";

import { Button } from "@/components/ui/Button";
import { InputDateTime } from "@/components/ui/forms";
import { IconByName } from "@/components/ui/icons";
import type { AdmissionCycle } from "@/features/admissions/types/settings";
import { toDatetimeLocal } from "@/features/admissions/hooks/use-admission-settings-form";

type AdmissionCycleReopenPanelProps = {
  cycle: AdmissionCycle;
  endDate: string;
  onEndDateChange: (value: string) => void;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function AdmissionCycleReopenPanel({
  cycle,
  endDate,
  onEndDateChange,
  onConfirm,
  onCancel,
}: AdmissionCycleReopenPanelProps) {
  return (
    <div className="bg-warning/10 p-4 rounded-lg border border-warning/30">
      <h3 className="font-medium text-warning-foreground mb-2 flex items-center gap-2">
        <IconByName name="alert" />
        Periodo expirado — extender fecha
      </h3>
      <p className="text-sm text-warning-foreground mb-4">
        El periodo <strong>{cycle.name}</strong> ha expirado. Para reabrirlo,
        debe proporcionar una nueva fecha de fin.
      </p>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">
            Nueva fecha de fin
          </label>
          <InputDateTime
            required
            value={toDatetimeLocal(endDate)}
            onChange={(e) => onEndDateChange(e.target.value)}
          />
        </div>
        <div className="flex gap-2 justify-end">
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancelar
          </Button>
          <Button
            type="button"
            variant="primary"
            disabled={!endDate}
            onClick={onConfirm}
          >
            Reabrir con nueva fecha
          </Button>
        </div>
      </div>
    </div>
  );
}
