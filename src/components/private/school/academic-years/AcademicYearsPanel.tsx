'use client';

import { useCallback, useEffect, useState } from 'react';
import { useToast } from '@/contexts/ToastContext';
import { useConfirm } from '@/components/ui/confirm';
import { Button } from '@/components/ui/Button';
import GenericHeader from '@/components/ui/GenericHeader';
import {
  activateAcademicYear,
  createAcademicYear,
  deleteAcademicYear,
  generateAcademicYearGroups,
  getAcademicYearsList,
} from '@/lib/services/academic-years.service';
import { AcademicYearListItem } from '@/lib/types/academic-year';
import { handleApiError } from '@/lib/api';

export default function AcademicYearsPanel() {
  const { showError, showSuccess } = useToast();
  const { confirm } = useConfirm();
  const [years, setYears] = useState<AcademicYearListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({
    year_start: '',
    year_end: '',
    generate_class_groups: true,
  });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setYears(await getAcademicYearsList());
    } catch (err) {
      showError('Error', handleApiError(err).message);
    } finally {
      setLoading(false);
    }
  }, [showError]);

  useEffect(() => {
    load();
  }, [load]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await createAcademicYear({
        year_start: form.year_start,
        year_end: form.year_end,
        generate_class_groups: form.generate_class_groups,
      });
      showSuccess('Ciclo creado', 'Ya puedes usarlo como origen/destino en reinscripciones.');
      setShowCreate(false);
      setForm({ year_start: '', year_end: '', generate_class_groups: true });
      await load();
    } catch (err) {
      showError('Error', handleApiError(err).message);
    } finally {
      setSaving(false);
    }
  };

  const handleActivate = (year: AcademicYearListItem) => {
    confirm({
      title: 'Activar ciclo escolar',
      description: `¿Activar "${year.description}"?\n\nSolo un ciclo puede estar activo. Los demás quedarán inactivos.`,
      confirmLabel: 'Activar',
      cancelLabel: 'Cancelar',
      onConfirm: async () => {
        setSaving(true);
        try {
          await activateAcademicYear(year.id);
          showSuccess('Ciclo activado');
          await load();
        } catch (err) {
          showError('Error', handleApiError(err).message);
        } finally {
          setSaving(false);
        }
      },
    });
  };

  const handleGenerateGroups = async (year: AcademicYearListItem) => {
    setSaving(true);
    try {
      const result = await generateAcademicYearGroups(year.id);
      showSuccess('Grupos generados', `Se crearon ${result.created} grupos (A–H por grado).`);
      await load();
    } catch (err) {
      showError('Error', handleApiError(err).message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (year: AcademicYearListItem) => {
    confirm({
      title: 'Eliminar ciclo escolar',
      description: `¿Eliminar "${year.description}"? Solo se permite si no tiene inscripciones.`,
      confirmLabel: 'Eliminar',
      cancelLabel: 'Cancelar',
      variant: 'danger',
      onConfirm: async () => {
        setSaving(true);
        try {
          await deleteAcademicYear(year.id);
          showSuccess('Ciclo eliminado');
          await load();
        } catch (err) {
          showError('Error', handleApiError(err).message);
        } finally {
          setSaving(false);
        }
      },
    });
  };

  return (
    <div className="space-y-6">
      <GenericHeader
        title="Ciclos escolares"
        description="Crea el ciclo escolar de la institución antes de junio para poder usarlo en reinscripciones y poder generar matriculas de nuevo ingreso."
      />

      <section className="bg-surface-elevated border rounded-xl p-4 sm:p-6 space-y-4">
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <p className="text-sm text-fg-muted">
            Esto no es preinscripción. Aquí defines el calendario escolar de la institución.
          </p>
          <Button variant="secondary" size="sm" onClick={() => setShowCreate(!showCreate)}>
            {showCreate ? 'Cancelar' : 'Nuevo ciclo escolar'}
          </Button>
        </header>

        {showCreate && (
          <form onSubmit={handleCreate} className="bg-surface-muted border rounded-lg p-4 grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-fg-muted">Año inicio</label>
              <input
                className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
                placeholder="2026"
                maxLength={4}
                value={form.year_start}
                onChange={(e) => setForm({ ...form, year_start: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="text-xs text-fg-muted">Año fin</label>
              <input
                className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
                placeholder="2027"
                maxLength={4}
                value={form.year_end}
                onChange={(e) => setForm({ ...form, year_end: e.target.value })}
                required
              />
            </div>
            <label className="md:col-span-2 flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.generate_class_groups}
                onChange={(e) => setForm({ ...form, generate_class_groups: e.target.checked })}
              />
              Generar grupos A–H para 1°, 2° y 3°
            </label>
            <div className="md:col-span-2">
              <Button type="submit" loading={saving}>Crear ciclo</Button>
            </div>
          </form>
        )}

        {loading ? (
          <p className="text-sm text-fg-muted">Cargando ciclos...</p>
        ) : years.length === 0 ? (
          <p className="text-sm text-fg-muted">No hay ciclos escolares. Crea el primero para habilitar reinscripciones.</p>
        ) : (
          <ul className="space-y-3">
            {years.map((year) => (
              <li key={year.id} className="border rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div>
                  <div className="font-medium text-foreground flex items-center gap-2">
                    {year.description}
                    {year.is_active && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-success/15 text-success">ACTIVO</span>
                    )}
                  </div>
                  <div className="text-sm text-fg-muted">
                    {year.year_start}–{year.year_end} · Grupos: {year.class_groups_count ?? 0}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {!year.is_active && (
                    <Button size="sm" onClick={() => handleActivate(year)} disabled={saving}>
                      Activar
                    </Button>
                  )}
                  <Button size="sm" variant="secondary" onClick={() => handleGenerateGroups(year)} disabled={saving}>
                    Generar grupos
                  </Button>
                  {!year.is_active && (
                    <Button size="sm" variant="danger" onClick={() => handleDelete(year)} disabled={saving}>
                      Eliminar
                    </Button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="bg-primary-soft border border-border rounded-xl p-4 text-sm text-primary">
        <strong>Flujo recomendado:</strong> crea el ciclo destino (ej. 2026-2027) antes de junio → en Reinscripciones usa origen=activo y destino=nuevo → al finalizar promoción, activa el nuevo ciclo.
      </section>
    </div>
  );
}
