"use client";

import StudentInfoSection from "./info/StudentInfoSection";
import StudentAddressSection from "./address/StudentAddressSection";
import StudentEnrollmentSection from "./StudentEnrollmentSection";
import StudentSubjectsSection from "./StudentSubjectsSection";
import StudentEnrollmentsHistory from "./StudentEnrollmentsHistory";
import StudentGuardiansSection from "./StudentGuardiansSection";
import { useUpdateStudent } from "@/features/students/hooks/detail/useUpdateStudent";
import type { StudentDetailPayload } from "@/features/students/types/student-profile";
import type {
  StudentAddressUpdatePayload,
  StudentProfileUpdatePayload,
} from "@/features/students/schemas/student-update.schema";

interface StudentDetailViewProps {
  detail: StudentDetailPayload;
  canEdit: boolean;
  onDetailUpdated: (detail: StudentDetailPayload) => void;
}

export default function StudentDetailView({
  detail,
  canEdit,
  onDetailUpdated,
}: StudentDetailViewProps) {
  const { save, saving } = useUpdateStudent(detail.student_info.id, onDetailUpdated);

  const saveProfile = async (profile: StudentProfileUpdatePayload) => save({ profile });
  const saveAddress = async (address: StudentAddressUpdatePayload) => save({ address });

  return (
    <div className="space-y-2 lg:space-y-4 2xl:space-y-8">

      <StudentInfoSection
        info={detail.student_info}
        canEdit={canEdit}
        saving={saving}
        onSave={saveProfile}
      />
      <StudentAddressSection
        address={detail.address_detail}
        canEdit={canEdit}
        saving={saving}
        onSave={saveAddress}
      />
      <StudentEnrollmentSection enrollment={detail.current_enrollment} />
      <StudentSubjectsSection subjects={detail.subjects} />
      <StudentEnrollmentsHistory enrollments={detail.all_enrollments} />
      <StudentGuardiansSection guardians={detail.guardians} />
    </div>
  );
}
