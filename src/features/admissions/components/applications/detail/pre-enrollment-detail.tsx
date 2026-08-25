"use client";

import type { PreEnrollmentApi } from "@/features/admissions/types/pre-enrollment-api";
import PreEnrollmentProcessPanel from "@/features/admissions/components/applications/pre-enrollment-process-panel";
import { useAdmissionCapabilities } from "@/features/admissions/hooks/capabilities/useAdmissionCapabilities";
import DetailHeader from "./detail-header";
import { AcademicSection, AddressSection, GuardianSection, PersonalSection, VoucherSection, WorkshopsSection, } from "./sections";

export interface PreEnrollmentDetailProps {
  data: PreEnrollmentApi;
  onEdit?: () => void;
  showEditButton?: boolean;
  showResentPdfButton?: boolean;
  onResentPdf?: () => void;
  onProcessSaved?: (updated: PreEnrollmentApi) => void;
}

export default function PreEnrollmentDetail({
  data,
  onEdit,
  showEditButton,
  showResentPdfButton,
  onResentPdf,
  onProcessSaved,
}: PreEnrollmentDetailProps) {
  const { canEdit, canViewEnrollment } = useAdmissionCapabilities();
  const isFinalized =
    data.status === "approved" ||
    (data.converted_student_id != null && Number(data.converted_student_id) > 0);

  return (
    <div className="mx-auto space-y-6">
      <DetailHeader
        data={data}
        showEditButton={!!showEditButton && canEdit && !isFinalized}
        showResentPdfButton={!!showResentPdfButton && canEdit}
        onEdit={onEdit}
        onResentPdf={onResentPdf}
      />

      {onProcessSaved && canViewEnrollment ? (
        <PreEnrollmentProcessPanel data={data} onSaved={onProcessSaved} />
      ) : null}

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 bg-surface-elevated rounded-lg p-4">
        <div className="space-y-8">
          <PersonalSection data={data} />
          <GuardianSection data={data} />
          <WorkshopsSection data={data} />
        </div>
        <div className="space-y-8">
          <AcademicSection data={data} />
          <AddressSection data={data} />
          <VoucherSection data={data} />
        </div>
      </div>
    </div>
  );
}
