"use client";

import { use, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  PreEnrollmentDetail,
  resentPDFFolio,
} from "@/features/admissions";
import usePreEnrollmentDetail from "@/features/admissions/hooks/use-pre-enrollment-detail";
import PreEnrollmentDetailSkeleton from "@/features/admissions/components/skeletons/pre-enrollment-detail-skeleton";
import GenericHeader from "@/components/ui/GenericHeader";
import { Button } from "@/components/ui/Button";
import { IconByName } from "@/components/ui/icons";
import { withPagePermission } from "@/components/guards/withPagePermission";
import { globalToast } from "@/lib/toast/globalToast";
import { handleApiError } from "@/lib/api";

function PreEnrollmentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const pathname = usePathname();
  const { data, setData, isLoading, error, refetch } =
    usePreEnrollmentDetail(id);
  const skipPathRefetch = useRef(true);

  useEffect(() => {
    if (!error) return;
    globalToast.error(error.message || "Error al obtener pre-inscripción");
    router.replace("/admissions/applications");
  }, [error, router]);

  useEffect(() => {
    if (pathname !== `/admissions/applications/${id}`) return;
    if (skipPathRefetch.current) {
      skipPathRefetch.current = false;
      return;
    }
    void refetch();
  }, [pathname, id, refetch]);

  const handleResentPdf = async () => {
    try {
      const result = await resentPDFFolio(Number.parseInt(id, 10));
      if (result.status === "success") {
        globalToast.success("PDF reenviado correctamente");
      }
    } catch (err) {
      globalToast.error(
        handleApiError(err).message || "Error al reenviar PDF"
      );
    }
  };

  if (isLoading && !data) {
    return <PreEnrollmentDetailSkeleton showPageHeader />;
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
        title="Información completa"
        description="Detalles de la pre-inscripción"
      >
        <Button
          variant="ghost"
          onClick={() => router.push("/admissions/applications")}
          leftIcon={<IconByName name="chevronLeft" className="h-4 w-4" />}
        >
          Volver
        </Button>
      </GenericHeader>
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
    </div>
  );
}

export default withPagePermission(PreEnrollmentDetailPage, {
  loadingComponent: <PreEnrollmentDetailSkeleton showPageHeader />,
});
