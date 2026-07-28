"use client";

import { useState } from "react";
import Image from "next/image";
import { getPrivateImageUrl } from "@/lib/api";
import {
  CredentialLifecycleStatus,
  DailyAttendanceStudent,
  GeneralAttendanceStatus,
} from "@/lib/types/general-attendance";

export type AttendanceTableRow = DailyAttendanceStudent & {
  groupLabel: string;
  entryTime: string;
  exitTime: string;
};

const STATUS_LABELS: Record<GeneralAttendanceStatus, string> = {
  present: "Presente",
  late: "Retardo",
  absent: "Ausente",
  excused: "Justificado",
  pending: "Pendiente",
};

const STATUS_BADGE: Record<GeneralAttendanceStatus, string> = {
  present: "bg-success/15 text-success border-success/30",
  late: "bg-warning/15 text-warning-foreground border-warning/30",
  absent: "bg-danger/15 text-danger border-danger/30",
  excused: "bg-info/15 text-info border-info/30",
  pending: "bg-surface-muted text-foreground border-border",
};

const CREDENTIAL_LABELS: Record<CredentialLifecycleStatus, string> = {
  not_configured: "NFC no configurado",
  configured: "NFC configurado",
  nfc_ready: "NFC listo",
  printed: "Credencial impresa",
  delivered: "Credencial entregada",
  lost: "Credencial perdida",
  replacement_pending: "Reposición pendiente",
};

function StudentPhotoCell({ student }: { student: AttendanceTableRow }) {
  const [error, setError] = useState(false);
  const url = student.photo_url ? getPrivateImageUrl(student.photo_url) : "";
  const initial = student.name?.trim().charAt(0).toUpperCase() || "?";

  return (
    <div className="flex items-center gap-3 min-w-0">
      {!url || error ? (
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface-muted text-sm font-medium text-fg-muted">
          {initial}
        </div>
      ) : (
        <Image
          src={url}
          alt={student.name}
          width={40}
          height={40}
          className="h-10 w-10 shrink-0 rounded-full object-cover"
          unoptimized
          loading="lazy"
          onError={() => setError(true)}
        />
      )}
      <span className="truncate font-medium text-foreground">{student.name}</span>
    </div>
  );
}

export const attendanceListRenderers = {
  "attendance-student": (_value: unknown, row?: AttendanceTableRow) =>
    row ? <StudentPhotoCell student={row} /> : <span className="text-fg-muted">—</span>,

  "attendance-status": (value: unknown) => {
    const status = (value as GeneralAttendanceStatus) ?? "pending";
    const cls = STATUS_BADGE[status] ?? STATUS_BADGE.pending;
    const label = STATUS_LABELS[status] ?? status;
    return (
      <span
        className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${cls}`}
      >
        {label}
      </span>
    );
  },

  "attendance-credential": (value: unknown) => {
    const status = (value as CredentialLifecycleStatus) ?? "not_configured";
    const label = CREDENTIAL_LABELS[status] ?? status;
    const alert =
      status === "not_configured" ||
      status === "lost" ||
      status === "replacement_pending";
    return (
      <span className={`text-sm ${alert ? "font-medium text-warning-foreground" : "text-fg-muted"}`}>
        {label}
      </span>
    );
  },
};

export function toAttendanceTableRows(
  students: DailyAttendanceStudent[],
  formatTime: (iso: string | null) => string | null
): AttendanceTableRow[] {
  return students.map((student) => ({
    ...student,
    groupLabel: [student.grade, student.group].filter(Boolean).join(" · ") || "—",
    entryTime: formatTime(student.entry_at) ?? "—",
    exitTime: formatTime(student.exit_at) ?? "—",
  }));
}
