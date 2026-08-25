"use client";

import { PrivatePreEnrollmentTabs } from "@/features/admissions";
import AdmissionsRouteModal, {
  useCloseAdmissionsModalAndRefreshList,
} from "@/features/admissions/components/applications/modal/admissions-route-modal";
import { notifyPreEnrollmentsListChanged } from "@/features/admissions/lib/pre-enrollments-list-events";

export default function CreatePreEnrollmentModalPage() {
  const onFinished = useCloseAdmissionsModalAndRefreshList();

  return (
    <AdmissionsRouteModal
      title="Crear Preinscripción"
      maxWidth="6xl"
      reopenKey="create"
    >
      <PrivatePreEnrollmentTabs
        onCreated={notifyPreEnrollmentsListChanged}
        onFinished={onFinished}
      />
    </AdmissionsRouteModal>
  );
}
