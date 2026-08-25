"use client";

import { useRouter } from "next/navigation";
import GenericHeader from "@/components/ui/GenericHeader";
import { PrivatePreEnrollmentTabs } from "@/features/admissions";
import { notifyPreEnrollmentsListChanged } from "@/features/admissions/lib/pre-enrollments-list-events";
import { withPagePermission } from "@/components/guards/withPagePermission";
import PreEnrollmentFormSkeleton from "@/features/admissions/components/skeletons/pre-enrollment-form-skeleton";

function CreatePreEnrollmentPage() {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <GenericHeader
        title="Crear Preinscripción"
        description="Ingresa los datos para una nueva preinscripción"
      />
      <PrivatePreEnrollmentTabs
        onCreated={notifyPreEnrollmentsListChanged}
        onFinished={() => router.replace("/admissions/applications")}
      />
    </div>
  );
}

export default withPagePermission(CreatePreEnrollmentPage, {
  loadingComponent: (
    <PreEnrollmentFormSkeleton
      label="Cargando alta de preinscripción"
      showPageHeader
      showTabs
    />
  ),
});
