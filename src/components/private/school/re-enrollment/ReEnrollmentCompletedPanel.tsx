'use client';

import { useEffect, useState } from 'react';
import { useReEnrollment } from '@/contexts/ReEnrollmentContext';
import { finalizeReEnrollmentPeriod, getReEnrollmentHistory } from '@/lib/services/re-enrollment.service';
import { useToast } from '@/contexts/ToastContext';
import { useConfirm } from '@/components/ui/confirm';
import { handleApiError } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { ReEnrollmentEventItem, ReEnrollmentPeriod } from '@/lib/types/school/re-enrollment';

export default function ReEnrollmentCompletedPanel() {
  const { periods, stats, activePeriod, refetch } = useReEnrollment();
  const { showError, showSuccess } = useToast();
  const { confirm } = useConfirm();
  const [saving, setSaving] = useState(false);
  const [activateYear, setActivateYear] = useState(true);
  const [history, setHistory] = useState<ReEnrollmentEventItem[]>([]);

  const finalized = periods.filter((p) => p.status === 'finalized');

  useEffect(() => {
    if (!activePeriod?.id) return;
    getReEnrollmentHistory(activePeriod.id)
      .then(setHistory)
      .catch(() => setHistory([]));
  }, [activePeriod?.id, activePeriod?.status]);

  const handleFinalize = () => {
    if (!activePeriod || !stats) return;

    confirm({
      title: 'Finalizar reinscripción',
      description: `¿Cerrar oficialmente "${activePeriod.name}"?\n\n${stats.total_students} alumnos · ${stats.validated} validados · ${stats.rejected} bajas/rechazos\n\nEsta acción no se puede deshacer.`,
      confirmLabel: 'Finalizar',
      cancelLabel: 'Cancelar',
      variant: 'danger',
      onConfirm: async () => {
        setSaving(true);
        try {
          await finalizeReEnrollmentPeriod(activePeriod.id, activateYear);
          showSuccess(
            'Proceso finalizado',
            activateYear ? 'Periodo cerrado y ciclo destino activado.' : 'Periodo cerrado.'
          );
          await refetch();
        } catch (err) {
          showError('Error', handleApiError(err).message);
        } finally {
          setSaving(false);
        }
      },
    });
  };

  return (
    <div className="space-y-4">
      {activePeriod && activePeriod.status === 'open' && (
        <section className="bg-surface-elevated border rounded-xl p-4 sm:p-6 space-y-4">
          <h2 className="text-lg font-semibold">Finalizar proceso actual</h2>
          <p className="text-sm text-fg-muted">
            Cierra oficialmente {activePeriod.name}. Requiere promoción ejecutada previamente.
          </p>

          {stats && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
              <Metric label="Alumnos" value={stats.total_students} />
              <Metric label="Validados" value={stats.validated} />
              <Metric label="Egresados/Bajas" value={stats.rejected} />
              <Metric label="Listos promover" value={stats.ready_for_promotion} />
            </div>
          )}

          {!stats?.promotion_executed_at && (
            <p className="text-sm text-warning-foreground bg-warning/10 border border-warning/30 rounded-lg p-3">
              Debes ejecutar la promoción real antes de finalizar.
            </p>
          )}

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={activateYear}
              onChange={(e) => setActivateYear(e.target.checked)}
            />
            Activar ciclo destino ({activePeriod.to_academic_year?.description ?? 'destino'}) como vigente
          </label>

          <Button
            variant="danger"
            loading={saving}
            onClick={handleFinalize}
            disabled={!stats?.can_finalize}
          >
            Finalizar reinscripción
          </Button>
        </section>
      )}

      {activePeriod && activePeriod.status === 'finalized' && (
        <section className="bg-surface-muted border border-border rounded-xl p-4 sm:p-6">
          <p className="font-semibold text-foreground">🔒 Reinscripción finalizada — solo consulta</p>
          <p className="text-sm text-fg-muted mt-1">{activePeriod.name}</p>
        </section>
      )}

      <section className="bg-surface-elevated border rounded-xl p-4 sm:p-6 space-y-3">
        <h2 className="text-lg font-semibold">Historial del periodo activo</h2>
        {history.length === 0 ? (
          <p className="text-sm text-fg-muted">Sin eventos registrados.</p>
        ) : (
          <ul className="space-y-2">
            {history.map((event) => (
              <li key={event.id} className="border rounded-lg p-3 text-sm">
                <div className="flex justify-between gap-2">
                  <span className="font-medium">{actionLabel(event.action)}</span>
                  <span className="text-fg-muted text-xs">
                    {event.created_at ? new Date(event.created_at).toLocaleString() : '—'}
                  </span>
                </div>
                <div className="text-fg-muted text-xs mt-1">Por: {event.user_name}</div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="bg-surface-elevated border rounded-xl p-4 sm:p-6 space-y-3">
        <h2 className="text-lg font-semibold">Procesos finalizados</h2>
        {finalized.length === 0 ? (
          <p className="text-sm text-fg-muted">Aún no hay procesos finalizados.</p>
        ) : (
          <ul className="space-y-2">
            {finalized.map((p) => (
              <FinalizedCard key={p.id} period={p} />
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="border rounded-lg p-3">
      <div className="text-xl font-bold text-primary">{value}</div>
      <div className="text-xs text-fg-muted">{label}</div>
    </div>
  );
}

function FinalizedCard({ period }: { period: ReEnrollmentPeriod }) {
  return (
    <li className="border rounded-lg p-3 text-sm">
      <div className="font-medium">{period.name}</div>
      <div className="text-fg-muted">
        Finalizada: {period.finalized_at ? new Date(period.finalized_at).toLocaleString() : '—'}
      </div>
      <div className="text-fg-muted">{period.applications_count ?? 0} alumnos en el proceso</div>
    </li>
  );
}

function actionLabel(action: string): string {
  const labels: Record<string, string> = {
    opened: 'Periodo abierto',
    closed: 'Periodo cerrado',
    step_advanced: 'Paso avanzado',
    promotion_dry_run: 'Simulación de promoción',
    promotion_executed: 'Promoción ejecutada',
    finalized: 'Proceso finalizado',
    academic_year_activated: 'Ciclo destino activado',
  };
  return labels[action] ?? action;
}
