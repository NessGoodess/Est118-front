/**
 * Admission staff permissions (existing Spatie names).
 */
export const ADMISSION_PERMISSIONS = {
  viewPreEnrollments: "view pre-enrollments",
  createPreEnrollments: "create pre-enrollments",
  editPreEnrollments: "edit pre-enrollments",
  deletePreEnrollments: "delete pre-enrollments",
  viewAdmissionEnrollment: "view admission enrollment",
  editAdmissionEnrollment: "edit admission enrollment",
  manageCycles: "manage admission cycles",
} as const;

export type AdmissionPermission =
  (typeof ADMISSION_PERMISSIONS)[keyof typeof ADMISSION_PERMISSIONS];
