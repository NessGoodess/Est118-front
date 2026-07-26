'use client';

import { useCallback, useEffect, useState } from 'react';

type FullscreenMode = 'none' | 'all' | string;

/**
 * CSS fullscreen overlay for reader panels (reliable inside Next private layout).
 * Optionally tries the browser Fullscreen API when entering "all".
 */
export function useReaderFullscreen() {
  const [mode, setMode] = useState<FullscreenMode>('none');

  const exit = useCallback(() => {
    setMode('none');
    if (typeof document !== 'undefined' && document.fullscreenElement) {
      document.exitFullscreen().catch(() => undefined);
    }
  }, []);

  const enterAll = useCallback(() => {
    setMode('all');
  }, []);

  const enterSlot = useCallback((slotCode: string) => {
    setMode(slotCode);
  }, []);

  useEffect(() => {
    if (mode === 'none') return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        exit();
      }
    };

    document.addEventListener('keydown', onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [mode, exit]);

  return {
    mode,
    isFullscreen: mode !== 'none',
    enterAll,
    enterSlot,
    exit,
  };
}
