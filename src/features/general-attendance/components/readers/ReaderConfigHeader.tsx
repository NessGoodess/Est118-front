"use client";

import { Button } from "@/components/ui/Button";
import type { NfcPairingSession } from "@/features/general-attendance/types/nfc-reader";

type ReaderConfigHeaderProps = {
  pairing: NfcPairingSession | null;
  connectedCount: number;
  freeCount: number;
  onReload: () => void;
  onCancelPairing: () => void;
};

export default function ReaderConfigHeader({
  pairing,
  connectedCount,
  freeCount,
  onReload,
  onCancelPairing,
}: ReaderConfigHeaderProps) {
  return (
    <div className="rounded-xl border border-border bg-surface-elevated p-4 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-sm lg:text-base font-semibold text-foreground">
            Configuración de lectores
          </h3>
          <p className="mt-1 text-xs lg:text-sm text-fg-muted">
            Asigna el lector NFC exacto o usa <strong>Emparejar</strong> y acerca una
            tarjeta en ese lector físico.
          </p>
        </div>
        <Button size="sm" variant="secondary" onClick={onReload}>
          Actualizar
        </Button>
      </div>

      <div className="mt-4 flex flex-wrap gap-3 text-xs text-fg-muted">
        <span className="rounded-full bg-surface-muted px-2.5 py-1">
          Conectados (USB): <strong>{connectedCount}</strong>
        </span>
        <span className="rounded-full bg-warning/10 px-2.5 py-1 text-warning-foreground">
          Sin panel: <strong>{freeCount}</strong>
        </span>
        {pairing ? (
          <span className="rounded-full bg-primary-soft px-2.5 py-1 text-primary">
            Emparejando: {pairing.slot_label}
          </span>
        ) : null}
      </div>

      {connectedCount === 0 ? (
        <p className="mt-3 rounded-lg border border-warning/30 bg-warning/10 px-3 py-2 text-sm text-warning-foreground">
          No hay lectores USB en vivo. Arranque el servicio NFC-Reader y conecte
          los lectores (o pulse Actualizar). Los nombres ya asignados en la tabla
          pueden seguir apareciendo aunque estén offline.
        </p>
      ) : null}

      {pairing ? (
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border bg-primary-soft px-3 py-2 text-sm text-brand-strong">
          <p>
            Acerca una credencial en el lector de{" "}
            <strong>{pairing.slot_label}</strong>…
          </p>
          <Button size="sm" variant="secondary" onClick={onCancelPairing}>
            Cancelar
          </Button>
        </div>
      ) : null}
    </div>
  );
}
