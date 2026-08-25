"use client";

import GenericHeader from "@/components/ui/GenericHeader";
import { AdmissionIntakeSettingsForm } from "@/features/admissions";
import AdmissionsPanelSkeleton from "@/features/admissions/components/skeletons/admissions-panel-skeleton";
import { withPagePermission } from "@/components/guards/withPagePermission";

function AdmissionIntakeSettingsPage() {
  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">
      <GenericHeader
        title="Política de ingreso"
        description="Excepciones al convertir, puntaje para grupos, hermanos/compañeros e ingresos tardíos."
      />
      <AdmissionIntakeSettingsForm />
    </div>
  );
}

export default withPagePermission(AdmissionIntakeSettingsPage, {
  loadingComponent: (
    <div className="mx-auto w-full max-w-5xl">
      <AdmissionsPanelSkeleton
        label="Cargando política de ingreso"
        cards={3}
        rowsPerCard={4}
      />
    </div>
  ),
});
