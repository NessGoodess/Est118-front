export interface CurrentStudent {
  id: number;
  credential_id: string;
  name: string;
  photo_url: string;
  grade: string;
  group: string;
  registered_at: string;
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

/** Payload when the NFC reader connects or disconnects (broadcast by backend). */
export interface ReaderStatusData {
  event: 'reader_status_changed';
  connected: boolean;
  ready: boolean;
  readers: string[];
  timestamp: string;
}