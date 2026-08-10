import { useCallback, useEffect, useRef, useState } from "react";
import {
  getDailyAttendance,
  getDailyAttendanceStatuses,
} from "@/features/general-attendance/services/attendance.service";
import {
  AcademicYearInfo,
  DailyAttendanceRules,
  DailyAttendanceStudent,
  DailyAttendanceSummary,
  DailyAttendanceStatusRow,
  GeneralAttendanceStatus,
} from "@/features/general-attendance/types/general-attendance";
import { globalToast } from "@/lib/toast";
import { useAttendanceStore } from "@/features/general-attendance/stores/attendance-store";

function todayLocalDate(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

const emptySummary: DailyAttendanceSummary = {
  total: 0,
  present: 0,
  late: 0,
  absent: 0,
  excused: 0,
  pending: 0,
};

type RosterCacheEntry = {
  academicYearId: number;
  students: DailyAttendanceStudent[];
  fetchedAt: number;
};

const ROSTER_TTL_MS = 45 * 60 * 1000;

function summarize(students: DailyAttendanceStudent[]): DailyAttendanceSummary {
  return {
    total: students.length,
    present: students.filter((s) => s.status === "present").length,
    late: students.filter((s) => s.status === "late").length,
    absent: students.filter((s) => s.status === "absent").length,
    excused: students.filter((s) => s.status === "excused").length,
    pending: students.filter((s) => s.status === "pending").length,
  };
}

function mergeStatuses(
  roster: DailyAttendanceStudent[],
  statuses: DailyAttendanceStatusRow[]
): DailyAttendanceStudent[] {
  const byId = new Map(statuses.map((row) => [row.student_id, row]));
  return roster.map((student) => {
    const row = byId.get(student.student_id);
    if (!row) return student;
    return {
      ...student,
      status: row.status,
      persisted_status: row.persisted_status,
      entry_at: row.entry_at,
      exit_at: row.exit_at,
      scanned_at: row.scanned_at,
      source: row.source,
    };
  });
}

function statusFromNfcType(
  type: string | undefined,
  message: string | undefined
): GeneralAttendanceStatus | null {
  if (type === "entry") {
    return message?.toLowerCase().includes("tard") ? "late" : "present";
  }
  return null;
}

interface UseGeneralAttendanceResult {
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  students: DailyAttendanceStudent[];
  summary: DailyAttendanceSummary;
  rules: DailyAttendanceRules | null;
  academicYear: AcademicYearInfo | null;
  activeAcademicYear: AcademicYearInfo | null;
  loading: boolean;
  statusesLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useGeneralAttendance(): UseGeneralAttendanceResult {
  const [selectedDate, setSelectedDate] = useState<string>(todayLocalDate);
  const [students, setStudents] = useState<DailyAttendanceStudent[]>([]);
  const [summary, setSummary] = useState<DailyAttendanceSummary>(emptySummary);
  const [rules, setRules] = useState<DailyAttendanceRules | null>(null);
  const [academicYear, setAcademicYear] = useState<AcademicYearInfo | null>(null);
  const [activeAcademicYear, setActiveAcademicYear] =
    useState<AcademicYearInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [statusesLoading, setStatusesLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const rosterCacheRef = useRef<RosterCacheEntry | null>(null);
  const selectedDateRef = useRef(selectedDate);
  selectedDateRef.current = selectedDate;

  const applyPayloadMeta = useCallback(
    (meta: {
      rules?: DailyAttendanceRules;
      academic_year?: AcademicYearInfo | null;
      active_academic_year?: AcademicYearInfo | null;
    }) => {
      if (meta.rules) setRules(meta.rules);
      if (meta.academic_year !== undefined) setAcademicYear(meta.academic_year);
      if (meta.active_academic_year !== undefined) {
        setActiveAcademicYear(meta.active_academic_year ?? null);
      }
    },
    []
  );

  const loadFullRoster = useCallback(
    async (date: string) => {
      setLoading(true);
      setError(null);
      try {
        const data = await getDailyAttendance(date);
        const list = data.students ?? [];
        setStudents(list);
        setSummary(data.summary ?? summarize(list));
        applyPayloadMeta(data);

        if (data.academic_year?.id) {
          rosterCacheRef.current = {
            academicYearId: data.academic_year.id,
            students: list,
            fetchedAt: Date.now(),
          };
        }
      } catch (err: unknown) {
        let errorMessage = "Error al obtener la asistencia del día";
        if (err && typeof err === "object") {
          if (
            "response" in err &&
            err.response &&
            typeof err.response === "object" &&
            "data" in err.response &&
            err.response.data &&
            typeof err.response.data === "object" &&
            "message" in err.response.data
          ) {
            errorMessage = String(err.response.data.message);
          } else if ("message" in err) {
            errorMessage = String(err.message);
          }
        }
        setError(errorMessage);
        globalToast.error("Error de asistencia", errorMessage);
        setStudents([]);
        setSummary(emptySummary);
      } finally {
        setLoading(false);
      }
    },
    [applyPayloadMeta]
  );

  const loadStatusesOnly = useCallback(
    async (date: string, roster: DailyAttendanceStudent[], cachedYearId: number) => {
      setStatusesLoading(true);
      setError(null);
      try {
        const data = await getDailyAttendanceStatuses(date);
        if (data.academic_year?.id && data.academic_year.id !== cachedYearId) {
          rosterCacheRef.current = null;
          await loadFullRoster(date);
          return;
        }
        const merged = mergeStatuses(roster, data.statuses ?? []);
        setStudents(merged);
        setSummary(data.summary ?? summarize(merged));
        applyPayloadMeta(data);
      } catch {
        await loadFullRoster(date);
      } finally {
        setStatusesLoading(false);
      }
    },
    [applyPayloadMeta, loadFullRoster]
  );

  const fetchDaily = useCallback(async () => {
    const date = selectedDate;
    const cache = rosterCacheRef.current;
    const cacheValid =
      !!cache &&
      Date.now() - cache.fetchedAt < ROSTER_TTL_MS &&
      cache.students.length > 0;

    if (cacheValid && cache) {
      await loadStatusesOnly(date, cache.students, cache.academicYearId);
      return;
    }

    await loadFullRoster(date);
  }, [selectedDate, loadFullRoster, loadStatusesOnly]);

  useEffect(() => {
    fetchDaily();
  }, [fetchDaily]);

  // Patch today's roster from live NFC feed (shared store; avoids a second Echo subscription)
  useEffect(() => {
    return useAttendanceStore.subscribe((state, prev) => {
      if (selectedDateRef.current !== todayLocalDate()) return;
      const latest = state.records[0];
      const previous = prev.records[0];
      if (!latest || latest === previous) return;

      const studentId = latest.id;
      const type = latest.type ?? latest.event;
      const nextStatus = statusFromNfcType(type, latest.message);
      const nowIso =
        latest.scannedAt instanceof Date
          ? latest.scannedAt.toISOString()
          : new Date().toISOString();

      setStudents((current) => {
        let changed = false;
        const updated = current.map((row) => {
          if (row.student_id !== studentId) return row;
          changed = true;

          if (type === "entry" && nextStatus) {
            return {
              ...row,
              status: nextStatus,
              entry_at: row.entry_at ?? nowIso,
              scanned_at: nowIso,
              source: "nfc",
              persisted_status: nextStatus,
            };
          }

          if (type === "exit") {
            return {
              ...row,
              exit_at: row.exit_at ?? nowIso,
              scanned_at: nowIso,
            };
          }

          return row;
        });

        if (!changed) return current;
        setSummary(summarize(updated));
        return updated;
      });
    });
  }, []);

  return {
    selectedDate,
    setSelectedDate,
    students,
    summary,
    rules,
    academicYear,
    activeAcademicYear,
    loading,
    statusesLoading,
    error,
    refetch: fetchDaily,
  };
}
