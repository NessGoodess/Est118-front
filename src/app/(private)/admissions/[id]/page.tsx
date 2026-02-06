//app/(private)/admissions/[id]/page.tsx
// SOLO debe contener esto - ELIMINA el PreEnrollmentsList

"use client"

import { use } from 'react';
import { useRouter } from 'next/navigation';
import { getPreEnrollmentById } from '@/lib/services/admissions.service';
import { useToast } from '@/contexts/ToastContext';
import { useEffect, useState } from 'react';
import { PreEnrollmentApi } from '@/lib/types/admission/preEnrollmentApi';
import PreEnrollmentDetail from '@/components/private/admission/pre-enrollment-detail';
import Loading from './loading';
import GenericHeader from '@/components/ui/GenericHeader';

export default function PreEnrollmentPage({
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
        router.push('/admissions');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [resolvedParams.id, router, showError]);

  if (loading) {
    return (
      <Loading />
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => router.push('/admissions')}
        className="mb-4 text-blue-600 hover:text-blue-900 flex items-center gap-2"
      >
        <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
        Volver a la lista
      </button>

      <div>
        <GenericHeader title="Información completa" description="Detalles de la pre-inscripción" />
        {preEnrollment ? (
          <PreEnrollmentDetail data={preEnrollment} />
        ) : (
          <p>No se encontró el registro</p>
        )}
      </div>
    </>
  );
}