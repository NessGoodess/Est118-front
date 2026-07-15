'use client';

import { Button } from '@/components/ui/Button';
import { useMultiReaderEcho } from '@/contexts/MultiReaderEchoContext';

export default function ReaderArmBar() {
  const { slots, readerStatus, armAll } = useMultiReaderEcho();
  const anyArmed = slots.some((s) => s.is_armed);
  const connectedCount = readerStatus.readers.filter((r) => r.connected).length;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="text-sm text-slate-600">
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
