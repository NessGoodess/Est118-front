'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { DataTable } from '@/components/ui/DataTable';
import { EnhancedTableConfig } from '@/lib/types/data-table';
import { useReEnrollment } from '@/contexts/ReEnrollmentContext';
import {
  getReEnrollmentApplications,
  updateReEnrollmentApplication,
} from '@/lib/services/re-enrollment.service';
import { ReEnrollmentApplicationRow } from '@/lib/types/school/re-enrollment';
import { useToast } from '@/contexts/ToastContext';
import { handleApiError } from '@/lib/api';
import { Button } from '@/components/ui/Button';

const validationTableConfig: EnhancedTableConfig<ReEnrollmentApplicationRow> = {
  columns: [
    { key: 'student_name', label: 'Alumno', sortable: true, searchable: true },
    { key: 'grade', label: 'Grado', sortable: true },
    { key: 'group', label: 'Grupo', sortable: true },
    { key: 'status', label: 'Estado', sortable: true, render: 'status-badge' },
    { key: 'no_debts', label: 'Sin adeudos', render: 'bool-badge' },
  ],
  selectable: false,
  searchable: true,
  sortable: true,
  itemsPerPage: 25,
};

const validationRenderers = {
  'status-badge': (value: unknown) => (
    <span className="text-xs px-2 py-0.5 rounded-full border bg-slate-50">{String(value)}</span>
  ),
  'bool-badge': (value: unknown) => (
    <span className={`text-xs px-2 py-0.5 rounded-full ${value ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
      {value === null ? '—' : value ? 'Sí' : 'No'}
    </span>
  ),
};

const CHECKLIST: Array<{ key: keyof ReEnrollmentApplicationRow; label: string }> = [
  { key: 'passed_cycle', label: 'Aprobó el ciclo' },
  { key: 'documents_complete', label: 'Documentación completa' },
  { key: 'guardian_updated', label: 'Tutor actualizado' },
  { key: 'phone_updated', label: 'Teléfono actualizado' },
  { key: 'address_updated', label: 'Dirección actualizada' },
  { key: 'photo_updated', label: 'Fotografía actualizada' },
  { key: 'no_debts', label: 'Sin adeudos' },
];

export default function ReEnrollmentValidationPanel() {
  const { activePeriod, refetch } = useReEnrollment();
  const { showError, showSuccess } = useToast();
  const [rows, setRows] = useState<ReEnrollmentApplicationRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<ReEnrollmentApplicationRow | null>(null);
  const [gradeFilter, setGradeFilter] = useState('all');
  const [groupFilter, setGroupFilter] = useState('all');
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    if (!activePeriod) return;
    setLoading(true);
    try {
      const data = await getReEnrollmentApplications(activePeriod.id, {
        grade: gradeFilter === 'all' ? undefined : gradeFilter,
        group: groupFilter === 'all' ? undefined : groupFilter,
      });
      setRows(data);
    } catch (err) {
      showError('Error', handleApiError(err).message);
    } finally {
      setLoading(false);
    }
  }, [activePeriod, gradeFilter, groupFilter, showError]);

  useEffect(() => { load(); }, [load]);

  const gradeOptions = useMemo(() => Array.from(new Set(rows.map((r) => r.grade).filter(Boolean))), [rows]);
  const groupOptions = useMemo(() => Array.from(new Set(rows.map((r) => r.group).filter(Boolean))), [rows]);

  const saveChecklist = async () => {
    if (!activePeriod || !selected) return;
    setSaving(true);
    try {
      const payload = Object.fromEntries(
        CHECKLIST.map(({ key }) => [key, selected[key]])
      );
      await updateReEnrollmentApplication(activePeriod.id, selected.id, {
        ...payload,
        status: 'in_review',
        comments: selected.comments,
      });
      showSuccess('Validación guardada');
      setSelected(null);
      await load();
      await refetch();
    } catch (err) {
      showError('Error', handleApiError(err).message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <section className="bg-white border rounded-xl p-4 sm:p-6 space-y-3">
        <header>
          <h2 className="text-lg font-semibold">Validación</h2>
          <p className="text-sm text-gray-500">
            Revisa por grado/grupo. No promuevas individualmente: primero valida, luego promueve en bloque.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <select className="rounded-lg border px-3 py-2 text-sm bg-white" value={gradeFilter}
            onChange={(e) => setGradeFilter(e.target.value)}>
            <option value="all">Todos los grados</option>
            {gradeOptions.map((g) => <option key={g} value={g!}>{g}</option>)}
          </select>
          <select className="rounded-lg border px-3 py-2 text-sm bg-white" value={groupFilter}
            onChange={(e) => setGroupFilter(e.target.value)}>
            <option value="all">Todos los grupos</option>
            {groupOptions.map((g) => <option key={g} value={g!}>{g}</option>)}
          </select>
        </div>

        <DataTable
          config={validationTableConfig}
          data={rows}
          renderers={validationRenderers}
          loading={loading}
          onRowClick={setSelected}
          emptyMessage="No hay alumnos en este periodo."
          minRows={8}
        />
      </section>

      {selected && (
        <section className="bg-white border rounded-xl p-4 sm:p-6 space-y-4">
          <h3 className="font-semibold">{selected.student_name} · {selected.grade}{selected.group}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {CHECKLIST.map(({ key, label }) => (
              <label key={key} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={Boolean(selected[key])}
                  onChange={(e) => setSelected({ ...selected, [key]: e.target.checked })}
                />
                {label}
              </label>
            ))}
          </div>
          <textarea
            className="w-full rounded-lg border px-3 py-2 text-sm"
            placeholder="Comentarios"
            value={selected.comments ?? ''}
            onChange={(e) => setSelected({ ...selected, comments: e.target.value })}
          />
          <div className="flex gap-2">
            <Button onClick={saveChecklist} loading={saving}>Guardar validación</Button>
            <Button variant="secondary" onClick={() => setSelected(null)}>Cerrar</Button>
          </div>
        </section>
      )}
    </div>
  );
}
