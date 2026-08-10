import type {
  NfcReaderStatusItem,
  ReaderStatusData as NfcReaderStatusData,
} from '@/features/general-attendance/types/nfc-reader';

export interface CurrentStudent {
  id: number;
  credential_id: string;
  name: string;
  photo_url: string | null;
  gender?: string | null;
  grade: string;
  group: string;
  registered_at: string;
  reading_id?: number;
  event?: string;
  message?: string;
  type?: 'entry' | 'exit' | 'identify' | string;
  attendance_status?: string;
}

export interface CurrentData {
  credential_id?: string;
  event: string;
  message?: string;
  reader?: string;
  status: string;
  student?: CurrentStudent | null;
  timestamp: string;
}

/** @deprecated Prefer ReaderStatusData from @/features/general-attendance/types/nfc-reader */
export interface ReaderStatusData {
  event: 'reader_status_changed';
  connected: boolean;
  ready: boolean;
  readers: Array<string | NfcReaderStatusItem>;
  timestamp: string;
}

export type { NfcReaderStatusData };
