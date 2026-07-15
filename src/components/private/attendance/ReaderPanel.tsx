'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import { useMultiReaderEcho } from '@/contexts/MultiReaderEchoContext';
import { NfcReaderSlot } from '@/lib/types/nfc-reader';
import { getPrivateImageUrl } from '@/lib/config/api';
import { useAttendanceStore } from '@/stores/attendance-store';
import { globalToast } from '@/lib/toast';
import { IconByName } from '@/components/ui/icons/attendenceCard.icons';

const STATUS_STYLES = {
  waiting: 'border-slate-300 bg-gradient-to-br from-slate-50 to-slate-100 text-slate-600',
  scanning: 'border-blue-500 bg-gradient-to-br from-blue-50 to-blue-100 text-blue-600',
  success: 'border-emerald-500 bg-gradient-to-br from-emerald-50 to-green-100 text-emerald-600',
  warning: 'border-yellow-500 bg-gradient-to-br from-yellow-50 to-yellow-100 text-yellow-700',
  error: 'border-red-500 bg-gradient-to-br from-red-50 to-rose-100 text-red-600',
} as const;

interface ReaderPanelProps {
  slot: NfcReaderSlot;
  connected: boolean;
  armed: boolean;
}

export default function ReaderPanel({ slot, connected, armed }: ReaderPanelProps) {
  const { panelStates, registerPanel } = useMultiReaderEcho();
  const addRecord = useAttendanceStore((s) => s.addRecord);
  const state = panelStates[slot.code] ?? {
    scanStatus: 'waiting' as const,
    displayStudent: null,
    lastMessage: null,
  };

  useEffect(() => {
    return registerPanel(slot.code, (payload) => {
      if (payload.event === 'card_inserted' && payload.status === 'ok' && payload.student) {
        addRecord(payload.student, 'websocket', {
          reader_slot_code: slot.code,
          reader_label: slot.label,
        });
        globalToast.success(slot.label, payload.student.name);
      }
      if (payload.event === 'card_inserted' && payload.status === 'warning') {
        globalToast.warning(slot.label, payload.message ?? 'Lectura no registrada');
      }
    });
  }, [registerPanel, slot.code, slot.label, addRecord]);

  const fallbackAvatar =
    state.displayStudent?.gender === 'F' ? '/avatar-f.svg' : '/avatar-m.svg';
  const photoUrl = state.displayStudent?.photo_url
    ? getPrivateImageUrl(state.displayStudent.photo_url)
    : fallbackAvatar;

  const statusClass = STATUS_STYLES[state.scanStatus];
  const pulse = state.scanStatus === 'scanning';

  return (
    <article
      className={`relative overflow-hidden rounded-2xl border-4 shadow-lg transition-all duration-500 ${statusClass} ${pulse ? 'animate-pulse' : ''}`}
    >
      <header className="flex items-center justify-between gap-2 border-b border-white/60 bg-blue-950 px-4 py-3 text-white">
        <div>
          <h3 className="font-bold text-sm sm:text-base">{slot.label}</h3>
          <p className="text-xs text-blue-100">{slot.audience === 'boys' ? 'Niños' : 'Niñas'} · {slot.direction}</p>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className={`h-2.5 w-2.5 rounded-full ${connected ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'}`} />
          {!connected ? 'Sin lector' : armed ? 'Activo' : 'Pausado'}
        </div>
      </header>

      <div className="p-4 sm:p-6">
        {state.displayStudent ? (
          <div className="grid grid-cols-1 md:grid-cols-[140px_1fr] gap-4 items-center">
            <div className="relative mx-auto aspect-square w-full max-w-[180px] overflow-hidden rounded-xl shadow-md">
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
              <p className="text-lg font-bold text-slate-900">{state.displayStudent.name}</p>
              <p className="text-slate-600">{state.displayStudent.grade} · Grupo {state.displayStudent.group}</p>
              <p className="text-slate-500">ID: {state.displayStudent.credential_id}</p>
              {state.scanStatus === 'success' && (
                <div className="inline-flex items-center gap-2 rounded-lg bg-emerald-100 px-3 py-1 text-emerald-800">
                  <IconByName name="success" />
                  <span className="font-medium">Registrado</span>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="py-10 text-center">
            <p className="text-lg font-semibold text-slate-700">
              {armed && connected ? 'Esperando credencial' : 'Lector no listo'}
            </p>
            {state.lastMessage && <p className="mt-2 text-sm text-slate-500">{state.lastMessage}</p>}
          </div>
        )}
      </div>
    </article>
  );
}
