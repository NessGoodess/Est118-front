// Components — applications
export { default as AdmissionCycleCard } from "./components/applications/admission-cycle-card";
export { default as PreEnrollmentsList } from "./components/applications/list/pre-enrollments-list";
export { default as PreEnrollmentDetail } from "./components/applications/detail";
export { default as PreEnrollmentEditForm } from "./components/applications/pre-enrollment-edit-form";
export { default as PreEnrollmentProcessPanel } from "./components/applications/pre-enrollment-process-panel";

// Components — skeletons
export { default as PreEnrollmentsListSkeleton } from "./components/skeletons/pre-enrollments-list-skeleton";
export { default as PreEnrollmentDetailSkeleton } from "./components/skeletons/pre-enrollment-detail-skeleton";
export { default as PreEnrollmentFormSkeleton } from "./components/skeletons/pre-enrollment-form-skeleton";
export { default as AdmissionsPanelSkeleton } from "./components/skeletons/admissions-panel-skeleton";
export { default as AdmissionCyclesSkeleton } from "./components/skeletons/admission-cycles-skeleton";

// Components — create
export { default as PrivatePreEnrollmentTabs } from "./components/applications/add/private-pre-enrollment-tabs";

export { default as AdmissionsPublicPageSkeleton } from "./public/skeletons/admissions-public-page-skeleton";

// Components — public portal
export { default as AdmissionsOpenFlow } from "./public/AdmissionsOpenFlow";
export { default as WizardForm } from "./public/WizardForm";
export { default as AdmissionsSchoolHero } from "./public/content/admissions-school-hero";
export { default as AdmissionsStatusPanel } from "./public/content/admissions-status-panel";
export { default as AdmissionsRequirementsSection } from "./public/content/admissions-requirements-section";
export { default as AdmissionsPreparationSection } from "./public/content/admissions-preparation-section";
export {
  AdmissionsFormProvider,
  useAdmissionsForm,
} from "./public/context/AdmissionsFormContext";

// Components — convert / first-grade / settings / promotion
export { default as ConvertToStudentModal } from "./components/convert/convert-to-student-modal";
export type { ConvertPreEnrollmentTarget } from "./components/convert/convert-to-student-modal";
export { default as FirstGradeAssignmentPanel } from "./components/first-grade/first-grade-assignment-panel";
export { default as AdmissionIntakeSettingsForm } from "./components/settings/admission-intake-settings-form";
export { default as AdmissionSettingsForm } from "./components/settings/admission-settings-form";
export { default as PromotionDecisionsPanel } from "./components/promotion/promotion-decisions-panel";
export { default as PromotionRunPanel } from "./components/promotion/promotion-run-panel";

// Hooks
export { useAdmissionIntakeSettings } from "./hooks/use-admission-intake-settings";
export { usePreEnrollments } from "./hooks/use-pre-enrollments";
export { useAdmissionCycles } from "./hooks/use-admission-cycles";
export { usePromotionDecisions } from "./hooks/use-promotion-decisions";
export { useAdmissionCycles as useAdmissionCycleSettings } from "./hooks/use-admission-settings";
export { default as usePreEnrollmentDetail } from "./hooks/use-pre-enrollment-detail";
export {
  notifyPreEnrollmentsListChanged,
  subscribePreEnrollmentsListChanged,
} from "./lib/pre-enrollments-list-events";

// Services
export {
  getAdmissionIntakeSettings,
  updateAdmissionIntakeSettings,
} from "./services/intake-settings.service";
export {
  getFirstGradeGroups,
  type FirstGradeGroupOption,
} from "./services/first-grade-groups.service";
export {
  getAdmissionCycles,
  getPreEnrollments,
  getPreEnrollmentById,
  createPreEnrollmentByAdmin,
  updatePreEnrollment,
  updatePreEnrollmentProcess,
  startInitialReview,
  convertPreEnrollmentToStudent,
  deletePreEnrollment,
  downloadPreEnrollmentExcel,
  downloadPreEnrollmentSCV,
  resentPDFFolio,
  getPendingPromotionDecisions,
  updatePromotionDecision,
  assignFirstGradeGroups,
  runAcademicYearPromotion,
} from "./services/admissions.service";
export {
  getAdmissionStatus,
  isAdmissionFormOpen,
  admissionNavLabel,
  admissionHeroCtaLabel,
} from "./lib/get-admission-status";

// Types
export type {
  AdmissionIntakeSettings,
  AdmissionIntakeSettingsPayload,
  ConvertStudentPayload,
  ScoreMode,
  SeparationMode,
  SiblingDetection,
} from "./types/intake-settings";
export {
  AdmissionWorkshop,
  ADMISSION_WORKSHOP_OPTIONS,
} from "./types/workshops";
export type { AdmissionWorkshop as AdmissionWorkshopValue } from "./types/workshops";
export type {
  PreEnrollmentApi,
  PreEnrollmentListItem,
  AdmissionCycle,
} from "./types/pre-enrollment-api";
export type {
  FirstGradeAssignmentResult,
  ScoreSource,
} from "./types/first-grade-assignment";
export type { PendingPromotionDecisionItem } from "./types/promotion";
export type {
  AdmissionCycle as AdmissionSettingsCycle,
  CreateAdmissionCyclePayload,
  AdmissionStatus,
} from "./types/settings";
export type { AdmissionStatusResponse } from "./types/admission-cycles";

// Permissions
export {
  ADMISSION_PERMISSIONS,
  type AdmissionPermission,
} from "./permissions";
export {
  useAdmissionCapabilities,
  type AdmissionCapabilities,
} from "./hooks/capabilities/useAdmissionCapabilities";
