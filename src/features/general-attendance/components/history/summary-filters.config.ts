import {
  DailyAttendanceSummary,
  GeneralAttendanceStatus,
} from "@/features/general-attendance/types/general-attendance";

export type StatusFilter = GeneralAttendanceStatus | "all";

export type SummaryTone = "neutral" | "success" | "warning" | "danger" | "info";

export type SummaryFilterCard = {
  status: StatusFilter;
  label: string;
  metric: keyof DailyAttendanceSummary;
  tone: SummaryTone;
};

export const SUMMARY_FILTER_CARDS: SummaryFilterCard[] = [
  { status: "all", label: "Todos", metric: "total", tone: "neutral" },
  { status: "present", label: "Presentes", metric: "present", tone: "success" },
  { status: "late", label: "Retardos", metric: "late", tone: "warning" },
  { status: "absent", label: "Ausencias", metric: "absent", tone: "danger" },
  { status: "excused", label: "Justificados", metric: "excused", tone: "info" },
  { status: "pending", label: "Pendientes", metric: "pending", tone: "neutral" },
];
