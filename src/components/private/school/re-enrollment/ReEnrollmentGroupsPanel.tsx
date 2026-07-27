'use client';

import { useReEnrollment } from '@/contexts/ReEnrollmentContext';
import { Button } from '@/components/ui/Button';
import { advanceReEnrollmentStep, updateReEnrollmentPeriod } from '@/lib/services/re-enrollment.service';
import { useToast } from '@/contexts/ToastContext';
import { handleApiError } from '@/lib/api';
import { useState } from 'react';

export default function ReEnrollmentGroupsPanel() {
  const { activePeriod, stats, refetch } = useReEnrollment();
  const { showError, showSuccess } = useToast();
  const [saving, setSaving] = useState(false);

  if (!activePeriod) return null;

  const readOnly = activePeriod.status === 'finalized' || activePeriod.status !== 'open';

  if (activePeriod.keep_current_groups) {
    return (
      <section className="bg-green-50 border border-green-200 rounded-xl p-6 text-sm text-green-800">
        <h2 className="font-semibold text-lg mb-2">Asignación de grupos omitida</h2>
        <p>
          Este periodo está configurado para <strong>conservar el grupo actual</strong>.
          Los alumnos promovidos mantienen su letra; los reprobados permanecen en el mismo grupo.
        </p>
      </section>
    );
  }

  const saveKeepGroups = async (keep: boolean) => {
    setSaving(true);
    try {
      await updateReEnrollmentPeriod(activePeriod.id, { keep_current_groups: keep });
      await refetch();
      showSuccess(keep ? 'Se conservarán los grupos actuales' : 'Habilitada reasignación manual');
    } catch (err) {
      showError('Error', handleApiError(err).message);
    } finally {
      setSaving(false);
    }
  };

  const completeStep = async () => {
    setSaving(true);
    try {
      await advanceReEnrollmentStep(activePeriod.id);
      await refetch();
      showSuccess('Paso de grupos completado');
    } catch (err) {
      showError('Error', handleApiError(err).message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="bg-white border rounded-xl p-4 sm:p-6 space-y-4">
      <header>
        <h2 className="text-lg font-semibold">Asignación de grupos</h2>
        <p className="text-sm text-gray-500">
          Solo aplica si necesitas mover alumnos de grupo. Si conservas grupo, este paso se omite automáticamente.
        </p>
      </header>

      <div className="flex flex-wrap gap-2">
        <Button variant="secondary" loading={saving} disabled={readOnly} onClick={() => saveKeepGroups(true)}>
          Conservar grupos actuales
        </Button>
        <Button variant="secondary" loading={saving} disabled={readOnly} onClick={() => saveKeepGroups(false)}>
          Permitir cambio de grupo
        </Button>
        <Button loading={saving} disabled={readOnly || !stats?.promotion_executed_at} onClick={completeStep}>
          Marcar paso como listo
        </Button>
      </div>

      <p className="text-xs text-gray-500">
        La reasignación visual (arrastrar/seleccionar varios) se conectará aquí en la siguiente iteración.
        Por ahora el flujo respeta la regla institucional: conservar grupo por defecto.
      </p>
    </section>
  );
}
