import AdmissionsPanelSkeleton from "@/features/admissions/components/skeletons/admissions-panel-skeleton";

export default function AdmissionIntakeSettingsLoading() {
  return (
    <div className="mx-auto w-full max-w-5xl">
      <AdmissionsPanelSkeleton
        label="Cargando política de ingreso"
        cards={3}
        rowsPerCard={4}
      />
    </div>
  );
}
