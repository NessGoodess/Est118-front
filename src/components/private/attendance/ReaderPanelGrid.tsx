'use client';

import { useMemo } from 'react';
import { useMultiReaderEcho } from '@/contexts/MultiReaderEchoContext';
import ReaderPanel from '@/components/private/attendance/ReaderPanel';

export default function ReaderPanelGrid() {
  const { slots, readerStatus } = useMultiReaderEcho();

  const activeSlots = useMemo(
    () => [...slots].filter((s) => s.is_active).sort((a, b) => a.sort_order - b.sort_order),
    [slots]
  );

  const readerMap = useMemo(() => {
    const map = new Map<string, { connected: boolean; armed: boolean }>();
    for (const item of readerStatus.readers) {
      if (item.slot_code) {
        map.set(item.slot_code, { connected: item.connected, armed: item.armed });
      }
    }
    return map;
  }, [readerStatus.readers]);

  if (activeSlots.length === 0) {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-900">
        No hay paneles de lectura configurados. Ejecuta el seeder de slots NFC en el backend.
      </div>
    );
  }

  const gridCols =
    activeSlots.length >= 4
      ? 'xl:grid-cols-2'
      : activeSlots.length === 3
        ? 'lg:grid-cols-2 xl:grid-cols-3'
        : 'md:grid-cols-2';

  return (
    <div className={`grid grid-cols-1 gap-6 ${gridCols}`}>
      {activeSlots.map((slot) => {
        const reader = readerMap.get(slot.code);
        return (
          <ReaderPanel
            key={slot.code}
            slot={slot}
            connected={reader?.connected ?? readerStatus.connected}
            armed={slot.is_armed && (reader?.armed ?? true)}
          />
        );
      })}
    </div>
  );
}
