'use client';

import Link from 'next/link';
import { useReEnrollment } from '@/contexts/ReEnrollmentContext';

export default function ReEnrollmentStatusBanner() {
  const { activePeriod, stats } = useReEnrollment();

  if (!activePeriod) {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
        <p className="font-medium">Sin periodo de reinscripción</p>
        <p className="mt-1">
          Crea y abre un periodo en{' '}
          <Link href="/school/re-enrollment/settings" className="underline font-medium">
            Configuración
          </Link>{' '}
          para comenzar el proceso.
        </p>
      </div>
    );
  }

  if (activePeriod.status === 'draft') {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
        <p className="font-medium">Periodo en borrador</p>
        <p className="mt-1">
          Abre el periodo <strong>{activePeriod.name}</strong> en Configuración para habilitar validación y promoción.
        </p>
      </div>
    );
  }

  if (activePeriod.status === 'closed') {
    return (
      <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-800">
        <p className="font-medium">Periodo cerrado</p>
        <p className="mt-1">
          {activePeriod.name} está cerrado. Reabre el periodo o consulta procesos finalizados.
        </p>
      </div>
    );
  }

  if (activePeriod.status === 'finalized') {
    return (
      <div className="rounded-xl border border-slate-300 bg-slate-100 p-4 text-sm text-slate-800">
        <p className="font-medium">Reinscripción finalizada — solo consulta</p>
        <p className="mt-1">
          {activePeriod.name} fue cerrado oficialmente. Puedes revisar datos e historial, pero no editar.
        </p>
      </div>
    );
  }

  if (stats && stats.unresolved && stats.unresolved > 0) {
    return (
      <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-900">
        <p className="font-medium">Validación pendiente</p>
        <p className="mt-1">
          Hay <strong>{stats.unresolved}</strong> alumno(s) sin validación final. Completa validación antes de promover.
        </p>
      </div>
    );
  }

  if (stats?.promotion_executed_at && activePeriod.status === 'open') {
    return (
      <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-900">
        <p className="font-medium">Promoción ejecutada</p>
        <p className="mt-1">
          La promoción ya se aplicó. Continúa con grupos (si aplica) y finaliza el proceso en{' '}
          <Link href="/school/re-enrollment/completed" className="underline font-medium">
            Finalizadas
          </Link>
          .
        </p>
      </div>
    );
  }

  return null;
}
