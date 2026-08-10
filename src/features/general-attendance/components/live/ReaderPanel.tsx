'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useMultiReaderEcho } from '@/features/general-attendance/contexts/MultiReaderEchoContext';
import { NfcReaderSlot } from '@/features/general-attendance/types/nfc-reader';
import { getPrivateImageUrl } from '@/lib/api';
import { useAttendanceStore } from '@/features/general-attendance/stores/attendance-store';
import { globalToast } from '@/lib/toast';
import { IconByName } from '@/components/ui/icons/attendenceCard.icons';
import { Button } from '@/components/ui/Button';

const STATUS_RING = {
  waiting: 'ring-border/70',
  scanning: 'ring-primary animate-pulse',
  success: 'ring-success',
  info: 'ring-info',
  warning: 'ring-warning',
  error: 'ring-danger',
} as const;

const STATUS_BORDER = {
  waiting: 'border-border',
  scanning: 'border-primary',
  success: 'border-success',
  info: 'border-info',
  warning: 'border-warning',
  error: 'border-danger',
} as const;

interface ReaderPanelProps {
  slot: NfcReaderSlot;
  connected: boolean;
  armed: boolean;
  /** ops = classic card; kiosk = photo-first wall display */
  variant?: 'ops' | 'kiosk';
  onRequestFullscreen?: (slotCode: string) => void;
}

export default function ReaderPanel({
  slot,
  connected,
  armed,
  variant = 'ops',
  onRequestFullscreen,
}: ReaderPanelProps) {
  const isKiosk = variant === 'kiosk';
  const { panelStates, registerPanel, armSlot } = useMultiReaderEcho();
  const addRecord = useAttendanceStore((s) => s.addRecord);
  const [arming, setArming] = useState(false);
  const state = panelStates[slot.code] ?? {
    scanStatus: 'waiting' as const,
    displayStudent: null,
    lastMessage: null,
  };

  useEffect(() => {
    return registerPanel(slot.code, (payload) => {
      if (
        payload.event === 'card_inserted' &&
        (payload.status === 'ok' || payload.status === 'info') &&
        payload.student
      ) {
        addRecord(
          {
            ...payload.student,
            message: payload.message,
            event: payload.student.type ?? payload.event,
            type: payload.student.type,
          },
          'websocket',
          {
            reader_slot_code: slot.code,
            reader_label: slot.label,
          }
        );

        if (payload.status === 'ok') {
          globalToast.success(slot.label, payload.message ?? payload.student.name);
        }
      }

      if (payload.event === 'card_inserted' && payload.status === 'warning') {
        if (payload.student) {
          addRecord(
            {
              ...payload.student,
              message: payload.message,
              event: 'warning',
            },
            'websocket',
            {
              reader_slot_code: slot.code,
              reader_label: slot.label,
            }
          );
        }
        globalToast.warning(slot.label, payload.message ?? 'Lectura no registrada');
      }
    });
  }, [registerPanel, slot.code, slot.label, addRecord]);

  const handleToggleArm = async () => {
    setArming(true);
    try {
      await armSlot(slot.id, !armed);
      globalToast.success(
        slot.label,
        !armed ? 'Lecturas activadas' : 'Lector en pausa'
      );
    } catch {
      globalToast.error(slot.label, 'No se pudo cambiar el estado del lector');
    } finally {
      setArming(false);
    }
  };

  const fallbackAvatar =
    state.displayStudent?.gender === 'F' ? '/avatar-f.svg' : '/avatar-m.svg';
  const photoUrl = state.displayStudent?.photo_url
    ? getPrivateImageUrl(state.displayStudent.photo_url, 'original')
    : fallbackAvatar;

  const scanStatus = state.scanStatus;
  const ringClass = STATUS_RING[scanStatus] ?? STATUS_RING.waiting;
  const borderClass = STATUS_BORDER[scanStatus] ?? STATUS_BORDER.waiting;
  const pulse = scanStatus === 'scanning';

  const badge =
    scanStatus === 'success'
      ? { className: 'bg-success/15 text-success', label: state.lastMessage ?? 'Registrado' }
      : scanStatus === 'info'
        ? { className: 'bg-info/15 text-info', label: state.lastMessage ?? 'Identificado' }
        : scanStatus === 'warning'
          ? { className: 'bg-warning/15 text-warning-foreground', label: state.lastMessage ?? 'Atención' }
          : null;

  const audienceLabel =
    slot.audience === 'boys' ? 'Niños' : slot.audience === 'girls' ? 'Niñas' : 'Mixto';

  const statusDot = (
    <span className="flex items-center gap-1.5 text-xs">
      <span
        className={`h-2.5 w-2.5 rounded-full ${connected ? 'bg-success animate-pulse' : 'bg-danger'}`}
      />
      {!connected ? 'Sin lector' : armed ? 'Activo' : 'Pausado'}
    </span>
  );

  return (
    <article
      className={`relative flex h-full flex-col overflow-hidden transition-all duration-500 ${isKiosk
          ? `min-h-0 rounded-xl border border-border bg-nfc-panel shadow-sm ${pulse ? 'animate-pulse' : ''}`
          : `min-h-[min(52vh,480px)] rounded-2xl border-4 bg-nfc-panel shadow-lg ${borderClass} ${pulse ? 'animate-pulse' : ''}`
        }`}
    >
      {isKiosk ? (
        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-start justify-between gap-2 p-2 sm:p-3">
          <div className="pointer-events-auto max-w-[70%] rounded-lg bg-black/45 px-2.5 py-1.5 text-white backdrop-blur-sm">
            <p className="truncate text-sm font-semibold">{slot.label}</p>
            <p className="text-[11px] opacity-80">{audienceLabel}</p>
          </div>
          <div className="pointer-events-auto flex items-center gap-2 rounded-lg bg-black/45 px-2.5 py-1.5 text-white backdrop-blur-sm">
            {statusDot}
          </div>
        </div>
      ) : (
        <header className="flex shrink-0 items-center justify-between gap-2 border-b border-nfc-panel-title-fg/20 bg-nfc-panel-title px-4 py-3 text-nfc-panel-title-fg">
          <div className="min-w-0">
            <h3 className="truncate text-sm font-bold sm:text-base">{slot.label}</h3>
            <p className="text-xs text-nfc-panel-title-muted">{audienceLabel}</p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <span className="text-nfc-panel-title-fg">{statusDot}</span>
            {onRequestFullscreen && (
              <button
                type="button"
                onClick={() => onRequestFullscreen(slot.code)}
                className="rounded p-1 text-nfc-panel-title-fg hover:bg-nfc-panel-title-fg/10"
                title="Pantalla completa"
                aria-label={`Pantalla completa ${slot.label}`}
              >
                <IconByName name="fullscreen" className="h-4 w-4" />
              </button>
            )}
          </div>
        </header>
      )}

      <div
        className={`@container-[size] flex min-h-0 flex-1 flex-col ${isKiosk ? 'p-2 sm:p-3' : 'p-3 sm:p-4'
          }`}
      >
        {state.displayStudent ? (
          <div className="flex min-h-0 flex-1 flex-col items-stretch gap-2 [@container_(min-aspect-ratio:6/5)]:flex-row [@container_(min-aspect-ratio:6/5)]:gap-4">
            <div className="@container-[size] relative flex min-h-0 min-w-0 flex-1 items-center justify-center">
              <div
                className={`relative aspect-square overflow-hidden rounded-full shadow-md ${isKiosk
                    ? `ring-4 ring-offset-2 ring-offset-nfc-panel ${ringClass}`
                    : ''
                  }`}
                style={{
                  width: 'min(100cqw, 100cqh)',
                  height: 'min(100cqw, 100cqh)',
                }}
              >
                <Image
                  src={photoUrl}
                  alt={state.displayStudent.name}
                  fill
                  sizes="(max-width: 768px) 90vw, 40vw"
                  className="object-cover"
                  unoptimized
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = fallbackAvatar;
                  }}
                />
              </div>
            </div>

            <div
              className={`flex shrink-0 flex-col justify-center gap-1 text-center [@container_(min-aspect-ratio:6/5)]:w-[min(40%,18rem)] [@container_(min-aspect-ratio:6/5)]:text-left ${isKiosk ? 'px-1 pb-12' : ''
                }`}
            >
              <p
                className={`font-bold leading-tight text-foreground ${isKiosk
                    ? 'text-[clamp(1.125rem,3.5cqw,2.75rem)]'
                    : 'text-lg sm:text-xl'
                  }`}
              >
                {state.displayStudent.name}
              </p>
              <p
                className={`font-semibold text-fg-muted ${isKiosk
                    ? 'text-[clamp(0.875rem,2.2cqw,1.25rem)]'
                    : 'text-sm'
                  }`}
              >
                {state.displayStudent.grade} · Grupo {state.displayStudent.group}
              </p>
              {badge && (
                <div
                  className={`mt-1 inline-flex items-center justify-center gap-2 self-center rounded-lg px-3 py-1 [@container_(min-aspect-ratio:6/5)]:self-start ${badge.className}`}
                >
                  <IconByName name="success" />
                  <span className="text-sm font-medium">{badge.label}</span>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center px-2 text-center">
            <p
              className={`font-semibold text-foreground ${isKiosk ? 'text-xl sm:text-2xl' : 'text-lg'
                }`}
            >
              {armed && connected ? 'Esperando credencial' : 'Lector no listo'}
            </p>
            {state.lastMessage && (
              <p className="mt-2 max-w-sm text-sm text-fg-muted">{state.lastMessage}</p>
            )}
          </div>
        )}
      </div>

      {isKiosk ? (
        <footer className="absolute bottom-2 right-2 z-10">
          <Button
            size="sm"
            variant={armed ? 'secondary' : 'primary'}
            loading={arming}
            onClick={handleToggleArm}
            className="shadow-md"
          >
            {armed ? 'Pausar' : 'Activar'}
          </Button>
        </footer>
      ) : (
        <footer className="flex shrink-0 justify-end border-t border-border bg-nfc-panel-footer px-4 py-2">
          <Button
            size="sm"
            variant={armed ? 'secondary' : 'primary'}
            loading={arming}
            onClick={handleToggleArm}
          >
            {armed ? 'Pausar' : 'Activar'}
          </Button>
        </footer>
      )}
    </article>
  );
}
