'use client';

import Link from 'next/link';
import { useReEnrollment } from '@/contexts/ReEnrollmentContext';

export default function ReEnrollmentStatusBanner() {
  const { activePeriod, stats } = useReEnrollment();

  if (!activePeriod) {
    return (
      <div className="rounded-xl border border-warning/30 bg-warning/10 p-4 text-sm text-warning-foreground">
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
      <div className="rounded-xl border border-warning/30 bg-warning/10 p-4 text-sm text-warning-foreground">
        <p className="font-medium">Periodo en borrador</p>
        <p className="mt-1">
          Abre el periodo <strong>{activePeriod.name}</strong> en Configuración para habilitar validación y promoción.
        </p>
      </div>
    );
  }

  if (activePeriod.status === 'closed') {
    return (
      <div className="rounded-xl border border-border bg-surface-muted p-4 text-sm text-foreground">
        <p className="font-medium">Periodo cerrado</p>
        <p className="mt-1">
          {activePeriod.name} está cerrado. Reabre el periodo o consulta procesos finalizados.
        </p>
      </div>
    );
  }

  if (activePeriod.status === 'finalized') {
    return (
      <div className="rounded-xl border border-border bg-surface-muted p-4 text-sm text-foreground">
        <p className="font-medium">Reinscripción finalizada — solo consulta</p>
        <p className="mt-1">
          {activePeriod.name} fue cerrado oficialmente. Puedes revisar datos e historial, pero no editar.
        </p>
      </div>
    );
  }

  if (stats && stats.unresolved && stats.unresolved > 0) {
    return (
      <div className="rounded-xl border border-border bg-primary-soft p-4 text-sm text-primary">
        <p className="font-medium">Validación pendiente</p>
        <p className="mt-1">
          Hay <strong>{stats.unresolved}</strong> alumno(s) sin validación final. Completa validación antes de promover.
        </p>
      </div>
    );
  }

  if (stats?.promotion_executed_at && activePeriod.status === 'open') {
    return (
      <div className="rounded-xl border border-success/30 bg-success/10 p-4 text-sm text-success">
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
