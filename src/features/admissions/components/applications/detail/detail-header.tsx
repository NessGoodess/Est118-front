"use client";

import type { PreEnrollmentApi } from "@/features/admissions/types/pre-enrollment-api";
import { formatLong } from "@/lib/utils/dateFormatter";
import { Button } from "@/components/ui/Button";
import { IconByName } from "@/components/ui/icons";
import StatusBadge from "./status-badge";
import { fullName } from "./format";

interface DetailHeaderProps {
  data: PreEnrollmentApi;
  showEditButton?: boolean;
  showResentPdfButton?: boolean;
  onEdit?: () => void;
  onResentPdf?: () => void;
}

export default function DetailHeader({
  data,
  showEditButton,
  showResentPdfButton,
  onEdit,
  onResentPdf,
}: DetailHeaderProps) {
  const name = fullName(data.first_name, data.last_name, data.second_last_name);

  return (
    <header className="space-y-4 border-b border-border bg-surface-elevated rounded-lg p-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center rounded-md border border-border bg-surface-muted px-2 py-0.5 font-mono text-xs font-medium text-foreground">
              {data.folio}
            </span>
            {data.status ? <StatusBadge status={data.status} /> : null}
          </div>
          <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            {name}
          </h2>
          <p className="text-sm text-fg-muted">
            Registrado el {formatLong(data.created_at)}
          </p>
        </div>

        {(showEditButton && onEdit) || (showResentPdfButton && onResentPdf) ? (
          <div className="flex shrink-0 flex-wrap gap-2">
            {showResentPdfButton && onResentPdf ? (
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={onResentPdf}
                leftIcon={<IconByName name="reload" className="h-4 w-4" />}
              >
                Reenviar PDF
              </Button>
            ) : null}
            {showEditButton && onEdit ? (
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={onEdit}
                leftIcon={<IconByName name="edit" className="h-4 w-4" />}
              >
                Editar
              </Button>
            ) : null}
          </div>
        ) : null}
      </div>

      <dl className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="min-w-0">
          <dt className="text-[11px] font-medium uppercase tracking-wide text-fg-muted">
            CURP
          </dt>
          <dd className="mt-0.5 font-mono text-sm font-medium text-foreground break-all">
            {data.curp}
          </dd>
        </div>
        <div className="min-w-0">
          <dt className="text-[11px] font-medium uppercase tracking-wide text-fg-muted">
            Teléfono
          </dt>
          <dd className="mt-0.5 text-sm font-medium text-foreground">
            {data.phone}
          </dd>
        </div>
        <div className="min-w-0">
          <dt className="text-[11px] font-medium uppercase tracking-wide text-fg-muted">
            Email
          </dt>
          <dd
            className="mt-0.5 truncate text-sm font-medium text-foreground"
            title={data.student_email}
          >
            {data.student_email}
          </dd>
        </div>
      </dl>
    </header>
  );
}
