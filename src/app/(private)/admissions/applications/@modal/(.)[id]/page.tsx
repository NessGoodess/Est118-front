"use client";

import { use, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  PreEnrollmentDetail,
  PrivatePreEnrollmentTabs,
  resentPDFFolio,
} from "@/features/admissions";
import usePreEnrollmentDetail from "@/features/admissions/hooks/use-pre-enrollment-detail";
import PreEnrollmentDetailSkeleton from "@/features/admissions/components/skeletons/pre-enrollment-detail-skeleton";
import AdmissionsRouteModal, {
  useCloseAdmissionsModal,
  useCloseAdmissionsModalAndRefreshList,
} from "@/features/admissions/components/applications/modal/admissions-route-modal";
import { notifyPreEnrollmentsListChanged } from "@/features/admissions/lib/pre-enrollments-list-events";
import { globalToast } from "@/lib/toast/globalToast";
import { handleApiError } from "@/lib/api";

/**
 * Soft-nav a /admissions/applications/[id].
 * Nota: a veces Next matchea "create" aquí en vez de (.)create → fallback a crear.
 */
export default function ViewPreEnrollmentModalPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const close = useCloseAdmissionsModal();
  const closeAndRefresh = useCloseAdmissionsModalAndRefreshList();
  const isCreate = id === "create";
  const numericId = Number.parseInt(id, 10);
  const isNumericId = !Number.isNaN(numericId);

  const { data, setData, isLoading, error } = usePreEnrollmentDetail(
    isCreate || !isNumericId ? null : id
  );

  useEffect(() => {
    if (isCreate || !isNumericId) return;
    if (!error) return;
    globalToast.error(error.message || "Error al obtener pre-inscripción");
    close();
  }, [error, close, isCreate, isNumericId]);

  const handleResentPdf = async () => {
    try {
      const result = await resentPDFFolio(numericId);
      if (result.status === "success") {
        globalToast.success("PDF reenviado correctamente");
      }
    } catch (err) {
      globalToast.error(
        handleApiError(err).message || "Error al reenviar PDF"
      );
    }
  };

  if (isCreate) {
    return (
      <AdmissionsRouteModal
        title="Crear Preinscripción"
        maxWidth="6xl"
        reopenKey="create"
      >
        <PrivatePreEnrollmentTabs
          onCreated={notifyPreEnrollmentsListChanged}
          onFinished={closeAndRefresh}
        />
      </AdmissionsRouteModal>
    );
  }

  if (!isNumericId) {
    return (
      <AdmissionsRouteModal
        title="Preinscripción"
        maxWidth="6xl"
        reopenKey={`invalid-${id}`}
      >
        <p className="py-12 text-center text-fg-muted">
          No se encontró el registro
        </p>
      </AdmissionsRouteModal>
    );
  }

  return (
    <AdmissionsRouteModal
      title="Detalles de Pre-inscripción"
      maxWidth="6xl"
      reopenKey={`view-${id}`}
    >
      {isLoading && !data ? (
        <PreEnrollmentDetailSkeleton />
      ) : data ? (
        <PreEnrollmentDetail
          data={data}
          onEdit={() =>
            router.push(`/admissions/applications/${id}/edit`)
          }
          showEditButton
          showResentPdfButton
          onResentPdf={handleResentPdf}
          onProcessSaved={(updated) => setData(updated)}
        />
      ) : (
        <p className="py-12 text-center text-fg-muted">
          No se encontró el registro
        </p>
      )}
    </AdmissionsRouteModal>
  );
}
