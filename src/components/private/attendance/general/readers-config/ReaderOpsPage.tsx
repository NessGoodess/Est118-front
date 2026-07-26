"use client";

import { useMultiReaderEcho } from "@/contexts/MultiReaderEchoContext";
import ReaderConfigPanel from "@/components/private/attendance/general/readers-config/ReaderConfigPanel";

export default function ReaderOpsPage() {
  const { refreshSlots } = useMultiReaderEcho();

  return (
    <div className="space-y-8">
      <ReaderConfigPanel onChanged={() => refreshSlots().catch(() => undefined)} />
    </div>
  );
}
