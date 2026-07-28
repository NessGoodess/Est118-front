"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PreEnrollmentApi } from "@/lib/types/admission/preEnrollmentApi";
import {
  convertPreEnrollmentToStudent,
  getPreEnrollmentById,
  updatePreEnrollmentProcess,
} from "@/lib/services/admissions.service";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/contexts/ToastContext";
import { useConfirm } from "@/components/ui/confirm";
import { handleApiError } from "@/lib/api";

const STATUS_OPTIONS = [
  { value: "pending", label: "Preinscrito (web)" },
  { value: "in_review", label: "En revisión / presencial" },
  { value: "approved", label: "Aprobado" },
  { value: "rejected", label: "Rechazado / cancelado" },
] as const;

const DOCS_OPTIONS = [
  { value: "pending", label: "Documentos pendientes" },
  { value: "complete", label: "Documentos completos" },
] as const;

const PAY_OPTIONS = [
  { value: "pending", label: "Pago pendiente" },
  { value: "validated", label: "Pago validado" },
] as const;

interface Props {
  data: PreEnrollmentApi;
  onSaved: (next: PreEnrollmentApi) => void;
}

export default function PreEnrollmentProcessPanel({
  data,
  onSaved,
}: Props) {
  const { showSuccess, showError } = useToast();
  const { confirm } = useConfirm();

  const [status, setStatus] = useState(data.status ?? "pending");
  const [documentsStatus, setDocumentsStatus] = useState(
    data.documents_status ?? "pending"
  );
  const [paymentStatus, setPaymentStatus] = useState(
    data.payment_status ?? "pending"
  );
  const [admissionExamScore, setAdmissionExamScore] = useState<string>(
    data.admission_exam_score ?? ""
  );
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setStatus(data.status ?? "pending");
    setDocumentsStatus(data.documents_status ?? "pending");
    setPaymentStatus(data.payment_status ?? "pending");
    setAdmissionExamScore(data.admission_exam_score ?? "");
  }, [data.id, data.status, data.documents_status, data.payment_status, data.admission_exam_score]);

  const isConverted =
    typeof data.converted_student_id === "number" &&
    data.converted_student_id > 0;

  const canEnroll =
    !isConverted &&
    documentsStatus === "complete" &&
    paymentStatus === "validated" &&
    status !== "rejected";

  const handleSave = async () => {
    setSaving(true);
    try {
      const updated = await updatePreEnrollmentProcess(data.id, {
        status,
        documents_status: documentsStatus,
        payment_status: paymentStatus,
        admission_exam_score:
          admissionExamScore.trim() === "" ? null : Number(admissionExamScore),
      });
      onSaved(updated);
      showSuccess("Guardado", "Estado del proceso actualizado.");
    } catch (err) {
      const apiErr = handleApiError(err);
      showError("Error", apiErr.message || "No se pudo guardar.");
    } finally {
      setSaving(false);
    }
  };

  const handleEnroll = () => {
    confirm({
      title: "Inscribir en la institución",
      description:
        "Se creará el alumno, el tutor enlazado y la matrícula activa en 1° con grupo provisional (prioridad grupo A si existe).",
      confirmLabel: "Inscribir",
      variant: "default",
      onConfirm: async () => {
        try {
          await convertPreEnrollmentToStudent(data.id);
          showSuccess("Listo", "Estudiante creado con matrícula provisional.");
          const updated = await getPreEnrollmentById(data.id);
          onSaved(updated);
        } catch (err) {
          const apiErr = handleApiError(err);
          showError("No se pudo inscribir", apiErr.message || "Intenta de nuevo.");
        }
      },
    });
  };

  return (
    <div className="bg-surface-elevated rounded-xl border border-border shadow-sm p-6 space-y-5">
      <div>
        <h3 className="text-lg font-semibold text-foreground">
          Proceso de admisión
        </h3>
        <p className="text-sm text-fg-muted mt-1">
          Actualiza estado presencial: documentación, validación del pago y
          decisión antes de crear el alumno en el sistema escolar.
        </p>
      </div>

      {isConverted && (
        <div className="rounded-lg border border-success/30 bg-success/10 px-4 py-3 text-sm text-success">
          <span className="font-medium">
            Este aspirante ya fue inscrito como estudiante
          </span>
          {" · "}
          <span className="font-mono">ID {data.converted_student_id}</span>
          {" · "}
          <Link
            href="/students/list-students"
            className="text-success underline underline-offset-2 hover:text-success"
          >
            Ver estudiantes
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="text-xs font-medium text-fg-muted block mb-1">
            Etapa
          </label>
          <select
            className="w-full rounded-lg border border-border px-3 py-2 text-sm bg-surface-elevated disabled:opacity-60"
            value={status}
            disabled={saving || isConverted}
            onChange={(e) => setStatus(e.target.value)}
          >
            {STATUS_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs font-medium text-fg-muted block mb-1">
            Documentación
          </label>
          <select
            className="w-full rounded-lg border border-border px-3 py-2 text-sm bg-surface-elevated disabled:opacity-60"
            value={documentsStatus}
            disabled={saving || isConverted}
            onChange={(e) => setDocumentsStatus(e.target.value)}
          >
            {DOCS_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs font-medium text-fg-muted block mb-1">
            Pago
          </label>
          <select
            className="w-full rounded-lg border border-border px-3 py-2 text-sm bg-surface-elevated disabled:opacity-60"
            value={paymentStatus}
            disabled={saving || isConverted}
            onChange={(e) => setPaymentStatus(e.target.value)}
          >
            {PAY_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs font-medium text-fg-muted block mb-1">
            Examen admisión (0-10)
          </label>
          <input
            type="number"
            min={0}
            max={10}
            step="0.01"
            className="w-full rounded-lg border border-border px-3 py-2 text-sm bg-surface-elevated disabled:opacity-60"
            value={admissionExamScore}
            disabled={saving || isConverted}
            onChange={(e) => setAdmissionExamScore(e.target.value)}
            placeholder="Opcional"
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
        <Button
          onClick={() => handleSave()}
          loading={saving}
          disabled={isConverted}
        >
          Guardar estados
        </Button>

        {!isConverted && (
          <Button variant="secondary" onClick={handleEnroll} disabled={!canEnroll}>
            Inscribir como alumno oficial
          </Button>
        )}

        {!isConverted && !canEnroll && (
          <span className="text-xs text-fg-muted">
            Para inscribir: documentos completos, pago validado y estado distinto de
            rechazado (luego usar el botón o la lista).
          </span>
        )}
      </div>
    </div>
  );
}
