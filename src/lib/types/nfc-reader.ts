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

export interface ReaderStatusData {
  event: 'reader_status_changed';
  connected: boolean;
  ready: boolean;
  readers: NfcReaderStatusItem[];
  timestamp: string;
}

export interface NfcEventPayload extends CurrentData {
  reader_pcsc?: string;
  reader_slot_id?: number;
  reader_slot_code?: string;
  reader_label?: string;
  reader_audience?: NfcReaderAudience;
  reader_direction?: NfcReaderDirection;
  reader_armed?: boolean;
  student?: CurrentStudent | null;
}

export type PanelScanStatus = 'waiting' | 'scanning' | 'success' | 'warning' | 'error';
