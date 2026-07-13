import ReEnrollmentGroupsPanel from '@/components/private/school/re-enrollment/ReEnrollmentGroupsPanel';
import ReEnrollmentStepGate from '@/components/private/school/re-enrollment/ReEnrollmentStepGate';

export default function ReEnrollmentGroupsPage() {
  return (
    <ReEnrollmentStepGate step="groups">
      <ReEnrollmentGroupsPanel />
    </ReEnrollmentStepGate>
  );
}
