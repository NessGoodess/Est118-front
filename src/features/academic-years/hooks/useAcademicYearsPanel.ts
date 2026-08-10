"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useToast } from "@/contexts/ToastContext";
import { useConfirm } from "@/components/ui/confirm";
import {
  activateAcademicYear,
  createAcademicYear,
  deleteAcademicYear,
  generateAcademicYearGroups,
  getAcademicYearsList,
} from "@/features/academic-years/services/academic-years.service";
import type { AcademicYearListItem } from "@/features/academic-years/types/academic-year";
import { handleApiError } from "@/lib/api";

export type AcademicYearCreateFormState = {
  starts_on: string;
  ends_on: string;
  generate_class_groups: boolean;
};

const emptyForm: AcademicYearCreateFormState = {
  starts_on: "",
  ends_on: "",
  generate_class_groups: true,
};

export function useAcademicYearsPanel() {
  const { showError, showSuccess } = useToast();
  const { confirm } = useConfirm();
  const [years, setYears] = useState<AcademicYearListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState<AcademicYearCreateFormState>(emptyForm);

  const previewLabel = useMemo(() => {
    if (!form.starts_on || !form.ends_on) return null;
    const startYear = form.starts_on.slice(0, 4);
    const endYear = form.ends_on.slice(0, 4);
    return `Año escolar ${startYear}-${endYear}`;
  }, [form.starts_on, form.ends_on]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setYears(await getAcademicYearsList());
    } catch (err) {
      showError("Error", handleApiError(err).message);
    } finally {
      setLoading(false);
    }
  }, [showError]);

  useEffect(() => {
    load();
  }, [load]);

  const toggleCreate = useCallback(() => {
    setShowCreate((open) => {
      if (open) setForm(emptyForm);
      return !open;
    });
  }, []);

  const handleCreate = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setSaving(true);
      try {
        await createAcademicYear({
          starts_on: form.starts_on,
          ends_on: form.ends_on,
          generate_class_groups: form.generate_class_groups,
        });
        showSuccess(
          "Ciclo creado",
          "Ya puedes usarlo como origen/destino en reinscripciones."
        );
        setShowCreate(false);
        setForm(emptyForm);
        await load();
      } catch (err) {
        showError("Error", handleApiError(err).message);
      } finally {
        setSaving(false);
      }
    },
    [form, load, showError, showSuccess]
  );

  const handleActivate = useCallback(
    (year: AcademicYearListItem) => {
      confirm({
        title: "Activar ciclo escolar",
        description: `¿Activar "${year.description}"?\n\nSolo un ciclo puede estar activo. Los demás quedarán inactivos.`,
        confirmLabel: "Activar",
        cancelLabel: "Cancelar",
        onConfirm: async () => {
          setSaving(true);
          try {
            await activateAcademicYear(year.id);
            showSuccess("Ciclo activado");
            await load();
          } catch (err) {
            showError("Error", handleApiError(err).message);
          } finally {
            setSaving(false);
          }
        },
      });
    },
    [confirm, load, showError, showSuccess]
  );

  const handleGenerateGroups = useCallback(
    async (year: AcademicYearListItem) => {
      setSaving(true);
      try {
        const result = await generateAcademicYearGroups(year.id);
        showSuccess(
          "Grupos generados",
          `Se crearon ${result.created} grupos (A–H por grado).`
        );
        await load();
      } catch (err) {
        showError("Error", handleApiError(err).message);
      } finally {
        setSaving(false);
      }
    },
    [load, showError, showSuccess]
  );

  const handleDelete = useCallback(
    (year: AcademicYearListItem) => {
      confirm({
        title: "Eliminar ciclo escolar",
        description: `¿Eliminar "${year.description}"? Solo se permite si no tiene inscripciones.`,
        confirmLabel: "Eliminar",
        cancelLabel: "Cancelar",
        variant: "danger",
        onConfirm: async () => {
          setSaving(true);
          try {
            await deleteAcademicYear(year.id);
            showSuccess("Ciclo eliminado");
            await load();
          } catch (err) {
            showError("Error", handleApiError(err).message);
          } finally {
            setSaving(false);
          }
        },
      });
    },
    [confirm, load, showError, showSuccess]
  );

  return {
    years,
    loading,
    saving,
    showCreate,
    form,
    previewLabel,
    setForm,
    toggleCreate,
    handleCreate,
    handleActivate,
    handleGenerateGroups,
    handleDelete,
  };
}
