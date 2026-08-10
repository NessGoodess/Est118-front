export { default as AcademicYearsPanel } from "./components/AcademicYearsPanel";
export { useAcademicYears } from "./hooks/useAcademicYears";
export { useAcademicYearsPanel } from "./hooks/useAcademicYearsPanel";
export { useAcademicYearCapabilities } from "./hooks/useAcademicYearCapabilities";
export type { AcademicYearCapabilities } from "./hooks/useAcademicYearCapabilities";
export {
  getAcademicYearsList,
  createAcademicYear,
  activateAcademicYear,
  generateAcademicYearGroups,
  deleteAcademicYear,
} from "./services/academic-years.service";
export type {
  AcademicYearListItem,
  CreateAcademicYearPayload,
  PromoteAcademicYearSummary,
} from "./types/academic-year";
export type { AcademicYearCreateFormState } from "./hooks/useAcademicYearsPanel";
export {
  ACADEMIC_YEAR_PERMISSIONS,
  type AcademicYearPermission,
} from "./permissions";
