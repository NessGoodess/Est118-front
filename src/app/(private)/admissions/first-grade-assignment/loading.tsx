import AdmissionsPanelSkeleton from "@/features/admissions/components/skeletons/admissions-panel-skeleton";

export default function FirstGradeAssignmentLoading() {
  return (
    <AdmissionsPanelSkeleton
      label="Cargando asignación de grupos"
      cards={2}
      rowsPerCard={6}
    />
  );
}
