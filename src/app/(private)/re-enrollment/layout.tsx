'use client';

import { ReactNode } from 'react';
import { ReEnrollmentProvider } from '@/contexts/ReEnrollmentContext';
import ReEnrollmentWizard from '@/components/private/school/re-enrollment/ReEnrollmentWizard';

export default function ReEnrollmentLayout({ children }: { children: ReactNode }) {
  return (
    <ReEnrollmentProvider>
      <div className="space-y-6">
        <ReEnrollmentWizard />
        {children}
      </div>
    </ReEnrollmentProvider>
  );
}
