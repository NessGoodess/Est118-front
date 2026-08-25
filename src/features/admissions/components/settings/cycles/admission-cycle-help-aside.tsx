"use client";

import { IconByName } from "@/components/ui/icons";

export default function AdmissionCycleHelpAside() {
  return (
    <div className="space-y-4">
      <div className="bg-surface-elevated rounded-xl shadow-sm border p-4">
        <h3 className="font-medium text-foreground mb-3 flex items-center gap-2">
          <IconByName name="info" />
          Estados del periodo
        </h3>
        <div className="space-y-2">
          <LegendDot color="text-success" label="Activo — periodo en funcionamiento" />
          <LegendDot color="text-fg-muted" label="Borrador — configuración pendiente" />
          <LegendDot color="text-danger" label="Cerrado — no disponible para registro" />
        </div>
      </div>

      <div className="bg-primary-soft rounded-xl border border-border p-4">
        <h3 className="font-medium text-primary mb-2 flex items-center gap-2">
          <IconByName name="info" />
          Información importante
        </h3>
        <ul className="space-y-2 text-sm text-primary">
          <HelpItem>Solo puede haber un periodo activo a la vez</HelpItem>
          <HelpItem>
            Puede usar &quot;Crear y activar&quot; para publicar el periodo en un solo paso
          </HelpItem>
          <HelpItem>Los folios se reinician al activar un nuevo periodo</HelpItem>
          <HelpItem>Al reabrir un periodo, los folios continúan secuencialmente</HelpItem>
          <HelpItem>Los periodos expirados requieren nueva fecha de fin</HelpItem>
        </ul>
      </div>

      <div className="bg-surface-muted rounded-xl border border-border p-4">
        <h3 className="font-medium text-foreground mb-2">Buenas prácticas</h3>
        <div className="space-y-3 text-sm text-foreground">
          <div>
            <p className="font-medium">Antes de activar:</p>
            <p className="text-fg-muted">
              Verifique que las fechas sean correctas y no se solapen con otros periodos.
            </p>
          </div>
          <div>
            <p className="font-medium">Al cerrar:</p>
            <p className="text-fg-muted">
              Asegúrese de que no haya preinscripciones pendientes de procesar.
            </p>
          </div>
          <div>
            <p className="font-medium">Al reabrir:</p>
            <p className="text-fg-muted">
              Considere extender la fecha si el periodo ha expirado.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <IconByName name="verticalCommit" className={color} />
      <span className="text-sm text-foreground">{label}</span>
    </div>
  );
}

function HelpItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2">
      <span className="mt-1.5 inline-block h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
      <span>{children}</span>
    </li>
  );
}
