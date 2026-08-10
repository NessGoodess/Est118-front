"use client";

import { Button } from "@/components/ui/Button";
import type {
  NfcPairingSession,
  NfcReaderAudience,
  NfcReaderSlot,
} from "@/features/general-attendance/types/nfc-reader";
import {
  NFC_AUDIENCE_LABELS,
  shortPcscName,
} from "@/features/general-attendance/utils/readerConfig";

type ReaderConfigTableProps = {
  slots: NfcReaderSlot[];
  pairing: NfcPairingSession | null;
  savingId: number | null;
  pcscOptions: string[];
  freePcsc: string[];
  onAudienceChange: (slot: NfcReaderSlot, audience: NfcReaderAudience) => void;
  onActiveChange: (slot: NfcReaderSlot, isActive: boolean) => void;
  onPcscChange: (slot: NfcReaderSlot, pcscName: string) => void;
  onStartPairing: (slot: NfcReaderSlot) => void;
  onRelease: (slot: NfcReaderSlot) => void;
};

function PcscSelect({
  slot,
  slots,
  pcscOptions,
  freePcsc,
  busy,
  pairing,
  onPcscChange,
}: {
  slot: NfcReaderSlot;
  slots: NfcReaderSlot[];
  pcscOptions: string[];
  freePcsc: string[];
  busy: boolean;
  pairing: NfcPairingSession | null;
  onPcscChange: (slot: NfcReaderSlot, pcscName: string) => void;
}) {
  return (
    <>
      <select
        aria-label={`PC/SC ${slot.label}`}
        className="w-full max-w-md rounded-lg border border-border bg-surface-elevated px-2 py-1.5 text-sm"
        value={slot.pcsc_name ?? ""}
        disabled={busy || Boolean(pairing)}
        title={slot.pcsc_name ?? undefined}
        onChange={(e) => onPcscChange(slot, e.target.value)}
      >
        <option value="">Sin asignar</option>
        {pcscOptions.map((name) => {
          const owner = slots.find(
            (s) => s.id !== slot.id && s.pcsc_name === name
          );
          return (
            <option key={name} value={name}>
              {shortPcscName(name)}
              {owner
                ? ` · ahora en ${owner.label}`
                : freePcsc.includes(name)
                  ? " · libre"
                  : ""}
            </option>
          );
        })}
      </select>
      {slot.pcsc_name ? (
        <p
          className="mt-1 max-w-md break-all text-[11px] text-fg-muted"
          title={slot.pcsc_name}
        >
          {slot.pcsc_name}
        </p>
      ) : null}
    </>
  );
}

function VisibleToggle({
  slot,
  busy,
  onActiveChange,
}: {
  slot: NfcReaderSlot;
  busy: boolean;
  onActiveChange: (slot: NfcReaderSlot, isActive: boolean) => void;
}) {
  return (
    <label className="inline-flex cursor-pointer items-center gap-2 text-sm">
      <input
        type="checkbox"
        className="h-4 w-4 rounded border-border accent-primary"
        checked={slot.is_active}
        disabled={busy}
        aria-label={`Mostrar ${slot.label} en pase de lista`}
        onChange={(e) => onActiveChange(slot, e.target.checked)}
      />
      <span className={slot.is_active ? "text-foreground" : "text-fg-muted"}>
        {slot.is_active ? "Visible" : "Oculto"}
      </span>
    </label>
  );
}

export default function ReaderConfigTable({
  slots,
  pairing,
  savingId,
  pcscOptions,
  freePcsc,
  onAudienceChange,
  onActiveChange,
  onPcscChange,
  onStartPairing,
  onRelease,
}: ReaderConfigTableProps) {
  return (
    <>
      {/* Mobile: cards */}
      <div className="space-y-3 md:hidden">
        {slots.map((slot) => {
          const busy = savingId === slot.id;
          const isPairingTarget = pairing?.slot_id === slot.id;
          return (
            <article
              key={slot.id}
              className={`rounded-xl border border-border bg-surface-elevated p-4 shadow-sm ${
                isPairingTarget ? "ring-2 ring-primary/40" : ""
              } ${slot.is_active ? "" : "opacity-75"}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-medium text-foreground">{slot.label}</p>
                  <p className="text-xs text-fg-muted">{slot.code}</p>
                </div>
                <VisibleToggle
                  slot={slot}
                  busy={busy}
                  onActiveChange={onActiveChange}
                />
              </div>

              <div className="mt-3 space-y-3">
                <div>
                  <p className="mb-1 text-xs font-medium uppercase tracking-wide text-fg-muted">
                    Audiencia
                  </p>
                  <select
                    aria-label={`Audiencia ${slot.label}`}
                    className="w-full rounded-lg border border-border bg-surface-elevated px-2 py-1.5 text-sm"
                    value={slot.audience}
                    disabled={busy}
                    onChange={(e) =>
                      onAudienceChange(
                        slot,
                        e.target.value as NfcReaderAudience
                      )
                    }
                  >
                    {(
                      Object.keys(NFC_AUDIENCE_LABELS) as NfcReaderAudience[]
                    ).map((key) => (
                      <option key={key} value={key}>
                        {NFC_AUDIENCE_LABELS[key]}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <p className="mb-1 text-xs font-medium uppercase tracking-wide text-fg-muted">
                    Lector PC/SC
                  </p>
                  <PcscSelect
                    slot={slot}
                    slots={slots}
                    pcscOptions={pcscOptions}
                    freePcsc={freePcsc}
                    busy={busy}
                    pairing={pairing}
                    onPcscChange={onPcscChange}
                  />
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    disabled={busy || Boolean(pairing && !isPairingTarget)}
                    onClick={() => onStartPairing(slot)}
                  >
                    {isPairingTarget
                      ? "Esperando tarjeta…"
                      : "Emparejar"}
                  </Button>
                  {slot.pcsc_name ? (
                    <Button
                      size="sm"
                      variant="secondary"
                      disabled={busy || Boolean(pairing)}
                      onClick={() => onRelease(slot)}
                    >
                      Liberar
                    </Button>
                  ) : null}
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* Desktop: table */}
      <div className="hidden overflow-x-auto rounded-xl border border-border bg-surface-elevated shadow-sm md:block">
        <table className="min-w-full text-sm">
          <thead className="bg-surface-muted text-left text-xs uppercase tracking-wide text-fg-muted">
            <tr>
              <th className="px-4 py-3 font-semibold">Panel</th>
              <th className="px-4 py-3 font-semibold">En pase de lista</th>
              <th className="px-4 py-3 font-semibold">Audiencia</th>
              <th className="px-4 py-3 font-semibold">Lector PC/SC</th>
              <th className="px-4 py-3 font-semibold">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {slots.map((slot) => {
              const busy = savingId === slot.id;
              const isPairingTarget = pairing?.slot_id === slot.id;
              return (
                <tr
                  key={slot.id}
                  className={`border-t border-border ${
                    isPairingTarget ? "bg-primary-soft/60" : ""
                  } ${slot.is_active ? "" : "bg-surface-muted/40"}`}
                >
                  <td className="px-2 xl:px-4 py-3">
                    <p className="font-medium text-foreground">{slot.label}</p>
                    <p className="text-xs text-fg-muted">{slot.code}</p>
                  </td>
                  <td className="px-2 xl:px-4 py-3">
                    <VisibleToggle
                      slot={slot}
                      busy={busy}
                      onActiveChange={onActiveChange}
                    />
                  </td>
                  <td className="px-2 xl:px-4 py-3">
                    <select
                      aria-label={`Audiencia ${slot.label}`}
                      className="rounded-lg border border-border bg-surface-elevated px-2 py-1.5 text-sm"
                      value={slot.audience}
                      disabled={busy}
                      onChange={(e) =>
                        onAudienceChange(
                          slot,
                          e.target.value as NfcReaderAudience
                        )
                      }
                    >
                      {(
                        Object.keys(NFC_AUDIENCE_LABELS) as NfcReaderAudience[]
                      ).map((key) => (
                        <option key={key} value={key}>
                          {NFC_AUDIENCE_LABELS[key]}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="min-w-[220px] px-2 xl:px-4 py-3">
                    <PcscSelect
                      slot={slot}
                      slots={slots}
                      pcscOptions={pcscOptions}
                      freePcsc={freePcsc}
                      busy={busy}
                      pairing={pairing}
                      onPcscChange={onPcscChange}
                    />
                  </td>
                  <td className="px-2 xl:px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        disabled={
                          busy || Boolean(pairing && !isPairingTarget)
                        }
                        onClick={() => onStartPairing(slot)}
                      >
                        {isPairingTarget
                          ? "Esperando..."
                          : "Emparejar"}
                      </Button>
                      {slot.pcsc_name ? (
                        <Button
                          size="sm"
                          variant="secondary"
                          disabled={busy || Boolean(pairing)}
                          onClick={() => onRelease(slot)}
                        >
                          Liberar
                        </Button>
                      ) : null}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
