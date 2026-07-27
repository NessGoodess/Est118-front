import apiClient, { API_ENDPOINTS } from '@/lib/api';
import {
  NfcPairingSession,
  NfcReaderConfigData,
  NfcReaderSlot,
} from '@/lib/types/nfc-reader';

export async function getNfcReaderSlots(includeInactive = false): Promise<NfcReaderSlot[]> {
  const response = await apiClient.get<{ success: boolean; data: NfcReaderSlot[] }>(
    API_ENDPOINTS.READER.SLOTS,
    { params: includeInactive ? { include_inactive: 1 } : undefined }
  );
  return response.data.data ?? [];
}

export async function getNfcReaderConfig(): Promise<NfcReaderConfigData> {
  const response = await apiClient.get<{ success: boolean; data: NfcReaderConfigData }>(
    API_ENDPOINTS.READER.CONFIG
  );
  return response.data.data;
}

export type UpdateNfcReaderSlotPayload = Partial<
  Pick<NfcReaderSlot, 'label' | 'pcsc_name' | 'is_active' | 'sort_order' | 'audience' | 'direction'>
>;

export async function updateNfcReaderSlot(
  slotId: number,
  payload: UpdateNfcReaderSlotPayload
): Promise<NfcReaderSlot> {
  const response = await apiClient.patch<{ success: boolean; data: NfcReaderSlot }>(
    API_ENDPOINTS.READER.SLOT(slotId),
    payload
  );
  return response.data.data;
}

export async function startNfcReaderPairing(
  slotId: number,
  clearExisting = true
): Promise<{ pairing: NfcPairingSession; slot: NfcReaderSlot }> {
  const response = await apiClient.post<{
    success: boolean;
    data: { pairing: NfcPairingSession; slot: NfcReaderSlot };
  }>(API_ENDPOINTS.READER.SLOT_START_PAIRING(slotId), { clear_existing: clearExisting });
  return response.data.data;
}

export async function cancelNfcReaderPairing(): Promise<void> {
  await apiClient.post(API_ENDPOINTS.READER.SLOTS_CANCEL_PAIRING);
}

export async function armNfcReaderSlot(slotId: number, armed: boolean): Promise<NfcReaderSlot> {
  const response = await apiClient.patch<{ success: boolean; data: NfcReaderSlot }>(
    API_ENDPOINTS.READER.SLOT_ARM(slotId),
    { armed }
  );
  return response.data.data;
}

export async function armAllNfcReaderSlots(armed: boolean): Promise<NfcReaderSlot[]> {
  const response = await apiClient.post<{ success: boolean; data: NfcReaderSlot[] }>(
    API_ENDPOINTS.READER.SLOTS_ARM_ALL,
    { armed }
  );
  return response.data.data ?? [];
}
