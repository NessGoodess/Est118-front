'use client';

import { useMemo } from 'react';
import { useMultiReaderEcho } from '@/contexts/MultiReaderEchoContext';
import ReaderPanel from '@/components/private/attendance/general/attendance-card/ReaderPanel';
import { useReaderFullscreen } from '@/hooks/useReaderFullscreen';
import { Button } from '@/components/ui/Button';
import { IconByName } from '@/components/ui/icons/attendenceCard.icons';

export default function ReaderPanelGrid() {
  const { slots, readerStatus } = useMultiReaderEcho();
  const { mode, isFullscreen, enterAll, enterSlot, exit } = useReaderFullscreen();

  const activeSlots = useMemo(
    () => [...slots].filter((s) => s.is_active).sort((a, b) => a.sort_order - b.sort_order),
    [slots]
  );

  // Connected = current slot.pcsc_name is in the live USB list (not stale readers[].connected).
  const livePcsc = useMemo(() => {
    const names = new Set<string>();
    for (const name of readerStatus.connected_pcsc ?? []) {
      if (name) names.add(name);
    }
    for (const item of readerStatus.readers ?? []) {
      if (typeof item === 'string') {
        names.add(item);
      } else if (item.pcsc_name && item.connected) {
        names.add(item.pcsc_name);
      }
    }
    return names;
  }, [readerStatus.connected_pcsc, readerStatus.readers]);

  const isSlotConnected = (pcscName: string | null) =>
    Boolean(pcscName && livePcsc.has(pcscName));

  if (activeSlots.length === 0) {
    return (
      <div className="rounded-xl border border-warning/30 bg-warning/10 p-6 text-sm text-warning-foreground">
        <p className="font-medium">No hay paneles NFC activos</p>
        <p className="mt-1 opacity-90">
          Ve a la pestaña <strong>Lectores</strong> para activar paneles o asignar
          lectores físicos PC/SC.
        </p>
      </div>
    );
  }

  const visibleSlots =
    mode !== 'none' && mode !== 'all'
      ? activeSlots.filter((slot) => slot.code === mode)
      : activeSlots;

  const gridCols =
    visibleSlots.length === 1
      ? 'grid-cols-1'
      : visibleSlots.length >= 4
        ? 'xl:grid-cols-2'
        : visibleSlots.length === 3
          ? 'lg:grid-cols-2 xl:grid-cols-3'
          : 'md:grid-cols-2';

  const panels = (
    <div className={`grid grid-cols-1 gap-6 ${gridCols} ${isFullscreen ? 'h-full content-stretch' : ''}`}>
      {visibleSlots.map((slot) => (
        <ReaderPanel
          key={slot.code}
          slot={slot}
          connected={isSlotConnected(slot.pcsc_name)}
          armed={slot.is_armed}
          compact={isFullscreen}
          onRequestFullscreen={isFullscreen ? undefined : enterSlot}
        />
      ))}
    </div>
  );

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-end gap-2">
        {!isFullscreen && (
          <Button
            size="sm"
            variant="secondary"
            leftIcon={<IconByName name="fullscreen" className="w-4 h-4" />}
            onClick={enterAll}
          >
            Pantalla completa
          </Button>
        )}
      </div>

      {isFullscreen ? (
        <div className="fixed inset-0 z-50 flex flex-col bg-surface-app p-4 sm:p-6">
          <div className="mb-4 flex items-center justify-between gap-3 text-white">
            <div>
              <p className="font-semibold">
                {mode === 'all' ? 'Monitoreo de lectores' : visibleSlots[0]?.label ?? 'Lector'}
              </p>
              <p className="text-xs text-fg-muted">Esc para salir</p>
            </div>
            <div className="flex gap-2">
              {mode !== 'all' && activeSlots.length > 1 && (
                <Button size="sm" variant="secondary" onClick={enterAll}>
                  Ver todos
                </Button>
              )}
              <Button
                size="sm"
                variant="secondary"
                leftIcon={<IconByName name="exit" className="w-4 h-4" />}
                onClick={exit}
              >
                Salir
              </Button>
            </div>
          </div>
          <div className="min-h-0 flex-1 overflow-auto">{panels}</div>
        </div>
      ) : (
        panels
      )}
    </div>
  );
}
