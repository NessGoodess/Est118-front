"use client";

import ReaderConfigHeader from "@/features/general-attendance/components/readers/ReaderConfigHeader";
import ReaderConfigTable from "@/features/general-attendance/components/readers/ReaderConfigTable";
import ReaderConfigSkeleton from "@/features/general-attendance/components/skeletons/ReaderConfigSkeleton";
import { useMultiReaderEcho } from "@/features/general-attendance/contexts/MultiReaderEchoContext";
import { useReaderConfigPanel } from "@/features/general-attendance/hooks/readers/useReaderConfigPanel";

export default function ReaderConfigPanel() {
  const { refreshSlots } = useMultiReaderEcho();
  const {
    slots,
    pairing,
    loading,
    savingId,
    pcscOptions,
    freePcsc,
    connectedCount,
    reload,
    applyUpdate,
    startPairing,
    cancelPairing,
    assignPcsc,
    releasePcsc,
  } = useReaderConfigPanel({
    onChanged: () => refreshSlots().catch(() => undefined),
  });

  if (loading && slots.length === 0) {
    return <ReaderConfigSkeleton />;
  }

  return (
    <div className="space-y-4">
      <ReaderConfigHeader
        pairing={pairing}
        connectedCount={connectedCount}
        freeCount={freePcsc.length}
        onReload={() => reload()}
        onCancelPairing={cancelPairing}
      />

      <ReaderConfigTable
        slots={slots}
        pairing={pairing}
        savingId={savingId}
        pcscOptions={pcscOptions}
        freePcsc={freePcsc}
        onAudienceChange={(slot, audience) =>
          applyUpdate(slot.id, { audience })
        }
        onActiveChange={(slot, isActive) =>
          applyUpdate(
            slot.id,
            { is_active: isActive },
            isActive
              ? `${slot.label} visible en pase de lista`
              : `${slot.label} oculto en pase de lista`
          )
        }
        onPcscChange={assignPcsc}
        onStartPairing={startPairing}
        onRelease={releasePcsc}
      />

      {freePcsc.length > 0 ? (
        <div className="rounded-xl border border-warning/30 bg-warning/10 p-4 text-sm text-warning-foreground">
          <p className="font-medium">Lectores conectados sin panel</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            {freePcsc.map((name) => (
              <li key={name} className="break-all">
                {name}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
