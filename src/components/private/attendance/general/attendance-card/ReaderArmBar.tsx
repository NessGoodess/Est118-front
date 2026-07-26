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
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="text-sm text-slate-600">
        <span className={`mr-2 inline-block h-2.5 w-2.5 rounded-full ${systemOnline ? 'bg-emerald-500' : 'bg-red-400'}`} />
        <span className="font-semibold text-slate-900">{connectedCount}</span> lector(es) conectado(s)
        <span className="mx-2 text-slate-300">|</span>
        <span className="font-semibold text-slate-900">{slots.filter((s) => s.is_armed).length}</span> activos
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
