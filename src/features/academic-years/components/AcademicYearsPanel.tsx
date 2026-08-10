"use client";

import { Button } from "@/components/ui/Button";
import GenericHeader from "@/components/ui/GenericHeader";
import AcademicYearCreateForm from "@/features/academic-years/components/AcademicYearCreateForm";
import AcademicYearList from "@/features/academic-years/components/AcademicYearList";
import { useAcademicYearCapabilities } from "@/features/academic-years/hooks/useAcademicYearCapabilities";
import { useAcademicYearsPanel } from "@/features/academic-years/hooks/useAcademicYearsPanel";

export default function AcademicYearsPanel() {
  const { canCreate, canDelete } = useAcademicYearCapabilities();
  const {
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
  } = useAcademicYearsPanel();

  return (
    <section className="space-y-6">
      <GenericHeader
        title="Ciclos escolares"
        description="Define el calendario real del ciclo (inicio y fin)."
      >
        {canCreate && !showCreate ? (
          <Button variant="primary" size="md" onClick={toggleCreate}>
            Nuevo ciclo escolar
          </Button>
        ) : null}
      </GenericHeader>

      {canCreate && showCreate ? (
        <article className="w-full max-w-7xl rounded-xl border border-border bg-surface-elevated p-4 shadow-sm sm:p-6">
          <AcademicYearCreateForm
            form={form}
            previewLabel={previewLabel}
            saving={saving}
            onChange={setForm}
            onSubmit={handleCreate}
            onCancel={toggleCreate}
          />
        </article>
      ) : null}

      <article className="w-full max-w-7xl space-y-4 rounded-xl border border-border bg-surface-elevated p-4 shadow-sm sm:p-6">
        <AcademicYearList
          years={years}
          loading={loading}
          saving={saving}
          canCreate={canCreate}
          canDelete={canDelete}
          onActivate={handleActivate}
          onGenerateGroups={handleGenerateGroups}
          onDelete={handleDelete}
        />
      </article>
    </section>
  );
}
