export { default as GeneralAttendancePage } from "./components/GeneralAttendancePage";
export { default as CycleHint } from "./components/CycleHint";
export { default as StudentAttendanceCard } from "./components/live/StudentAttendanceCard";
export { default as StudentAttendanceList } from "./components/history/StudentAttendanceList";
export { default as ReaderConfigPanel } from "./components/readers/ReaderConfigPanel";

export {
  GeneralAttendanceProvider,
  useGeneralAttendanceContext,
} from "./contexts/GeneralAttendanceContext";
export {
  MultiReaderEchoProvider,
  useMultiReaderEcho,
} from "./contexts/MultiReaderEchoContext";

export {
  useGeneralAttendance,
  useReaderFullscreen,
  useGeneralAttendanceCapabilities,
  useAttendanceRulesForm,
  useReaderConfigPanel,
} from "./hooks";
export type { GeneralAttendanceCapabilities } from "./hooks";
export { useAttendanceStore } from "./stores/attendance-store";
export type { AttendanceRecord } from "./stores/attendance-store";

export {
  GENERAL_ATTENDANCE_PERMISSIONS,
  type GeneralAttendancePermission,
} from "./permissions";

export type {
  AcademicYearInfo,
  DailyAttendanceRules,
  DailyAttendanceStudent,
  DailyAttendanceSummary,
  DailyAttendanceStatusRow,
  DailyAttendanceResponse,
  DailyAttendanceStatusesResponse,
  GeneralAttendanceStatus,
  CredentialLifecycleStatus,
} from "./types/general-attendance";

export type {
  NfcReaderSlot,
  NfcReaderConfigData,
  NfcPairingSession,
  NfcReaderStatusItem,
} from "./types/nfc-reader";

export {
  getCurrentStudent,
  getRecentReadings,
  getDailyAttendance,
  getDailyAttendanceStatuses,
  getAttendanceSettings,
  updateAttendanceSettings,
} from "./services/attendance.service";
export type { AttendanceSettingsPayload } from "./services/attendance.service";

export {
  getNfcReaderSlots,
  getNfcReaderConfig,
  updateNfcReaderSlot,
  armNfcReaderSlot,
  armAllNfcReaderSlots,
} from "./services/nfc-reader.service";
