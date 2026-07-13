'use client';

import { useState } from 'react';
import { useReEnrollment } from '@/contexts/ReEnrollmentContext';
import { useAcademicYears } from '@/hooks/academic-years/useAcademicYears';
import { useToast } from '@/contexts/ToastContext';
import { Button } from '@/components/ui/Button';
import {
  createReEnrollmentPeriod,
  openReEnrollmentPeriod,
  closeReEnrollmentPeriod,
  updateReEnrollmentPeriod,
  advanceReEnrollmentStep,
} from '@/lib/services/re-enrollment.service';
import { handleApiError } from '@/lib/config/api';

export default function ReEnrollmentSettingsPanel() {
  const { activePeriod, periods, refetch, setActivePeriodId } = useReEnrollment();
  const { data: years } = useAcademicYears();
  const { showError, showSuccess } = useToast();
  const [saving, setSaving] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({
    name: '',
    from_academic_year_id: '',
    to_academic_year_id: '',
    start_at: '',
    end_at: '',
    keep_current_groups: true,
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await createReEnrollmentPeriod({
        name: form.name,
        from_academic_year_id: Number(form.from_academic_year_id),
        to_academic_year_id: Number(form.to_academic_year_id),
        start_at: form.start_at,
        end_at: form.end_at,
        keep_current_groups: form.keep_current_groups,
      });
      showSuccess('Periodo creado', 'Ahora puedes abrirlo cuando esté listo.');
      setShowCreate(false);
      await refetch();
    } catch (err) {
      showError('Error', handleApiError(err).message);
    } finally {
      setSaving(false);
    }
  };

  const handleOpen = async () => {
    if (!activePeriod) return;
    setSaving(true);
    try {
      await openReEnrollmentPeriod(activePeriod.id);
      showSuccess('Periodo abierto', 'Se cargaron los alumnos del ciclo origen.');
      await refetch();
    } catch (err) {
      showError('Error', handleApiError(err).message);
    } finally {
      setSaving(false);
    }
  };

  const handleClose = async () => {
    if (!activePeriod) return;
    setSaving(true);
    try {
      await closeReEnrollmentPeriod(activePeriod.id);
      showSuccess('Periodo cerrado');
      await refetch();
    } catch (err) {
      showError('Error', handleApiError(err).message);
    } finally {
      setSaving(false);
    }
  };

  const toggleKeepGroups = async (value: boolean) => {
    if (!activePeriod) return;
    setSaving(true);
    try {
      await updateReEnrollmentPeriod(activePeriod.id, { keep_current_groups: value });
      await refetch();
    } catch (err) {
      showError('Error', handleApiError(err).message);
    } finally {
      setSaving(false);
    }
  };

  const goToValidation = async () => {
    if (!activePeriod) return;
    setSaving(true);
    try {
      await advanceReEnrollmentStep(activePeriod.id);
      showSuccess('Paso actualizado', 'Continúa con la validación de alumnos.');
      await refetch();
    } catch (err) {
      showError('Error', handleApiError(err).message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="bg-white border rounded-xl p-4 sm:p-6 space-y-4">
      <header>
        <h2 className="text-lg font-semibold text-gray-900">Configuración del periodo</h2>
          <p className="text-sm text-gray-500">
            Crea primero los ciclos en <strong>Escolar → Ciclos escolares</strong> si aún no existen origen/destino.
          </p>
      </header>

      <div className="flex flex-wrap gap-2 items-center">
        <label className="text-sm text-gray-600">Periodo activo:</label>
        <select
          className="rounded-lg border border-gray-200 px-3 py-2 text-sm bg-white"
          value={activePeriod?.id ?? ''}
          onChange={(e) => setActivePeriodId(Number(e.target.value))}
        >
          {periods.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} ({p.status})
            </option>
          ))}
        </select>
        <Button variant="secondary" size="sm" onClick={() => setShowCreate(!showCreate)}>
          {showCreate ? 'Cancelar' : 'Nuevo periodo'}
        </Button>
      </div>

      {showCreate && (
        <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-gray-50 border rounded-lg p-4">
          <input
            className="rounded-lg border px-3 py-2 text-sm md:col-span-2"
            placeholder="Nombre (ej. Reinscripción 2026-2027)"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <select
            className="rounded-lg border px-3 py-2 text-sm bg-white"
            value={form.from_academic_year_id}
            onChange={(e) => setForm({ ...form, from_academic_year_id: e.target.value })}
            required
          >
            <option value="">Ciclo origen</option>
            {years.map((y) => (
              <option key={y.id} value={y.id}>{y.description}</option>
            ))}
          </select>
          <select
            className="rounded-lg border px-3 py-2 text-sm bg-white"
            value={form.to_academic_year_id}
            onChange={(e) => setForm({ ...form, to_academic_year_id: e.target.value })}
            required
          >
            <option value="">Ciclo destino</option>
            {years.map((y) => (
              <option key={y.id} value={y.id}>{y.description}</option>
            ))}
          </select>
          <input type="datetime-local" className="rounded-lg border px-3 py-2 text-sm" value={form.start_at}
            onChange={(e) => setForm({ ...form, start_at: e.target.value })} required />
          <input type="datetime-local" className="rounded-lg border px-3 py-2 text-sm" value={form.end_at}
            onChange={(e) => setForm({ ...form, end_at: e.target.value })} required />
          <label className="md:col-span-2 flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.keep_current_groups}
              onChange={(e) => setForm({ ...form, keep_current_groups: e.target.checked })}
            />
            Conservar grupo actual (omite asignación de grupos)
          </label>
          <div className="md:col-span-2">
            <Button type="submit" loading={saving}>Guardar periodo</Button>
          </div>
        </form>
      )}

      {activePeriod && (
        <div className="space-y-3 border rounded-lg p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
            <p><strong>Estado:</strong> {activePeriod.status}</p>
            <p><strong>Paso actual:</strong> {activePeriod.current_step}</p>
            <p><strong>Inicio:</strong> {activePeriod.start_at ?? '—'}</p>
            <p><strong>Fin:</strong> {activePeriod.end_at ?? '—'}</p>
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={activePeriod.keep_current_groups}
              onChange={(e) => toggleKeepGroups(e.target.checked)}
              disabled={saving || activePeriod.status === 'finalized'}
            />
            Conservar grupo actual (si está activo, se omite el paso de asignación)
          </label>

          <div className="flex flex-wrap gap-2">
            {activePeriod.status !== 'open' && activePeriod.status !== 'finalized' && (
              <Button onClick={handleOpen} loading={saving}>Abrir periodo</Button>
            )}
            {activePeriod.status === 'open' && (
              <Button variant="danger" onClick={handleClose} loading={saving}>Cerrar periodo</Button>
            )}
            {activePeriod.status === 'open' && activePeriod.current_step === 'configuration' && (
              <Button variant="secondary" onClick={goToValidation} loading={saving}>
                Ir a validación
              </Button>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
