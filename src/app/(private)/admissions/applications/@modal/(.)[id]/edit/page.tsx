"use client";

import { use, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PreEnrollmentEditForm } from "@/features/admissions";
import usePreEnrollmentDetail from "@/features/admissions/hooks/use-pre-enrollment-detail";
import PreEnrollmentFormSkeleton from "@/features/admissions/components/skeletons/pre-enrollment-form-skeleton";
import AdmissionsRouteModal, {
  useCancelAdmissionsModal,
  useCloseAdmissionsModal,
} from "@/features/admissions/components/applications/modal/admissions-route-modal";
import { globalToast } from "@/lib/toast/globalToast";

export default function EditPreEnrollmentModalPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const close = useCloseAdmissionsModal();
  const cancel = useCancelAdmissionsModal();
  const { data, isLoading, error } = usePreEnrollmentDetail(id);

  useEffect(() => {
    if (!error) return;
    globalToast.error(error.message || "Error al obtener pre-inscripción");
    close();
  }, [error, close]);

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

  const onSuccess = () => router.push(`/admissions/applications/${id}`);

  return (
    <AdmissionsRouteModal
      title="Editar Pre-inscripción"
      maxWidth="6xl"
      reopenKey={`edit-${id}`}
    >
      {isLoading && !data ? (
        <PreEnrollmentFormSkeleton label="Cargando edición de preinscripción" />
      ) : data ? (
        <PreEnrollmentEditForm
          data={data}
          onSuccess={onSuccess}
          onCancel={cancel}
        />
      ) : (
        <p className="py-12 text-center text-fg-muted">
          No se encontró el registro
        </p>
      )}
    </AdmissionsRouteModal>
  );
}
