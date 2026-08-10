"use client";

import { useEffect, useMemo, useState } from "react";
import type { DailyAttendanceStudent } from "@/features/general-attendance/types/general-attendance";
import type { StatusFilter } from "./summary-filters.config";

export const ALL_OPTION = "all";

function uniqueSorted(values: Array<string | null | undefined>): string[] {
  return Array.from(
    new Set(values.map((v) => v?.trim()).filter((v): v is string => !!v))
  ).sort((a, b) => a.localeCompare(b, "es", { numeric: true }));
}

export function useAttendanceRosterFilters(students: DailyAttendanceStudent[]) {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [gradeFilter, setGradeFilter] = useState(ALL_OPTION);
  const [groupFilter, setGroupFilter] = useState(ALL_OPTION);

  const gradeOptions = useMemo(
    () => uniqueSorted(students.map((s) => s.grade)),
    [students]
  );

  const groupOptions = useMemo(() => {
    const scoped =
      gradeFilter === ALL_OPTION
        ? students
        : students.filter((s) => (s.grade ?? "") === gradeFilter);
    return uniqueSorted(scoped.map((s) => s.group));
  }, [students, gradeFilter]);

  useEffect(() => {
    if (gradeFilter !== ALL_OPTION && !gradeOptions.includes(gradeFilter)) {
      setGradeFilter(ALL_OPTION);
    }
  }, [gradeFilter, gradeOptions]);

  useEffect(() => {
    if (groupFilter !== ALL_OPTION && !groupOptions.includes(groupFilter)) {
      setGroupFilter(ALL_OPTION);
    }
  }, [groupFilter, groupOptions]);

  const selectGrade = (grade: string) => {
    setGradeFilter(grade);
    setGroupFilter(ALL_OPTION);
  };

  const { listStudents, cardStudents } = useMemo(() => {
    let list = students;

    if (statusFilter !== "all") {
      list = list.filter((student) => student.status === statusFilter);
    }
    if (gradeFilter !== ALL_OPTION) {
      list = list.filter((student) => (student.grade ?? "") === gradeFilter);
    }
    if (groupFilter !== ALL_OPTION) {
      list = list.filter((student) => (student.group ?? "") === groupFilter);
    }

    const q = query.trim().toLowerCase();
    if (!q) {
      return { listStudents: list, cardStudents: list };
    }

    const byQuery = list.filter(
      (student) =>
        student.name.toLowerCase().includes(q) ||
        (student.credential_id ?? "").toLowerCase().includes(q)
    );

    return { listStudents: byQuery, cardStudents: byQuery };
  }, [students, statusFilter, gradeFilter, groupFilter, query]);

  return {
    query,
    setQuery,
    statusFilter,
    setStatusFilter,
    gradeFilter,
    selectGrade,
    groupFilter,
    setGroupFilter,
    gradeOptions,
    groupOptions,
    listStudents,
    cardStudents,
  };
}
