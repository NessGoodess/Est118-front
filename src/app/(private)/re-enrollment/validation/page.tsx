import ReEnrollmentStepGate from '@/components/private/school/re-enrollment/ReEnrollmentStepGate';
import ReEnrollmentValidationPanel from '@/components/private/school/re-enrollment/ReEnrollmentValidationPanel';

export default function ReEnrollmentValidationPage() {
  return (
    <ReEnrollmentStepGate step="validation">
      <ReEnrollmentValidationPanel />
    </ReEnrollmentStepGate>
  );
}
