import type { NfcReaderAudience } from "@/features/general-attendance/types/nfc-reader";

export const NFC_AUDIENCE_LABELS: Record<NfcReaderAudience, string> = {
  boys: "Niños",
  girls: "Niñas",
  mixed: "Mixto",
};

export function shortPcscName(name: string | null): string {
  if (!name) return "Sin asignar";
  if (name.length <= 42) return name;
  return `${name.slice(0, 20)}…${name.slice(-18)}`;
}
