import apiClient, { API_ENDPOINTS } from '@/lib/config/api';
import { NfcReaderSlot } from '@/lib/types/nfc-reader';

/**
 * Gets the list of NFC reader slots
 * @returns The list of NFC reader slots
 */
export async function getNfcReaderSlots(): Promise<NfcReaderSlot[]> {
  const response = await apiClient.get<{ success: boolean; data: NfcReaderSlot[] }>(
    API_ENDPOINTS.READER.SLOTS
  );
  return response.data.data ?? [];
}

/**
 * Arms or disarms an NFC reader slot
 * @param slotId The ID of the NFC reader slot
 * @param armed Whether to arm or disarm the slot
 * @returns The updated NFC reader slot
 */
export async function armNfcReaderSlot(slotId: number, armed: boolean): Promise<NfcReaderSlot> {
  const response = await apiClient.patch<{ success: boolean; data: NfcReaderSlot }>(
    API_ENDPOINTS.READER.SLOT_ARM(slotId),
    { armed }
  );
  return response.data.data;
}

/**
 * Arms or disarms all NFC reader slots
 * @param armed Whether to arm or disarm all slots
 * @returns The list of updated NFC reader slots
 */
export async function armAllNfcReaderSlots(armed: boolean): Promise<NfcReaderSlot[]> {
  const response = await apiClient.post<{ success: boolean; data: NfcReaderSlot[] }>(
    API_ENDPOINTS.READER.SLOTS_ARM_ALL,
    { armed }
  );
  return response.data.data ?? [];
}
