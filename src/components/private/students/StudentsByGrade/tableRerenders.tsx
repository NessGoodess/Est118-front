'use client';

import { useState } from "react";
import { formatShortWithTime } from "@/lib/utils/dateFormatter";
import Image from "next/image";
import { getPrivateImageUrl } from "@/lib/api";
import { Student } from "@/lib/types/students";

function StudentPhotoPlaceholder({ name }: { name: string }) {
  const initial = name?.trim() ? name.trim().charAt(0).toUpperCase() : "?";
  return (
    <div
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface-muted text-fg-muted text-sm font-medium"
      title={name}
    >
      {initial}
    </div>
  );
}

function StudentPhotoCell({ student }: { student: Student }) {
  const [error, setError] = useState(false);
  const url = student.photo_url ? getPrivateImageUrl(student.photo_url) : "";

  if (!url || error) {
    return <StudentPhotoPlaceholder name={student.name} />;
  }

  return (
    <Image
      src={url}
      alt={student.name}
      width={40}
      height={40}
      className="rounded-full object-cover"
      onError={() => setError(true)}
    />
  );
}

export const tableRenderers = {
  'student-photo': (value: unknown, row: unknown) =>
    row ? <StudentPhotoCell student={row as Student} /> : <span className="text-fg-muted">—</span>,
  'status-badge': (value: unknown) => (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${(value as string) === 'active'
      ? 'bg-success/10 text-success border-success/30'
      : 'bg-surface-muted text-fg-muted border-border'
      }`}>
      {(value as string) === 'active' ? 'Activo' : 'Inactivo'}
    </span>
  ),
  'email-link': (value: unknown) => (
    <a href={`mailto:${value}`} className="text-primary hover:underline text-sm">
      {value as string}
    </a>
  ),
  'date': (value: unknown) => (
    <span className="text-sm">
      {formatShortWithTime(value as Date)}
    </span>
  ),
};