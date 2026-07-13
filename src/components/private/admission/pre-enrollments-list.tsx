"use client";
import React, { useMemo, useState } from "react";

import { DataTable } from "@/components/ui/DataTable";
import { studentsTableConfig } from "./students.config";
import { tableIcons } from "./icons";
import { PreEnrollmentListItem } from "@/lib/types/admission/preEnrollmentApi";
import { tableRenderers } from "./tableRerenders";
import { EnhancedTableConfig, TableAction, TableConfig } from "@/lib/types/data-table";
import {
  convertPreEnrollmentToStudent,
  downloadPreEnrollmentExcel,
} from "@/lib/services/admissions.service";
import { globalToast } from "@/lib/toast";
import { ApiError } from "@/lib/types/auth";
import { handleApiError } from "@/lib/config/api";
import { useToast } from "@/contexts/ToastContext";
import { useConfirm } from "@/components/ui/confirm";

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
  const { showSuccess, showError } = useToast();
  const { confirm } = useConfirm();

  const tableConfig = useMemo((): EnhancedTableConfig<PreEnrollmentListItem> => {
    const enrollAction: TableAction<PreEnrollmentListItem> = {
      label: "Inscribir",
      variant: "primary",
      show: (row) =>
        !row.converted_student_id &&
        row.documents_status === "complete" &&
        row.payment_status === "validated" &&
        row.status !== "rejected",
      onClick: (row) => {
        confirm({
          title: "Confirmar inscripción institucional",
          description: `¿Crear alumno y matrícula activa desde la preinscripción ${row.folio}? Se usará ciclo escolar activo y grupo provisional de 1° (prioridad grupo A si existe).`,
          confirmLabel: "Inscribir",
          cancelLabel: "Cancelar",
          variant: "default",
          onConfirm: async () => {
            try {
              await convertPreEnrollmentToStudent(row.id);
              showSuccess(
                "Inscripción creada",
                "Estudiante creado con matrícula provisional de 1°."
              );
              refetch?.();
            } catch (err) {
              const apiErr = handleApiError(err) as ApiError;
              showError("No se pudo inscribir", apiErr.message);
            }
          },
        });
      },
    };

    return {
      ...studentsTableConfig,
      actions: [...(studentsTableConfig.actions ?? []), enrollAction],
    };
  }, [confirm, refetch, showError, showSuccess]);

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

  return (
    <>
      <DataTable
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

      {selectedStudents.length > 0 && (
        <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-900">
            Has seleccionado {selectedStudents.length} estudiante
            {selectedStudents.length > 1 ? "s" : ""}
          </p>
        </div>
      )}
    </>
  );
}
