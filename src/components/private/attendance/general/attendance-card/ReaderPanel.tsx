'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useMultiReaderEcho } from '@/contexts/MultiReaderEchoContext';
import { NfcReaderSlot } from '@/lib/types/nfc-reader';
import { getPrivateImageUrl } from '@/lib/api';
import { useAttendanceStore } from '@/stores/attendance-store';
import { globalToast } from '@/lib/toast';
import { IconByName } from '@/components/ui/icons/attendenceCard.icons';
import { Button } from '@/components/ui/Button';

const STATUS_STYLES = {
  waiting: 'border-border bg-gradient-to-br from-surface-muted to-surface-muted text-fg-muted',
  scanning: 'border-primary bg-gradient-to-br from-primary-soft to-primary-soft text-primary',
  success: 'border-success bg-gradient-to-br from-success/10 to-success/15 text-success',
  info: 'border-info bg-gradient-to-br from-info/10 to-primary-soft text-info',
  warning: 'border-warning bg-gradient-to-br from-warning/10 to-warning/15 text-warning-foreground',
  error: 'border-danger bg-gradient-to-br from-danger/10 to-danger/15 text-danger',
} as const;

interface ReaderPanelProps {
  slot: NfcReaderSlot;
  connected: boolean;
  armed: boolean;
  compact?: boolean;
  onRequestFullscreen?: (slotCode: string) => void;
}

export default function ReaderPanel({
  slot,
  connected,
  armed,
  compact = false,
  onRequestFullscreen,
}: ReaderPanelProps) {
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
    ? getPrivateImageUrl(state.displayStudent.photo_url)
    : fallbackAvatar;

  const statusClass = STATUS_STYLES[state.scanStatus] ?? STATUS_STYLES.waiting;
  const pulse = state.scanStatus === 'scanning';

  const badge =
    state.scanStatus === 'success'
      ? { className: 'bg-success/15 text-success', label: state.lastMessage ?? 'Registrado' }
      : state.scanStatus === 'info'
        ? { className: 'bg-info/15 text-info', label: state.lastMessage ?? 'Identificado' }
        : state.scanStatus === 'warning'
          ? { className: 'bg-warning/15 text-warning-foreground', label: state.lastMessage ?? 'Atención' }
          : null;

  return (
    <article
      className={`relative flex h-full flex-col overflow-hidden rounded-2xl border-4 shadow-lg transition-all duration-500 ${statusClass} ${pulse ? 'animate-pulse' : ''} ${compact ? 'min-h-[280px]' : 'min-h-[320px]'}`}
    >
      <header className="flex items-center justify-between gap-2 border-b border-white/60 bg-primary px-4 py-3 text-white">
        <div className="min-w-0">
          <h3 className="font-bold text-sm sm:text-base truncate">{slot.label}</h3>
          <p className="text-xs text-brand-100">
            {slot.audience === 'boys' ? 'Niños' : slot.audience === 'girls' ? 'Niñas' : 'Mixto'}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="flex items-center gap-1.5 text-xs">
            <span className={`h-2.5 w-2.5 rounded-full ${connected ? 'bg-success animate-pulse' : 'bg-danger'}`} />
            {!connected ? 'Sin lector' : armed ? 'Activo' : 'Pausado'}
          </span>
          {onRequestFullscreen && (
            <button
              type="button"
              onClick={() => onRequestFullscreen(slot.code)}
              className="rounded p-1 hover:bg-surface-elevated/10"
              title="Pantalla completa"
              aria-label={`Pantalla completa ${slot.label}`}
            >
              <IconByName name="fullscreen" className="w-4 h-4" />
            </button>
          )}
        </div>
      </header>

      <div className={`flex-1 p-4 ${compact ? 'sm:p-5' : 'sm:p-6'}`}>
        {state.displayStudent ? (
          <div className={`grid grid-cols-1 gap-4 items-center ${compact ? '' : 'md:grid-cols-[140px_1fr]'}`}>
            <div className={`relative mx-auto aspect-square w-full overflow-hidden rounded-xl shadow-md ${compact ? 'max-w-[220px]' : 'max-w-[180px]'}`}>
              <Image
                src={photoUrl}
                alt={state.displayStudent.name}
                fill
                className="object-cover"
                unoptimized
                onError={(e) => {
                  (e.target as HTMLImageElement).src = fallbackAvatar;
                }}
              />
            </div>
            <div className="space-y-2 text-sm">
              <p className={`font-bold text-foreground ${compact ? 'text-2xl' : 'text-lg'}`}>
                {state.displayStudent.name}
              </p>
              <p className="text-fg-muted">
                {state.displayStudent.grade} · Grupo {state.displayStudent.group}
              </p>
              <p className="text-fg-muted">ID: {state.displayStudent.credential_id}</p>
              {badge && (
                <div className={`inline-flex items-center gap-2 rounded-lg px-3 py-1 ${badge.className}`}>
                  <IconByName name="success" />
                  <span className="font-medium">{badge.label}</span>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="py-10 text-center">
            <p className={`font-semibold text-foreground ${compact ? 'text-xl' : 'text-lg'}`}>
              {armed && connected ? 'Esperando credencial' : 'Lector no listo'}
            </p>
            {state.lastMessage && <p className="mt-2 text-sm text-fg-muted">{state.lastMessage}</p>}
          </div>
        )}
      </div>

      <footer className="border-t border-white/50 bg-surface-elevated/40 px-4 py-2 flex justify-end">
        <Button
          size="sm"
          variant={armed ? 'secondary' : 'primary'}
          loading={arming}
          onClick={handleToggleArm}
        >
          {armed ? 'Pausar' : 'Activar'}
        </Button>
      </footer>
    </article>
  );
}
