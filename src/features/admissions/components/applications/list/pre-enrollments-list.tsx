"use client";
import React, { useMemo, useState } from "react";

import { Button } from "@/components/ui/Button";
import { DataTable } from "@/components/ui/DataTable";
import { IconByName } from "@/components/ui/icons";
import { studentsTableConfig } from "./students.config";
import { tableIcons } from "./icons";
import { PreEnrollmentListItem } from "@/features/admissions/types/pre-enrollment-api";
import { tableRenderers } from "./table-renderers";
import { EnhancedTableConfig, TableAction, TableConfig } from "@/lib/types/data-table";
import { downloadPreEnrollmentExcel } from "@/features/admissions/services/admissions.service";
import { globalToast } from "@/lib/toast";
import { handleApiError } from "@/lib/api";
import ConvertToStudentModal from "@/features/admissions/components/convert/convert-to-student-modal";
import BulkConvertToStudentsModal from "@/features/admissions/components/convert/bulk-convert-to-students-modal";
import { useAdmissionCapabilities } from "@/features/admissions/hooks/capabilities/useAdmissionCapabilities";
import { useAdmissionIntakeSettings } from "@/features/admissions/hooks/use-admission-intake-settings";

interface Props {
  data: PreEnrollmentListItem[];
  loading?: boolean;
  refetch?: () => void;
}

export default function PreEnrollmentsList({
  data,
  loading = false,
  refetch,
}: Props) {
  const [selectedStudents, setSelectedStudents] = useState<
    PreEnrollmentListItem[]
  >([]);
  const [convertTarget, setConvertTarget] =
    useState<PreEnrollmentListItem | null>(null);
  const [bulkOpen, setBulkOpen] = useState(false);
  const [tableRevision, setTableRevision] = useState(0);
  const { canEdit, canViewEnrollment, canEditEnrollment } =
    useAdmissionCapabilities();
  const { data: intakeSettings } = useAdmissionIntakeSettings({
    enabled: canEditEnrollment,
  });

  const tableConfig = useMemo((): EnhancedTableConfig<PreEnrollmentListItem> => {
    const enrollAction: TableAction<PreEnrollmentListItem> = {
      label: "Inscribir",
      variant: "primary",
      show: (row) => {
        if (!canEditEnrollment) return false;
        if (row.converted_student_id || row.status !== "in_review") return false;
        const ready =
          row.documents_status === "complete" &&
          row.payment_status === "validated";
        const exceptions =
          !!intakeSettings?.allow_convert_without_complete_docs ||
          !!intakeSettings?.allow_convert_without_payment ||
          !!intakeSettings?.allow_convert_without_complete_data ||
          !!intakeSettings?.late_intake_enabled;
        return ready || exceptions;
      },
      onClick: (row) => setConvertTarget(row),
    };

    const processKeys = new Set([
      "status",
      "documents_status",
      "payment_status",
      "converted_student_id",
    ]);

    return {
      ...studentsTableConfig,
      columns: canViewEnrollment
        ? studentsTableConfig.columns
        : studentsTableConfig.columns.filter(
            (column) => !processKeys.has(String(column.key))
          ),
      actions: [
        ...(studentsTableConfig.actions ?? []).filter((action) => {
          if (action.icon === "edit") return canEdit;
          if (action.icon === "trash") return false;
          return true;
        }),
        ...(canEditEnrollment ? [enrollAction] : []),
      ],
      selectable: canEditEnrollment,
      features: {
        ...studentsTableConfig.features,
        selectionEnabled: canEditEnrollment,
      },
    };
  }, [intakeSettings, canEdit, canViewEnrollment, canEditEnrollment]);

  const exportFunction = async () => {
    try {
      const blob = await downloadPreEnrollmentExcel();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "pre-enrollments.xlsx";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      const resolved = handleApiError(err);
      globalToast.error(
        resolved && typeof resolved === "object" && "message" in resolved
          ? String((resolved as { message?: string }).message)
          : "Error al exportar datos"
      );
    }
  };

  const closeBulk = () => {
    setBulkOpen(false);
    setSelectedStudents([]);
    setTableRevision((current) => current + 1);
  };

  return (
    <>
      <DataTable
        key={tableRevision}
        config={tableConfig as TableConfig<PreEnrollmentListItem>}
        data={data}
        renderers={tableRenderers}
        icons={tableIcons}
        onSelectionChange={setSelectedStudents}
        emptyMessage="No se encontraron estudiantes"
        loading={loading}
        minRows={10}
        exportable={true}
        exportFunction={exportFunction}
      />

      {canEditEnrollment && selectedStudents.length > 0 && (
        <div className="mt-4 flex flex-col gap-3 rounded-lg border border-border bg-primary-soft p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-primary">
            Has seleccionado {selectedStudents.length} aspirante
            {selectedStudents.length > 1 ? "s" : ""}
          </p>
          <Button
            type="button"
            size="sm"
            onClick={() => setBulkOpen(true)}
            leftIcon={<IconByName name="users" className="h-4 w-4" />}
          >
            Inscribir seleccionados
          </Button>
        </div>
      )}

      <ConvertToStudentModal
        open={!!convertTarget}
        target={
          convertTarget
            ? {
                id: convertTarget.id,
                folio: convertTarget.folio,
                status: convertTarget.status,
                documents_status: convertTarget.documents_status,
                payment_status: convertTarget.payment_status,
                curp: convertTarget.curp,
              }
            : null
        }
        onClose={() => setConvertTarget(null)}
        onConverted={() => refetch?.()}
      />

      <BulkConvertToStudentsModal
        open={bulkOpen}
        selected={selectedStudents}
        onClose={closeBulk}
        onFinished={() => refetch?.()}
      />
    </>
  );
}
