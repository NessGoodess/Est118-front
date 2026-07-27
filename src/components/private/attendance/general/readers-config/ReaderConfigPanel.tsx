"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { useMultiReaderEcho } from "@/contexts/MultiReaderEchoContext";
import apiClient, { API_ENDPOINTS } from "@/lib/api";
import {
  cancelNfcReaderPairing,
  getNfcReaderConfig,
  startNfcReaderPairing,
  updateNfcReaderSlot,
} from "@/lib/services/nfc-reader.service";
import {
  NfcPairingSession,
  NfcReaderAudience,
  NfcReaderSlot,
} from "@/lib/types/nfc-reader";

const AUDIENCE_LABELS: Record<NfcReaderAudience, string> = {
  boys: "Niños",
  girls: "Niñas",
  mixed: "Mixto",
};

function shortPcsc(name: string | null): string {
  if (!name) return "Sin asignar";
  if (name.length <= 42) return name;
  return `${name.slice(0, 20)}…${name.slice(-18)}`;
}

export default function ReaderConfigPanel({ onChanged }: { onChanged?: () => void }) {
  const { readerStatus } = useMultiReaderEcho();
  const [slots, setSlots] = useState<NfcReaderSlot[]>([]);
  const [connectedPcsc, setConnectedPcsc] = useState<string[]>([]);
  const [unboundPcsc, setUnboundPcsc] = useState<string[]>([]);
  const [pairing, setPairing] = useState<NfcPairingSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const [data, statusRes] = await Promise.all([
        getNfcReaderConfig(),
        apiClient.get(API_ENDPOINTS.READER.STATUS).catch(() => null),
      ]);

      const statusPcsc: string[] = Array.isArray(statusRes?.data?.connected_pcsc)
        ? statusRes!.data.connected_pcsc
        : [];
      const fromConfig = data.connected_pcsc ?? [];
      // Prefer the freshest live list; do not accumulate stale USB names.
      const liveList = statusPcsc.length > 0 ? statusPcsc : fromConfig;

      setSlots(data.slots);
      setConnectedPcsc(liveList);
      setUnboundPcsc(
        Array.isArray(statusRes?.data?.unbound_pcsc)
          ? statusRes!.data.unbound_pcsc
          : (data.unbound_pcsc ?? [])
      );
      setPairing(data.pairing ?? statusRes?.data?.pairing ?? null);
      setError(null);
    } catch {
      setError("No se pudo cargar la configuración de lectores.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load().catch(() => undefined);
    const timer = window.setInterval(() => {
      load().catch(() => undefined);
    }, 4000);
    return () => window.clearInterval(timer);
  }, [load]);

  // Echo: replace (do not accumulate) so disconnects clear the select.
  useEffect(() => {
    if (!readerStatus.timestamp) return;

    if (Array.isArray(readerStatus.connected_pcsc)) {
      setConnectedPcsc(readerStatus.connected_pcsc);
    }
    if (Array.isArray(readerStatus.unbound_pcsc)) {
      setUnboundPcsc(readerStatus.unbound_pcsc);
    }
    if (readerStatus.pairing !== undefined) {
      setPairing(readerStatus.pairing ?? null);
    }
  }, [
    readerStatus.timestamp,
    readerStatus.connected_pcsc,
    readerStatus.unbound_pcsc,
    readerStatus.pairing,
  ]);

  const pcscOptions = useMemo(() => {
    const bound = slots.map((s) => s.pcsc_name).filter(Boolean) as string[];
    const live = readerStatus.connected_pcsc?.length
      ? readerStatus.connected_pcsc
      : connectedPcsc;
    return Array.from(new Set([...live, ...bound])).sort();
  }, [connectedPcsc, readerStatus.connected_pcsc, slots]);

  const freePcsc = readerStatus.unbound_pcsc ?? unboundPcsc;

  const applyUpdate = async (
    slotId: number,
    payload: Parameters<typeof updateNfcReaderSlot>[1],
    okMessage?: string
  ) => {
    setSavingId(slotId);
    setMessage(null);
    setError(null);
    try {
      await updateNfcReaderSlot(slotId, payload);
      await load();
      onChanged?.();
      if (okMessage) setMessage(okMessage);
    } catch {
      setError("No se pudo guardar el cambio del lector.");
    } finally {
      setSavingId(null);
    }
  };

  const handleStartPairing = async (slot: NfcReaderSlot) => {
    setSavingId(slot.id);
    setError(null);
    setMessage(null);
    try {
      const data = await startNfcReaderPairing(slot.id, true);
      setPairing(data.pairing);
      setMessage(
        `Emparejando “${slot.label}”. Acerca una credencial en el lector físico correcto (2 min).`
      );
      await load();
      onChanged?.();
    } catch {
      setError("No se pudo iniciar el emparejamiento.");
    } finally {
      setSavingId(null);
    }
  };

  const handleCancelPairing = async () => {
    try {
      await cancelNfcReaderPairing();
      setPairing(null);
      setMessage("Emparejamiento cancelado.");
      await load();
    } catch {
      setError("No se pudo cancelar el emparejamiento.");
    }
  };

  if (loading && slots.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-600">
        Cargando configuración de lectores…
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Configuración de lectores</h3>
            <p className="mt-1 text-sm text-slate-600">
              Solo hay dos paneles (Niños / Niñas). Entrada y salida las define el horario, no el
              lector. Asigna el PC/SC exacto o usa <strong>Emparejar</strong> y acerca una tarjeta
              en ese lector físico.
            </p>
          </div>
          <Button size="sm" variant="secondary" onClick={() => load()}>
            Actualizar
          </Button>
        </div>

        <div className="mt-4 flex flex-wrap gap-3 text-xs text-slate-600">
          <span className="rounded-full bg-slate-100 px-2.5 py-1">
            Conectados: <strong>{pcscOptions.length}</strong>
          </span>
          <span className="rounded-full bg-amber-50 px-2.5 py-1 text-amber-900">
            Sin panel: <strong>{freePcsc.length}</strong>
          </span>
          {pairing && (
            <span className="rounded-full bg-blue-50 px-2.5 py-1 text-blue-900">
              Emparejando: {pairing.slot_label}
            </span>
          )}
        </div>

        {pcscOptions.length === 0 && (
          <p className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-950">
            No hay nombres PC/SC todavía. Conecta el lector, espera ~10–30 s (o pulsa Actualizar).
            Si sigue vacío, revisa que el servicio NFC-Reader esté enviando status al API.
          </p>
        )}

        {message && (
          <p className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-900">
            {message}
          </p>
        )}
        {error && (
          <p className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
            {error}
          </p>
        )}

        {pairing && (
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-sm text-blue-950">
            <p>
              Acerca una credencial en el lector de <strong>{pairing.slot_label}</strong>…
            </p>
            <Button size="sm" variant="secondary" onClick={handleCancelPairing}>
              Cancelar
            </Button>
          </div>
        )}
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3 font-semibold">Panel</th>
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
                  className={`border-t border-slate-100 ${isPairingTarget ? "bg-blue-50/60" : ""}`}
                >
                  <td className="px-4 py-3">
                    <p className="font-medium text-slate-900">{slot.label}</p>
                    <p className="text-xs text-slate-500">{slot.code}</p>
                  </td>
                  <td className="px-4 py-3">
                    <select
                      aria-label={`Audiencia ${slot.label}`}
                      className="rounded-lg border border-slate-300 px-2 py-1.5 text-sm"
                      value={slot.audience}
                      disabled={busy}
                      onChange={(e) =>
                        applyUpdate(slot.id, {
                          audience: e.target.value as NfcReaderAudience,
                        })
                      }
                    >
                      {(Object.keys(AUDIENCE_LABELS) as NfcReaderAudience[]).map((key) => (
                        <option key={key} value={key}>
                          {AUDIENCE_LABELS[key]}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3 min-w-[240px]">
                    <select
                      aria-label={`PC/SC ${slot.label}`}
                      className="w-full max-w-md rounded-lg border border-slate-300 px-2 py-1.5 text-sm"
                      value={slot.pcsc_name ?? ""}
                      disabled={busy || Boolean(pairing)}
                      title={slot.pcsc_name ?? undefined}
                      onChange={(e) =>
                        applyUpdate(
                          slot.id,
                          { pcsc_name: e.target.value || null },
                          e.target.value
                            ? `${slot.label} → ${shortPcsc(e.target.value)}`
                            : `Liberado ${slot.label}`
                        )
                      }
                    >
                      <option value="">Sin asignar</option>
                      {pcscOptions.map((name) => {
                        const owner = slots.find(
                          (s) => s.id !== slot.id && s.pcsc_name === name
                        );
                        return (
                          <option key={name} value={name}>
                            {shortPcsc(name)}
                            {owner
                              ? ` · ahora en ${owner.label}`
                              : freePcsc.includes(name)
                                ? " · libre"
                                : ""}
                          </option>
                        );
                      })}
                    </select>
                    {slot.pcsc_name && (
                      <p
                        className="mt-1 max-w-md break-all text-[11px] text-slate-400"
                        title={slot.pcsc_name}
                      >
                        {slot.pcsc_name}
                      </p>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        disabled={busy || Boolean(pairing && !isPairingTarget)}
                        onClick={() => handleStartPairing(slot)}
                      >
                        {isPairingTarget ? "Esperando tarjeta…" : "Emparejar con tarjeta"}
                      </Button>
                      {slot.pcsc_name && (
                        <Button
                          size="sm"
                          variant="secondary"
                          disabled={busy || Boolean(pairing)}
                          onClick={() =>
                            applyUpdate(slot.id, { pcsc_name: null }, `Liberado ${slot.label}`)
                          }
                        >
                          Liberar
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {freePcsc.length > 0 && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">
          <p className="font-medium">Lectores conectados sin panel</p>
          <p className="mt-1 text-xs opacity-80">
            Elígelos en el dropdown o usa Emparejar y acerca una tarjeta en ese lector.
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            {freePcsc.map((name) => (
              <li key={name} className="break-all">
                {name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
