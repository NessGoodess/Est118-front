"use client";

import { useMemo } from "react";
import { DataTable } from "@/components/ui/DataTable";
import { formatTime } from "@/lib/utils/dateFormatter";
import type { DailyAttendanceStudent } from "@/features/general-attendance/types/general-attendance";
import { attendanceListTableConfig } from "./attendance-list.config";
import {
  attendanceListRenderers,
  toAttendanceTableRows,
} from "./attendance-list.renderers";

type AttendanceListTableProps = {
  students: DailyAttendanceStudent[];
  loading?: boolean;
  emptyMessage?: string;
};

export default function AttendanceListTable({
  students,
  loading = false,
  emptyMessage = "No hay datos",
}: AttendanceListTableProps) {
  const rows = useMemo(
    () =>
      toAttendanceTableRows(students, (iso) =>
        iso ? formatTime(iso) : null
      ),
    [students]
  );

  return (
    <div className="min-w-0 w-full max-w-full">
      <DataTable
        config={attendanceListTableConfig}
        data={rows}
        renderers={attendanceListRenderers}
        emptyMessage={emptyMessage}
        loading={loading}
        minRows={6}
      />
    </div>
  );
}
