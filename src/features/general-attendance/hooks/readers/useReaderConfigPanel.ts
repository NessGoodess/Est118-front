"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useMultiReaderEcho } from "@/features/general-attendance/contexts/MultiReaderEchoContext";
import apiClient, { API_ENDPOINTS } from "@/lib/api";
import {
  cancelNfcReaderPairing,
  getNfcReaderConfig,
  startNfcReaderPairing,
  updateNfcReaderSlot,
} from "@/features/general-attendance/services/nfc-reader.service";
import type {
  NfcPairingSession,
  NfcReaderSlot,
} from "@/features/general-attendance/types/nfc-reader";
import { shortPcscName } from "@/features/general-attendance/utils/readerConfig";
import {
  isNfcStatusFresh,
  liveConnectedPcscNames,
} from "@/features/general-attendance/utils/readerStatus";
import { globalToast } from "@/lib/toast";

type UseReaderConfigPanelOptions = {
  onChanged?: () => void;
  pollMs?: number;
};

export function useReaderConfigPanel({
  onChanged,
  pollMs = 4000,
}: UseReaderConfigPanelOptions = {}) {
  const { readerStatus } = useMultiReaderEcho();
  const [slots, setSlots] = useState<NfcReaderSlot[]>([]);
  const [connectedPcsc, setConnectedPcsc] = useState<string[]>([]);
  const [unboundPcsc, setUnboundPcsc] = useState<string[]>([]);
  const [pairing, setPairing] = useState<NfcPairingSession | null>(null);
  const [statusTimestamp, setStatusTimestamp] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<number | null>(null);

  const load = useCallback(async ({ quiet = false }: { quiet?: boolean } = {}) => {
    try {
      const [data, statusRes] = await Promise.all([
        getNfcReaderConfig(),
        apiClient.get(API_ENDPOINTS.READER.STATUS).catch(() => null),
      ]);

      const statusPcsc: string[] = Array.isArray(statusRes?.data?.connected_pcsc)
        ? statusRes!.data.connected_pcsc
        : [];
      const fromConfig = data.connected_pcsc ?? [];
      const ts =
        statusRes?.data?.timestamp ??
        data.status?.timestamp ??
        null;
      const rawLive = statusPcsc.length > 0 ? statusPcsc : fromConfig;
      const liveList = isNfcStatusFresh(ts) ? rawLive : [];

      setSlots(data.slots);
      setConnectedPcsc(liveList);
      setStatusTimestamp(isNfcStatusFresh(ts) ? ts : null);
      setUnboundPcsc(
        isNfcStatusFresh(ts)
          ? Array.isArray(statusRes?.data?.unbound_pcsc)
            ? statusRes!.data.unbound_pcsc
            : (data.unbound_pcsc ?? [])
          : []
      );
      setPairing(data.pairing ?? statusRes?.data?.pairing ?? null);
    } catch {
      if (!quiet) {
        globalToast.error(
          "Error al cargar",
          "No se pudo cargar la configuración de lectores."
        );
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load().catch(() => undefined);
    const timer = window.setInterval(() => {
      load({ quiet: true }).catch(() => undefined);
    }, pollMs);
    return () => window.clearInterval(timer);
  }, [load, pollMs]);

  useEffect(() => {
    if (!readerStatus.timestamp) return;
    if (!isNfcStatusFresh(readerStatus.timestamp)) {
      setConnectedPcsc([]);
      setUnboundPcsc([]);
      setStatusTimestamp(null);
      return;
    }

    setStatusTimestamp(readerStatus.timestamp);
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

  const liveConnected = useMemo(() => {
    const fromEcho = liveConnectedPcscNames(readerStatus);
    if (fromEcho.length > 0) return fromEcho;
    if (isNfcStatusFresh(statusTimestamp)) return connectedPcsc;
    return [];
  }, [readerStatus, statusTimestamp, connectedPcsc]);

  const pcscOptions = useMemo(() => {
    const bound = slots.map((s) => s.pcsc_name).filter(Boolean) as string[];
    return Array.from(new Set([...liveConnected, ...bound])).sort();
  }, [liveConnected, slots]);

  const freePcsc = useMemo(() => {
    if (!isNfcStatusFresh(readerStatus.timestamp ?? statusTimestamp)) {
      return [];
    }
    return readerStatus.unbound_pcsc ?? unboundPcsc;
  }, [readerStatus.timestamp, readerStatus.unbound_pcsc, statusTimestamp, unboundPcsc]);

  const applyUpdate = useCallback(
    async (
      slotId: number,
      payload: Parameters<typeof updateNfcReaderSlot>[1],
      okMessage?: string
    ) => {
      setSavingId(slotId);
      try {
        await updateNfcReaderSlot(slotId, payload);
        await load({ quiet: true });
        onChanged?.();
        if (okMessage) {
          globalToast.success("Lectores", okMessage);
        }
      } catch {
        globalToast.error(
          "Error al guardar",
          "No se pudo guardar el cambio del lector."
        );
      } finally {
        setSavingId(null);
      }
    },
    [load, onChanged]
  );

  const startPairing = useCallback(
    async (slot: NfcReaderSlot) => {
      setSavingId(slot.id);
      try {
        const data = await startNfcReaderPairing(slot.id, true);
        setPairing(data.pairing);
        globalToast.success(
          "Emparejando",
          `Acerca una credencial en el lector de “${slot.label}” (2 min).`
        );
        await load({ quiet: true });
        onChanged?.();
      } catch {
        globalToast.error(
          "Error de emparejamiento",
          "No se pudo iniciar el emparejamiento."
        );
      } finally {
        setSavingId(null);
      }
    },
    [load, onChanged]
  );

  const cancelPairing = useCallback(async () => {
    try {
      await cancelNfcReaderPairing();
      setPairing(null);
      globalToast.success("Emparejamiento", "Cancelado.");
      await load({ quiet: true });
    } catch {
      globalToast.error(
        "Error de emparejamiento",
        "No se pudo cancelar el emparejamiento."
      );
    }
  }, [load]);

  const assignPcsc = useCallback(
    (slot: NfcReaderSlot, pcscName: string) =>
      applyUpdate(
        slot.id,
        { pcsc_name: pcscName || null },
        pcscName
          ? `${slot.label} → ${shortPcscName(pcscName)}`
          : `Liberado ${slot.label}`
      ),
    [applyUpdate]
  );

  const releasePcsc = useCallback(
    (slot: NfcReaderSlot) =>
      applyUpdate(slot.id, { pcsc_name: null }, `Liberado ${slot.label}`),
    [applyUpdate]
  );

  return {
    slots,
    pairing,
    loading,
    savingId,
    pcscOptions,
    freePcsc,
    connectedCount: liveConnected.length,
    reload: () => load(),
    applyUpdate,
    startPairing,
    cancelPairing,
    assignPcsc,
    releasePcsc,
  };
}
