'use client';

import { useMemo } from 'react';
import { Button } from '@/components/ui/Button';
import { useMultiReaderEcho } from '@/contexts/MultiReaderEchoContext';

export default function ReaderArmBar() {
  const { slots, readerStatus, armAll } = useMultiReaderEcho();
  const anyArmed = slots.some((s) => s.is_armed);

  const livePcsc = useMemo(() => {
    const names = new Set<string>();
    for (const name of readerStatus.connected_pcsc ?? []) {
      if (name) names.add(name);
    }
    for (const item of readerStatus.readers ?? []) {
      if (typeof item === 'string') names.add(item);
      else if (item.pcsc_name && item.connected) names.add(item.pcsc_name);
    }
    return names;
  }, [readerStatus.connected_pcsc, readerStatus.readers]);

  const connectedCount = slots.filter(
    (s) => s.is_active && s.pcsc_name && livePcsc.has(s.pcsc_name)
  ).length;
  const systemOnline = livePcsc.size > 0 || (readerStatus.connected && readerStatus.ready);

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-xl border border-border bg-surface-elevated p-4 shadow-sm">
      <div className="text-sm text-fg-muted">
        <span className={`mr-2 inline-block h-2.5 w-2.5 rounded-full ${systemOnline ? 'bg-success/100' : 'bg-danger'}`} />
        <span className="font-semibold text-foreground">{connectedCount}</span> lector(es) conectado(s)
        <span className="mx-2 text-fg-muted">|</span>
        <span className="font-semibold text-foreground">{slots.filter((s) => s.is_armed).length}</span> activos
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
