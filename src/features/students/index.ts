// Components
export {
  StudentPhotoModal,
  PhotoStatus,
  PhotoPreview,
  CameraSection,
  PhotoActions,
  SmartPhoto,
} from "./components/photo";
export { default as StudentsDashboardSection } from "./components/dashboard/StudentsDashboardSection";
export { default as GradeLevelsCard } from "./components/gradeLevelsCard";
export { default as StudentsByGradeSection } from "./components/List/StudentsByGradeSection";
export { default as StudentPhotoLightbox } from "./components/StudentPhotoLightbox";
export {
  StudentDetailView,
  ProfileSection,
  ProfileInfoTile,
} from "./components/detail";

// Hooks
export {
  useGrades,
  useStudentsByGrade,
  useStudentCamera,
  useStudentPhotoStatus,
  useStudentPhotoUpload,
  useStudentCapabilities,
  useUpdateStudent,
} from "./hooks";
export type { StudentCapabilities } from "./hooks";
export { STUDENT_PERMISSIONS } from "./permissions";
export type { StudentPermission } from "./permissions";

// Types
export type {
  Grade,
  Student,
  StudentsByGradeResponse,
  Totals,
  GradesResponse,
} from "./types/students";
export type {
  StudentDetailPayload,
  StudentDetailResponse,
  StudentEnrollmentDetail,
  AddressDetail,
  StudentPhotos,
  GuardianRow,
  StudentProfileStudentInfo,
} from "./types/student-profile";
export type {
  UpdateStudentPayload,
  StudentProfileUpdatePayload,
  StudentAddressUpdatePayload,
  StudentProfileFormValues,
  StudentAddressFormValues,
} from "./schemas/student-update.schema";
export {
  studentProfileSchema,
  studentAddressSchema,
} from "./schemas/student-update.schema";
export type {
  PhotoModalStudentRef,
  StudentPhotoModalProps,
  FacingMode,
  PhotoLoadState,
  StudentPhotoStatus,
} from "./types/photo";

// Services
export {
  getGrades,
  getStudentsByGrade,
  getStudentPhotoStatus,
  uploadStudentPhoto,
  getStudentDetail,
  updateStudent,
} from "./services/students.service";
export type { StudentPhotoStatusResponse } from "./services/students.service";
