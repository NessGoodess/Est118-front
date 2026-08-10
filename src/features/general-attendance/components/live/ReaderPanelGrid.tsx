'use client';

import { useEffect, useMemo, useState } from 'react';
import { useMultiReaderEcho } from '@/features/general-attendance/contexts/MultiReaderEchoContext';
import ReaderPanel from './ReaderPanel';
import { useReaderFullscreen } from '@/features/general-attendance/hooks/useReaderFullscreen';
import { liveConnectedPcscNames } from '@/features/general-attendance/utils/readerStatus';
import { Button } from '@/components/ui/Button';
import { IconByName } from '@/components/ui/icons/attendenceCard.icons';
import ReaderPanelGridSkeleton from '@/features/general-attendance/components/skeletons/ReaderPanelGridSkeleton';

function useLandscape() {
  const [landscape, setLandscape] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia('(orientation: landscape)');
    const sync = () => setLandscape(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  return landscape;
}

/** Kiosk: fill screen without scroll. Ops: responsive columns. */
function gridLayoutClass(count: number, isKiosk: boolean, landscape: boolean) {
  if (!isKiosk) {
    if (count === 1) return 'grid-cols-1 auto-rows-[minmax(min(52vh,480px),auto)]';
    return 'grid-cols-1 md:grid-cols-2 auto-rows-[minmax(min(52vh,480px),auto)]';
  }

  // Fullscreen kiosk — equal cells, no fixed min-heights
  if (count === 1) return 'h-full grid-cols-1 grid-rows-1';
  if (count === 2) {
    return landscape
      ? 'h-full grid-cols-2 grid-rows-1'
      : 'h-full grid-cols-1 grid-rows-2';
  }
  if (count === 3) {
    return landscape
      ? 'h-full grid-cols-3 grid-rows-1'
      : 'h-full grid-cols-1 grid-rows-3';
  }
  // 4+
  return 'h-full grid-cols-2 grid-rows-2';
}

export default function ReaderPanelGrid() {
  const { slots, readerStatus, slotsLoading } = useMultiReaderEcho();
  const { mode, isFullscreen, rootRef, enterAll, enterSlot, exit } =
    useReaderFullscreen();
  const landscape = useLandscape();

  const activeSlots = useMemo(
    () => [...slots].filter((s) => s.is_active).sort((a, b) => a.sort_order - b.sort_order),
    [slots]
  );

  const livePcsc = useMemo(
    () => new Set(liveConnectedPcscNames(readerStatus)),
    [readerStatus]
  );

  const isSlotConnected = (pcscName: string | null) =>
    Boolean(pcscName && livePcsc.has(pcscName));

  if (slotsLoading) {
    return <ReaderPanelGridSkeleton />;
  }

  if (activeSlots.length === 0) {
    return (
      <div className="rounded-xl border border-warning/30 bg-warning/10 p-6 text-sm text-warning-foreground">
        <p className="font-medium">No hay paneles NFC activos</p>
        <p className="mt-1 opacity-90">
          Ve a la pestaña <strong>Lectores</strong> para activar paneles o asignar lectores físicos.
        </p>
      </div>
    );
  }

  const visibleSlots =
    mode !== 'none' && mode !== 'all'
      ? activeSlots.filter((slot) => slot.code === mode)
      : activeSlots;

  const gridClass = gridLayoutClass(visibleSlots.length, isFullscreen, landscape);

  return (
    <div className="space-y-3">
      {/*{!isFullscreen && (
        <div className="flex flex-wrap items-center justify-end gap-2">
          <Button
            size="sm"
            variant="secondary"
            leftIcon={<IconByName name="fullscreen" className="h-4 w-4" />}
            onClick={enterAll}
          >
            Pantalla completa
          </Button>
        </div>
      )}
      */}
      <div
        ref={rootRef}
        className={
          isFullscreen
            ? 'flex h-dvh w-screen flex-col bg-surface-app p-2 sm:p-3'
            : undefined
        }
      >
        {isFullscreen && (
          <div className="mb-2 flex shrink-0 items-center justify-between gap-3 text-foreground sm:mb-3">
            <div>
              <p className="font-semibold">
                {mode === 'all'
                  ? 'Monitoreo de lectores'
                  : (visibleSlots[0]?.label ?? 'Lector')}
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
                leftIcon={<IconByName name="exit" className="h-4 w-4" />}
                onClick={exit}
              >
                Salir
              </Button>
            </div>
          </div>
        )}

        <div className={isFullscreen ? 'min-h-0 flex-1 overflow-hidden' : undefined}>
          <div className={`grid gap-3 sm:gap-4 ${gridClass}`}>
            {visibleSlots.map((slot) => (
              <ReaderPanel
                key={slot.code}
                slot={slot}
                connected={isSlotConnected(slot.pcsc_name)}
                armed={slot.is_armed}
                variant={isFullscreen ? 'kiosk' : 'ops'}
                onRequestFullscreen={isFullscreen ? undefined : enterSlot}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
