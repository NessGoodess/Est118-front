//app/(private)/admissions/layout.tsx

import { ReactNode, Suspense } from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Preinscripciones',
  description: 'Realiza la preinscripción en línea para el ciclo escolar vigente de la institución.',
};

export default function AdmissionsLayout({
  children,
  modal,
}: {
  children: ReactNode;
  modal: ReactNode;
}) {
  return (
    <>
      {children}
      <Suspense fallback={null}>{modal}</Suspense>
    </>
  );
}

