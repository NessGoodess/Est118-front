//app/(private)/admissions/@modal/(.)[id]/page.tsx

"use client" 

import { use } from 'react';
import { useRouter } from 'next/navigation';
import { getPreEnrollmentById } from '@/lib/services/admissions.service';
import Modal from '@/components/ui/Modal';
import PreEnrollmentDetail from '@/components/private/admission/pre-enrollment-detail';
import { useToast } from '@/contexts/ToastContext';
import { useEffect, useState } from 'react';
import { PreEnrollmentApi } from '@/lib/types/admission/preEnrollmentApi';
import Loading from '../../[id]/loading';
export default function InterceptedModal({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { showError } = useToast();
  const [preEnrollment, setPreEnrollment] = useState<PreEnrollmentApi | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getPreEnrollmentById(parseInt(resolvedParams.id));
        setPreEnrollment(data);
      } catch {
        showError('Error', 'No se pudo cargar los detalles de la pre-inscripción');
        router.back();
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [resolvedParams.id, router, showError]);

  const handleClose = () => {
    router.back();
  };

  return (
    <Modal
      isOpen={true}
      onClose={handleClose}
      title="Detalles de Pre-inscripción"
      maxWidth="min-h-dvh"
    >
      {loading ? (
        <Loading />
      ) : preEnrollment ? (
        <PreEnrollmentDetail data={preEnrollment} />
      ) : null}
    </Modal>
  );
}

