'use client';

import { useState } from 'react';
import { useReEnrollment } from '@/contexts/ReEnrollmentContext';
import { useToast } from '@/contexts/ToastContext';
import { useConfirm } from '@/components/ui/confirm';
import { Button } from '@/components/ui/Button';
import { handleApiError } from '@/lib/api';
import { promoteReEnrollmentPeriod } from '@/lib/services/re-enrollment.service';
import { PromoteAcademicYearSummary } from '@/features/academic-years';
import { ApiError } from '@/lib/types/auth';

function formatSummary(s: PromoteAcademicYearSummary) {
  return `Procesados: ${s.processed}
Promovidos: ${s.promoted}
Reprobados retenidos: ${s.retained}
Egresados: ${s.graduated}
Errores: ${s.errors?.length ?? 0}`;
}

export default function ReEnrollmentPromotionPanel() {
  const { activePeriod, stats, refetch } = useReEnrollment();
  const { showError, showSuccess } = useToast();
  const { confirm } = useConfirm();
  const [running, setRunning] = useState(false);
  const [lastSummary, setLastSummary] = useState<PromoteAcademicYearSummary | null>(null);
  const [lastMode, setLastMode] = useState<'dry' | 'run' | null>(null);

  if (!activePeriod) return null;

  const fromLabel = activePeriod.from_academic_year?.description ?? `Ciclo #${activePeriod.from_academic_year_id}`;
  const toLabel = activePeriod.to_academic_year?.description ?? `Ciclo #${activePeriod.to_academic_year_id}`;
  const alreadyExecuted = Boolean(stats?.promotion_executed_at);

  const run = async (dryRun: boolean) => {
    setRunning(true);
    setLastSummary(null);
    setLastMode(dryRun ? 'dry' : 'run');

    try {
      const { summary } = await promoteReEnrollmentPeriod(activePeriod.id, dryRun);
      setLastSummary(summary);
      showSuccess(
        dryRun ? 'Simulación completada' : 'Promoción completada',
        `Procesados: ${summary.processed} · Errores: ${summary.errors?.length ?? 0}`
      );
      await refetch();
    } catch (err) {
      const apiError = handleApiError(err) as ApiError;
      showError('Error', apiError.message || 'No se pudo ejecutar la promoción.');
    } finally {
      setRunning(false);
    }
  };

  const handleSimulate = () => {
    confirm({
      title: 'Simular promoción anual',
      description:
        'Esto NO guarda cambios. Sirve para validar que todo está listo antes de ejecutar de verdad.',
      confirmLabel: 'Simular',
      cancelLabel: 'Cancelar',
      variant: 'default',
      onConfirm: () => run(true),
    });
  };

  const handleExecute = () => {
    confirm({
      title: 'Ejecutar promoción anual',
      description:
        'Esto SÍ guarda cambios y crea inscripciones del ciclo destino. Solo ejecútalo cuando todas las decisiones estén capturadas.',
      confirmLabel: 'Ejecutar',
      cancelLabel: 'Cancelar',
      variant: 'danger',
      onConfirm: () => run(false),
    });
  };

  return (
    <section className="bg-surface-elevated rounded-xl shadow-sm border p-4 sm:p-6 space-y-4">
      <header>
        <h2 className="text-lg font-semibold text-foreground">Promoción anual del periodo</h2>
        <p className="text-sm text-fg-muted">
          Ejecuta la promoción vinculada a <strong>{activePeriod.name}</strong>. Los ciclos se toman del periodo configurado.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
        <div>
          <span className="text-xs font-medium text-fg-muted">Ciclo origen</span>
          <div className="mt-1 rounded-lg border border-border px-3 py-2 bg-surface-muted">{fromLabel}</div>
        </div>
        <div>
          <span className="text-xs font-medium text-fg-muted">Ciclo destino</span>
          <div className="mt-1 rounded-lg border border-border px-3 py-2 bg-surface-muted">{toLabel}</div>
        </div>
      </div>

      {alreadyExecuted && (
        <p className="text-sm text-success bg-success/10 border border-success/30 rounded-lg p-3">
          Promoción ejecutada el{' '}
          {stats?.promotion_executed_at
            ? new Date(stats.promotion_executed_at).toLocaleString()
            : '—'}
          . Ya no se puede volver a ejecutar; puedes simular para consulta.
        </p>
      )}

      <div className="flex flex-col sm:flex-row gap-2">
        <Button
          variant="secondary"
          onClick={handleSimulate}
          loading={running}
          disabled={!stats?.can_simulate_promotion}
        >
          Simular
        </Button>
        <Button
          variant="danger"
          onClick={handleExecute}
          loading={running}
          disabled={!stats?.can_promote || alreadyExecuted}
        >
          Ejecutar promoción
        </Button>
      </div>

      {lastSummary && (
        <div className="bg-surface-muted border border-border rounded-lg p-4 text-sm text-foreground whitespace-pre-line">
          <div className="font-medium mb-2">
            Resultado ({lastMode === 'dry' ? 'simulación' : 'ejecución'})
          </div>
          {formatSummary(lastSummary)}

          {lastSummary.errors && lastSummary.errors.length > 0 && (
            <div className="mt-3 text-xs text-danger">
              <div className="font-medium mb-1">Errores (primeros 5)</div>
              <ul className="list-disc pl-5 space-y-1">
                {lastSummary.errors.slice(0, 5).map((e, idx) => (
                  <li key={idx}>
                    enrollment_id={e.enrollment_id} student_id={e.student_id} · {e.message}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
