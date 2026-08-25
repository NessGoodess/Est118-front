"use client";

import GenericHeader from "@/components/ui/GenericHeader";
import { FirstGradeAssignmentPanel } from "@/features/admissions";
import AdmissionsPanelSkeleton from "@/features/admissions/components/skeletons/admissions-panel-skeleton";
import { withPagePermission } from "@/components/guards/withPagePermission";

function FirstGradeAssignmentPage() {
  return (
    <div className="space-y-6">
      <GenericHeader
        title="Asignación de grupos 1°"
        description="Simula y aplica la distribución de nuevos ingresos según la política de admisión."
      />
      <FirstGradeAssignmentPanel />
    </div>
  );
}

export default withPagePermission(FirstGradeAssignmentPage, {
  loadingComponent: (
    <AdmissionsPanelSkeleton
      label="Cargando asignación de grupos"
      cards={2}
      rowsPerCard={6}
    />
  ),
});
