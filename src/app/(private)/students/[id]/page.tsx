"use client";

import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import GenericHeader from "@/components/ui/GenericHeader";
import ContentLayout from "@/components/ui/ContentLayout";
import { Button } from "@/components/ui/Button";
import { IconByName } from "@/components/ui/icons/";
import { withPagePermission } from "@/components/guards/withPagePermission";
import { handleApiError } from "@/lib/api";
import {
  getStudentDetail,
  StudentDetailPayload,
  StudentPhotoModal,
  StudentPhotoLightbox,
  useStudentCapabilities,
  StudentDetailView,
} from "@/features/students";
import StudentPhotoSection from "@/features/students/components/detail/StudentPhotoSection";
import StudentDetailSkeleton, {
  StudentPhotoSkeleton,
} from "@/features/students/components/detail/StudentDetailSkeleton";
import { invalidateStudentsByGradeCache } from "@/features/students/hooks/list/useStudentsByGrade";

function StudentProfilePage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);
  const { canManagePhoto, canViewPhoto, canEdit } = useStudentCapabilities();
  const [detail, setDetail] = useState<StudentDetailPayload | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [photoOpen, setPhotoOpen] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const load = useCallback(async () => {
    if (!Number.isFinite(id) || id < 1) {
      setError("ID inválido");
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      setDetail(await getStudentDetail(id));
    } catch (e) {
      setError(handleApiError(e).message || "No se pudo cargar el alumno");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  const displayName =
    detail?.student_info.full_name || detail?.student_info.name || "Expediente";

  const photoUrl = useMemo(() => {
    if (!detail?.photos) return null;
    return (
      detail.photos.original_url ||
      detail.photos.profile_url ||
      detail.photos.thumbnail_url ||
      null
    );
  }, [detail?.photos]);

  const lightboxUrl = useMemo(() => {
    if (!detail?.photos) return null;
    return detail.photos.original_url || detail.photos.profile_url || null;
  }, [detail?.photos]);

  if (!Number.isFinite(id) || id < 1) {
    return <div className="text-sm text-danger">Identificador de alumno no válido.</div>;
  }

  return (
    <>
      <GenericHeader
        title="Expediente del estudiante"
        description="Datos personales, académicos, domicilio y fotografía."
      >
        <Button
          variant="ghost"
          size="sm"
          leftIcon={<IconByName name="arrowLeft" className="w-5 h-5" />}
          onClick={() => router.push("/students")}
          className="hidden lg:inline-flex bg-amber-600"
        >
          Volver al directorio
        </Button>
      </GenericHeader>

      <ContentLayout
        className="mt-6"
        aria-label="Expediente del estudiante"
        side={
          loading ? (
            <StudentPhotoSkeleton />
          ) : detail ? (
            <StudentPhotoSection
              alt={displayName}
              photoUrl={photoUrl}
              canViewPhoto={canViewPhoto}
              canManagePhoto={canManagePhoto}
              onOpenLightbox={() => setLightboxOpen(true)}
              onOpenPhotoCapture={() => setPhotoOpen(true)}
            />
          ) : undefined
        }
      >
        {loading && <StudentDetailSkeleton />}

        {error && !loading && (
          <div className="rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
            {error}
          </div>
        )}

        {detail && !loading && (
          <StudentDetailView
            detail={detail}
            canEdit={canEdit}
            onDetailUpdated={setDetail}
          />
        )}
      </ContentLayout>

      {canManagePhoto && (
        <StudentPhotoModal
          student={
            detail?.student_info
              ? {
                  id: detail.student_info.id,
                  name: displayName,
                }
              : null
          }
          isOpen={photoOpen}
          onClose={() => setPhotoOpen(false)}
          onSaved={() => {
            invalidateStudentsByGradeCache();
            void load();
          }}
        />
      )}

      {canViewPhoto && (
        <StudentPhotoLightbox
          isOpen={lightboxOpen}
          imageUrl={lightboxUrl}
          alt={displayName}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </>
  );
}

export default withPagePermission(StudentProfilePage);
