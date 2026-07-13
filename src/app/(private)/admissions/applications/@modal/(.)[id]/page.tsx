//app/(private)/admissions/@modal/(.)[id]/page.tsx

"use client"

import { use } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getPreEnrollmentById, resentPDFFolio } from '@/lib/services/admissions.service';
import Modal from '@/components/ui/Modal';
import PreEnrollmentDetail from '@/components/private/admission/pre-enrollment-detail';
import PreEnrollmentEditForm from '@/components/private/admission/pre-enrollment-edit-form';
import { useEffect, useState } from 'react';
import { PreEnrollmentApi } from '@/lib/types/admission/preEnrollmentApi';
import Loading from '../../[id]/loading';
import { handleApiError } from '@/lib/config/api';
import { globalToast } from '@/lib/toast/globalToast';
import NewPreEnrollment from '../../new/page';

export default function InterceptedModal({
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
    if (resolvedParams.id === 'new') {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getPreEnrollmentById(parseInt(resolvedParams.id));
        setPreEnrollment(data);
      } catch (err) {
        globalToast.error(handleApiError(err).message || 'Error al obtener pre-inscripción');
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
  const handleClose = () => {
    router.back();
  };

  const handleSwitchToEdit = () => {
    router.replace(`/admissions/applications/${resolvedParams.id}?edit=1`, { scroll: false });
  };

  const handleEditSuccess = (updated: PreEnrollmentApi) => {
    setPreEnrollment(updated);
    router.replace(`/admissions/applications/${resolvedParams.id}`, { scroll: false });
  };

  const handleEditCancel = () => {
    router.replace(`/admissions/applications/${resolvedParams.id}`, { scroll: false });
  };

  if (resolvedParams.id === 'new') {
    return (
      <Modal
        isOpen={true}
        onClose={handleClose}
        title="Crear Preinscripción"
        maxWidth="6xl"
      >
        <div className="max-h-[85dvh] overflow-y-auto pr-2">
          <NewPreEnrollment />
        </div>
      </Modal>
    );
  }

  return (
    <Modal
      isOpen={true}
      onClose={handleClose}
      title={isEditMode ? 'Editar Pre-inscripción' : 'Detalles de Pre-inscripción'}
      maxWidth="6xl"
    >
      {loading ? (
        <Loading />
      ) : preEnrollment ? (
        isEditMode ? (
          <div className="max-h-[85dvh] overflow-y-auto pr-2">
            <PreEnrollmentEditForm
              data={preEnrollment}
              onSuccess={handleEditSuccess}
              onCancel={handleEditCancel}
            />
          </div>
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
      ) : null}
    </Modal>
  );
}

