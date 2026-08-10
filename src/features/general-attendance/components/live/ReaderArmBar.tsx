'use client';

import { useMemo } from 'react';
import { Button } from '@/components/ui/Button';
import { useMultiReaderEcho } from '@/features/general-attendance/contexts/MultiReaderEchoContext';
import { liveConnectedPcscNames } from '@/features/general-attendance/utils/readerStatus';

export default function ReaderArmBar() {
  const { slots, readerStatus, armAll } = useMultiReaderEcho();
  const anyArmed = slots.some((s) => s.is_armed);

  const livePcsc = useMemo(
    () => new Set(liveConnectedPcscNames(readerStatus)),
    [readerStatus]
  );

  const connectedCount = slots.filter(
    (s) => s.is_active && s.pcsc_name && livePcsc.has(s.pcsc_name)
  ).length;
  const systemOnline = livePcsc.size > 0;

  return (
    <div className="hidden lg:flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mr-0 lg:mr-2">
      <div className="text-sm text-fg-muted bg-surface-elevated p-2 rounded-xl border border-border shadow-sm">
        <span className={`mr-2 inline-block h-2.5 w-2.5 rounded-full ${systemOnline ? 'bg-success/100' : 'bg-danger'}`} />
        <span className="font-semibold text-foreground">{connectedCount}</span> lector(es) conectado(s)
        <span className="mx-2 text-fg-muted">|</span>
        <span className="font-semibold text-foreground">{slots.filter((s) => s.is_armed).length}</span> panels activos
      </div>
      <div className="flex gap-2">
        <Button variant="secondary" onClick={() => armAll(false)} disabled={!anyArmed}>
          Pausar todos
        </Button>
        <Button onClick={() => armAll(true)}>Activar lecturas</Button>
      </div>
    </div>
  );
}
