import { CurrentStudent, CurrentData } from '@/lib/types/echo';

export type NfcReaderAudience = 'boys' | 'girls' | 'mixed';
export type NfcReaderDirection = 'entry' | 'exit' | 'both';

export interface NfcReaderSlot {
  id: number;
  code: string;
  label: string;
  audience: NfcReaderAudience;
  direction: NfcReaderDirection;
  sort_order: number;
  pcsc_name: string | null;
  is_active: boolean;
  is_armed: boolean;
  last_seen_at: string | null;
}

export interface NfcReaderStatusItem {
  pcsc_name: string | null;
  connected: boolean;
  slot_id?: number;
  slot_code?: string;
  label: string;
  audience?: NfcReaderAudience;
  direction?: NfcReaderDirection;
  armed: boolean;
}

export interface NfcPairingSession {
  slot_id: number;
  slot_code: string;
  slot_label: string;
  started_at: string;
  expires_at: string;
}

export interface ReaderStatusData {
  event: 'reader_status_changed';
  connected: boolean;
  ready: boolean;
  readers: NfcReaderStatusItem[];
  connected_pcsc?: string[];
  unbound_pcsc?: string[];
  pairing?: NfcPairingSession | null;
  timestamp: string;
}

export interface NfcReaderConfigData {
  slots: NfcReaderSlot[];
  status: ReaderStatusData;
  connected_pcsc: string[];
  unbound_pcsc: string[];
  pairing: NfcPairingSession | null;
}

export interface NfcEventPayload extends CurrentData {
  reader_pcsc?: string;
  reader_slot_id?: number;
  reader_slot_code?: string;
  reader_label?: string;
  reader_audience?: NfcReaderAudience;
  reader_direction?: NfcReaderDirection;
  reader_armed?: boolean;
  pairing_completed?: boolean;
  student?: CurrentStudent | null;
}

export type PanelScanStatus = 'waiting' | 'scanning' | 'success' | 'info' | 'warning' | 'error';
