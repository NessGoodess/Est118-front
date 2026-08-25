"use client";

import { use, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PreEnrollmentEditForm } from "@/features/admissions";
import usePreEnrollmentDetail from "@/features/admissions/hooks/use-pre-enrollment-detail";
import PreEnrollmentFormSkeleton from "@/features/admissions/components/skeletons/pre-enrollment-form-skeleton";
import GenericHeader from "@/components/ui/GenericHeader";
import { withPagePermission } from "@/components/guards/withPagePermission";
import { globalToast } from "@/lib/toast/globalToast";

function EditPreEnrollmentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { data, isLoading, error } = usePreEnrollmentDetail(id);

  useEffect(() => {
    if (!error) return;
    globalToast.error(error.message || "Error al obtener pre-inscripción");
    router.replace("/admissions/applications");
  }, [error, router]);

  useEffect(() => {
    if (!data) return;
    const finalized =
      data.status === "approved" ||
      (data.converted_student_id != null && Number(data.converted_student_id) > 0);
    if (finalized) {
      globalToast.error(
        "Esta solicitud ya fue inscrita y no se puede editar."
      );
      router.replace(`/admissions/applications/${id}`);
    }
  }, [data, id, router]);

  const goToDetail = () => router.push(`/admissions/applications/${id}`);

  if (isLoading && !data) {
    return (
      <PreEnrollmentFormSkeleton
        label="Cargando edición de preinscripción"
        showPageHeader
      />
    );
  }

  if (!data) {
    return (
      <p className="py-12 text-center text-fg-muted">
        No se encontró el registro
      </p>
    );
  }

  return (
    <div className="space-y-6">
      <GenericHeader
        title="Editar pre-inscripción"
        description="Modifica los datos del aspirante"
      />
      <PreEnrollmentEditForm
        data={data}
        onSuccess={goToDetail}
        onCancel={() => router.back()}
      />
    </div>
  );
}

export default withPagePermission(EditPreEnrollmentPage, {
  loadingComponent: (
    <PreEnrollmentFormSkeleton
      label="Cargando edición de preinscripción"
      showPageHeader
    />
  ),
});
