'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { globalToast } from '@/lib/toast';

type FullscreenMode = 'none' | 'all' | string;

function getFullscreenRequest(el: HTMLElement) {
  const anyEl = el as HTMLElement & {
    webkitRequestFullscreen?: () => Promise<void> | void;
    msRequestFullscreen?: () => Promise<void> | void;
  };
  return (
    anyEl.requestFullscreen?.bind(anyEl) ??
    anyEl.webkitRequestFullscreen?.bind(anyEl) ??
    anyEl.msRequestFullscreen?.bind(anyEl) ??
    null
  );
}

function supportsBrowserFullscreen(el: HTMLElement | null): boolean {
  if (!el || typeof document === 'undefined') return false;
  if (document.fullscreenEnabled === false) return false;
  return getFullscreenRequest(el) !== null;
}

function requestBrowserFullscreen(el: HTMLElement): Promise<void> {
  const req = getFullscreenRequest(el);
  if (!req) return Promise.reject(new Error('Fullscreen API unavailable'));
  return Promise.resolve(req());
}

function exitBrowserFullscreen(): Promise<void> {
  if (typeof document === 'undefined' || !document.fullscreenElement) {
    return Promise.resolve();
  }
  const doc = document as Document & {
    webkitExitFullscreen?: () => Promise<void> | void;
    msExitFullscreen?: () => Promise<void> | void;
  };
  const exit =
    doc.exitFullscreen?.bind(doc) ??
    doc.webkitExitFullscreen?.bind(doc) ??
    doc.msExitFullscreen?.bind(doc);
  return exit ? Promise.resolve(exit()) : Promise.resolve();
}

function toastFullscreenUnsupported() {
  globalToast.warning(
    'Pantalla completa',
    'Tu navegador no soporta pantalla completa.'
  );
}

/**
 * True browser fullscreen (covers browser chrome). Call enter* from a click handler
 * so requestFullscreen keeps the user gesture.
 */
export function useReaderFullscreen() {
  const [mode, setMode] = useState<FullscreenMode>('none');
  const rootRef = useRef<HTMLDivElement | null>(null);

  const exit = useCallback(() => {
    setMode('none');
    void exitBrowserFullscreen().catch(() => undefined);
  }, []);

  const enterFullscreen = useCallback((next: FullscreenMode) => {
    const el = rootRef.current;
    if (!supportsBrowserFullscreen(el)) {
      toastFullscreenUnsupported();
      return;
    }
    if (document.fullscreenElement) {
      setMode(next);
      return;
    }

    setMode(next);
    void requestBrowserFullscreen(el!).catch(() => {
      setMode('none');
      toastFullscreenUnsupported();
    });
  }, []);

  const enterAll = useCallback(() => {
    enterFullscreen('all');
  }, [enterFullscreen]);

  const enterSlot = useCallback(
    (slotCode: string) => {
      enterFullscreen(slotCode);
    },
    [enterFullscreen]
  );

  useEffect(() => {
    if (mode === 'none') return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [mode]);

  useEffect(() => {
    const onFsChange = () => {
      if (!document.fullscreenElement) {
        setMode('none');
      }
    };
    document.addEventListener('fullscreenchange', onFsChange);
    document.addEventListener('webkitfullscreenchange', onFsChange as EventListener);
    return () => {
      document.removeEventListener('fullscreenchange', onFsChange);
      document.removeEventListener(
        'webkitfullscreenchange',
        onFsChange as EventListener
      );
    };
  }, []);

  return {
    mode,
    isFullscreen: mode !== 'none',
    rootRef,
    enterAll,
    enterSlot,
    exit,
  };
}
