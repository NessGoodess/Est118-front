//app/(private)/admissions/[id]/page.tsx
// SOLO debe contener esto - ELIMINA el PreEnrollmentsList

"use client"

import { use } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getPreEnrollmentById, resentPDFFolio } from '@/lib/services/admissions.service';
import { useEffect, useState } from 'react';
import { PreEnrollmentApi } from '@/lib/types/admission/preEnrollmentApi';
import PreEnrollmentDetail from '@/components/private/admission/pre-enrollment-detail';
import PreEnrollmentEditForm from '@/components/private/admission/pre-enrollment-edit-form';
import Loading from './loading';
import GenericHeader from '@/components/ui/GenericHeader';
import { handleApiError } from '@/lib/api';
import { globalToast } from '@/lib/toast/globalToast';

export default function PreEnrollmentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const searchParams = useSearchParams();
  const router = useRouter();
  const [preEnrollment, setPreEnrollment] = useState<PreEnrollmentApi | null>(null);
  const [loading, setLoading] = useState(true);

  const isEditMode = searchParams.get('edit') === '1';

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getPreEnrollmentById(parseInt(resolvedParams.id));
        setPreEnrollment(data);
      } catch (err) {
        const apiErr = handleApiError(err);
        globalToast.error(apiErr.message || 'Error al obtener pre-inscripción');
        router.back();
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [resolvedParams.id, router]);

  const handleResentPdf = async () => {
    try {
      const data = await resentPDFFolio(parseInt(resolvedParams.id));
      if (data.status === 'success') {
        globalToast.success('PDF reenviado correctamente');
      }
    } catch (err) {
      globalToast.error(handleApiError(err).message || 'Error al reenviar PDF');
    }
  };

  const handleSwitchToEdit = () => {
    router.push(`/admissions/applications/${resolvedParams.id}?edit=1`);
  };

  const handleEditSuccess = (updated: PreEnrollmentApi) => {
    setPreEnrollment(updated);
    router.push(`/admissions/applications/${resolvedParams.id}`);
  };

  const handleEditCancel = () => {
    router.push(`/admissions/applications/${resolvedParams.id}`);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <button
        type="button"
        onClick={() => router.push('/admissions/applications')}
        className="mb-4 text-primary hover:text-primary-hover flex items-center gap-2 cursor-pointer"
      >
        <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
        Volver a la lista
      </button>

      <div>
        <GenericHeader
          title={isEditMode ? 'Editar pre-inscripción' : 'Información completa'}
          description={isEditMode ? 'Modifica los datos del aspirante' : 'Detalles de la pre-inscripción'}
        />
        {preEnrollment ? (
          isEditMode ? (
            <PreEnrollmentEditForm
              data={preEnrollment}
              onSuccess={handleEditSuccess}
              onCancel={handleEditCancel}
            />
          ) : (
            <PreEnrollmentDetail
              data={preEnrollment}
              onEdit={handleSwitchToEdit}
              showEditButton
              showResentPdfButton
              onResentPdf={handleResentPdf}
              onProcessSaved={(updated) => setPreEnrollment(updated)}
            />
          )
        ) : (
          <p>No se encontró el registro</p>
        )}
      </div>
    </>
  );
}