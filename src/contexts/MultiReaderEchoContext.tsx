'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { useEcho } from '@/hooks/echo/useEcho';
import { useEchoConnection } from '@/hooks/echo/useEchoConnection';
import apiClient, { API_ENDPOINTS } from '@/lib/api';
import { armAllNfcReaderSlots, armNfcReaderSlot, getNfcReaderSlots } from '@/lib/services/nfc-reader.service';
import {
  NfcEventPayload,
  NfcReaderSlot,
  PanelScanStatus,
  ReaderStatusData,
} from '@/lib/types/nfc-reader';
import { CurrentStudent } from '@/lib/types/echo';

export interface PanelState {
  scanStatus: PanelScanStatus;
  displayStudent: CurrentStudent | null;
  lastMessage: string | null;
}

type PanelListener = (payload: NfcEventPayload) => void;

interface MultiReaderEchoContextValue {
  slots: NfcReaderSlot[];
  readerStatus: ReaderStatusData;
  panelStates: Record<string, PanelState>;
  isConnected: boolean;
  isLoading: boolean;
  hasError: boolean;
  registerPanel: (slotCode: string, listener: PanelListener) => () => void;
  refreshSlots: () => Promise<void>;
  armAll: (armed: boolean) => Promise<void>;
  armSlot: (slotId: number, armed: boolean) => Promise<void>;
}

const INITIAL_READER_STATUS: ReaderStatusData = {
  event: 'reader_status_changed',
  connected: false,
  ready: false,
  readers: [],
  timestamp: '',
};

const DEFAULT_PANEL_STATE: PanelState = {
  scanStatus: 'waiting',
  displayStudent: null,
  lastMessage: null,
};

const MultiReaderEchoContext = createContext<MultiReaderEchoContextValue | undefined>(undefined);

function normalizeReaderStatus(data: Partial<ReaderStatusData>): ReaderStatusData {
  const readers = (data.readers ?? []).map((item) => {
    if (typeof item === 'string') {
      return {
        pcsc_name: item,
        connected: true,
        label: item,
        armed: true,
      };
    }
    return item;
  });

  return {
    event: 'reader_status_changed',
    connected: data.connected ?? false,
    ready: data.ready ?? false,
    readers,
    connected_pcsc: data.connected_pcsc ?? [],
    unbound_pcsc: data.unbound_pcsc ?? [],
    pairing: data.pairing ?? null,
    timestamp: data.timestamp ?? '',
  };
}

export function MultiReaderEchoProvider({ children }: { children: ReactNode }) {
  const [slots, setSlots] = useState<NfcReaderSlot[]>([]);
  const [readerStatus, setReaderStatus] = useState<ReaderStatusData>(INITIAL_READER_STATUS);
  const [panelStates, setPanelStates] = useState<Record<string, PanelState>>({});
  const listenersRef = useRef<Map<string, Set<PanelListener>>>(new Map());

  const { isConnected, isLoading, hasError } = useEchoConnection();

  const refreshSlots = useCallback(async () => {
    const list = await getNfcReaderSlots();
    setSlots(list);
    setPanelStates((prev) => {
      const next = { ...prev };
      for (const slot of list) {
        if (!next[slot.code]) {
          next[slot.code] = { ...DEFAULT_PANEL_STATE };
        }
      }
      return next;
    });
  }, []);

  useEffect(() => {
    refreshSlots().catch(() => undefined);
  }, [refreshSlots]);

  useEffect(() => {
    apiClient
      .get<ReaderStatusData>(API_ENDPOINTS.READER.STATUS)
      .then(({ data }) => setReaderStatus(normalizeReaderStatus(data)))
      .catch(() => undefined);
  }, []);

  const registerPanel = useCallback((slotCode: string, listener: PanelListener) => {
    if (!listenersRef.current.has(slotCode)) {
      listenersRef.current.set(slotCode, new Set());
    }
    listenersRef.current.get(slotCode)!.add(listener);
    return () => {
      listenersRef.current.get(slotCode)?.delete(listener);
    };
  }, []);

  const updatePanelState = useCallback((slotCode: string, patch: Partial<PanelState>) => {
    setPanelStates((prev) => ({
      ...prev,
      [slotCode]: { ...(prev[slotCode] ?? DEFAULT_PANEL_STATE), ...patch },
    }));
  }, []);

  const routeToPanel = useCallback(
    (payload: NfcEventPayload) => {
      const slotCode =
        payload.reader_slot_code ??
        (slots.length === 1 ? slots[0].code : 'default');

      if (!slotCode) return;

      listenersRef.current.get(slotCode)?.forEach((fn) => fn(payload));

      if (payload.event === 'card_inserted') {
        if ((payload.status === 'ok' || payload.status === 'info') && payload.student) {
          updatePanelState(slotCode, {
            scanStatus: payload.status === 'ok' ? 'success' : 'info',
            displayStudent: payload.student,
            lastMessage: payload.message ?? null,
          });
        } else if (payload.status === 'warning') {
          updatePanelState(slotCode, {
            scanStatus: 'warning',
            displayStudent: payload.student ?? null,
            lastMessage: payload.message ?? null,
          });
        } else {
          updatePanelState(slotCode, { scanStatus: 'scanning' });
          setTimeout(() => {
            updatePanelState(slotCode, { scanStatus: 'waiting' });
          }, 600);
        }
      }

      if (payload.event === 'card_removed') {
        updatePanelState(slotCode, { scanStatus: 'waiting' });
      }
    },
    [slots, updatePanelState]
  );

  const handleMessage = useCallback(
    (data: unknown) => {
      const payload = data as NfcEventPayload;
      if (payload.event === 'reader_status_changed') {
        setReaderStatus(normalizeReaderStatus(payload as ReaderStatusData));
        refreshSlots().catch(() => undefined);
        return;
      }
      routeToPanel(payload);
    },
    [routeToPanel, refreshSlots]
  );

  useEcho('credential-read-channel', '.credential-read-event', handleMessage);

  const armAll = useCallback(async (armed: boolean) => {
    const updated = await armAllNfcReaderSlots(armed);
    setSlots(updated);
  }, []);

  const armSlot = useCallback(async (slotId: number, armed: boolean) => {
    const updated = await armNfcReaderSlot(slotId, armed);
    setSlots((prev) => prev.map((slot) => (slot.id === updated.id ? updated : slot)));
  }, []);

  const value = useMemo(
    () => ({
      slots,
      readerStatus,
      panelStates,
      isConnected,
      isLoading,
      hasError,
      registerPanel,
      refreshSlots,
      armAll,
      armSlot,
    }),
    [
      slots,
      readerStatus,
      panelStates,
      isConnected,
      isLoading,
      hasError,
      registerPanel,
      refreshSlots,
      armAll,
      armSlot,
    ]
  );

  return (
    <MultiReaderEchoContext.Provider value={value}>{children}</MultiReaderEchoContext.Provider>
  );
}

export function useMultiReaderEcho() {
  const ctx = useContext(MultiReaderEchoContext);
  if (!ctx) {
    throw new Error('useMultiReaderEcho must be used within MultiReaderEchoProvider');
  }
  return ctx;
}
