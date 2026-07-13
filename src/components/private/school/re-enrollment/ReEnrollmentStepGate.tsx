'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { useReEnrollment } from '@/contexts/ReEnrollmentContext';
import { ReEnrollmentProcessStep } from '@/lib/types/school/re-enrollment';

type GatedStep = Exclude<ReEnrollmentProcessStep, 'configuration' | 'completed'>;

interface ReEnrollmentStepGateProps {
  step: GatedStep;
  children: ReactNode;
}

function stepMessage(
  step: GatedStep,
  stats: ReturnType<typeof useReEnrollment>['stats'],
  periodStatus: string | undefined
): string | null {
  if (periodStatus === 'finalized') {
    return 'Este periodo está finalizado. Los datos son de solo lectura.';
  }
  if (periodStatus === 'draft') {
    return 'Abre el periodo en Configuración para habilitar este paso.';
  }
  if (periodStatus === 'closed') {
    return 'El periodo está cerrado. Reábrelo para continuar.';
  }

  if (step === 'validation' && stats && !stats.can_validate) {
    return 'Completa la configuración y avanza al paso de validación.';
  }
  if (step === 'promotion') {
    if (stats?.unresolved && stats.unresolved > 0) {
      return `Hay ${stats.unresolved} alumno(s) sin validación final.`;
    }
    if (stats && !stats.can_simulate_promotion && !stats.can_promote) {
      return 'Avanza al paso de promoción desde validación.';
    }
  }
  if (step === 'groups' && stats && stats.keep_current_groups) {
    return 'Este periodo conserva grupos actuales; el paso de grupos está omitido.';
  }

  return null;
}

export default function ReEnrollmentStepGate({ step, children }: ReEnrollmentStepGateProps) {
  const { activePeriod, stats } = useReEnrollment();

  if (!activePeriod) {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-900">
        <p className="font-medium">No hay periodo activo</p>
        <p className="mt-2">
          <Link href="/school/re-enrollment/settings" className="underline">
            Ir a Configuración
          </Link>
        </p>
      </div>
    );
  }

  const readOnly = activePeriod.status === 'finalized';
  const blockMessage = stepMessage(step, stats, activePeriod.status);
  const canEdit =
    !readOnly &&
    activePeriod.status === 'open' &&
    (step === 'validation'
      ? Boolean(stats?.can_validate)
      : step === 'promotion'
        ? Boolean(stats?.can_simulate_promotion || stats?.can_promote)
        : true);

  return (
    <div className="space-y-4">
      {blockMessage && !readOnly && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          <p className="font-medium">Paso bloqueado</p>
          <p className="mt-1">{blockMessage}</p>
        </div>
      )}
      <div className={canEdit ? undefined : 'pointer-events-none opacity-60 select-none'} aria-disabled={!canEdit}>
        {children}
      </div>
      {readOnly && (
        <p className="text-xs text-slate-500 text-center">
          Modo consulta — no se pueden guardar cambios.
        </p>
      )}
    </div>
  );
}
