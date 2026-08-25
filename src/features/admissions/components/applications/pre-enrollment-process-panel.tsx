"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { PreEnrollmentApi } from "@/features/admissions/types/pre-enrollment-api";
import {
  getPreEnrollmentById,
  startInitialReview,
  updatePreEnrollmentProcess,
} from "@/features/admissions/services/admissions.service";
import { Button } from "@/components/ui/Button";
import { IconByName } from "@/components/ui/icons";
import { useToast } from "@/contexts/ToastContext";
import { handleApiError } from "@/lib/api";
import ConvertToStudentModal from "@/features/admissions/components/convert/convert-to-student-modal";
import { useAdmissionCapabilities } from "@/features/admissions/hooks/capabilities/useAdmissionCapabilities";
import { useAdmissionIntakeSettings } from "@/features/admissions/hooks/use-admission-intake-settings";

const STATUS_OPTIONS = [
  { value: "pending", label: "Solicitud recibida" },
  { value: "in_review", label: "En revisión" },
  { value: "approved", label: "Inscrito" },
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

/** Allowed next statuses by current status (approved only via convert). */
const ALLOWED_STATUS: Record<string, string[]> = {
  pending: ["pending", "rejected"],
  in_review: ["in_review", "rejected"],
  rejected: ["rejected", "in_review"],
  approved: ["approved"],
};

function hasConvertedStudent(data: PreEnrollmentApi): boolean {
  const id = data.converted_student_id;
  return id != null && Number(id) > 0;
}

interface Props {
  data: PreEnrollmentApi;
  onSaved: (next: PreEnrollmentApi) => void;
}

export default function PreEnrollmentProcessPanel({
  data,
  onSaved,
}: Props) {
  const { showSuccess, showError } = useToast();
  const { canEditEnrollment } = useAdmissionCapabilities();
  const { data: intakeSettings } = useAdmissionIntakeSettings({
    enabled: canEditEnrollment,
  });

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
  const [reviewNotes, setReviewNotes] = useState(data.review_notes ?? "");
  const [saving, setSaving] = useState(false);
  const [convertOpen, setConvertOpen] = useState(false);

  useEffect(() => {
    setStatus(data.status ?? "pending");
    setDocumentsStatus(data.documents_status ?? "pending");
    setPaymentStatus(data.payment_status ?? "pending");
    setAdmissionExamScore(data.admission_exam_score ?? "");
    setReviewNotes(data.review_notes ?? "");
  }, [
    data.id,
    data.status,
    data.documents_status,
    data.payment_status,
    data.admission_exam_score,
    data.review_notes,
  ]);

  const isConverted = hasConvertedStudent(data);
  const isApproved = data.status === "approved" || status === "approved";
  /** Finalizada: ya convertida o marcada inscrita (legacy sin student_id). */
  const isFinalized = isConverted || isApproved;

  const readyPath =
    documentsStatus === "complete" &&
    paymentStatus === "validated" &&
    status === "in_review";

  const exceptionPath =
    status === "in_review" &&
    ((documentsStatus !== "complete" &&
      !!intakeSettings?.allow_convert_without_complete_docs) ||
      (paymentStatus !== "validated" &&
        !!intakeSettings?.allow_convert_without_payment) ||
      !!intakeSettings?.allow_convert_without_complete_data ||
      !!intakeSettings?.late_intake_enabled);

  const canOpenEnroll =
    canEditEnrollment && !isFinalized && (readyPath || exceptionPath);
  const fieldsLocked = saving || isFinalized || !canEditEnrollment;

  const statusChoices = useMemo(() => {
    const allowed = ALLOWED_STATUS[data.status ?? "pending"] ?? ["pending"];
    return STATUS_OPTIONS.filter(
      (o) => allowed.includes(o.value) || o.value === data.status
    );
  }, [data.status]);

  const handleAccept = async () => {
    setSaving(true);
    try {
      const updated = await startInitialReview(data.id, {
        expected_updated_at: data.updated_at ?? null,
        notes: reviewNotes.trim() || null,
        documents_status: documentsStatus,
        payment_status: paymentStatus,
        admission_exam_score:
          admissionExamScore.trim() === "" ? null : admissionExamScore.trim(),
      });
      setStatus(updated.status);
      onSaved(updated);
      showSuccess(
        "Solicitud aceptada",
        "El aspirante pasó a «En revisión»."
      );
    } catch (err) {
      const apiErr = handleApiError(err);
      showError(
        apiErr.status === 409 ? "Versión obsoleta" : "Error",
        apiErr.message || "No se pudo iniciar la revisión."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const updated = await updatePreEnrollmentProcess(data.id, {
        status,
        documents_status: documentsStatus,
        payment_status: paymentStatus,
        admission_exam_score:
          admissionExamScore.trim() === "" ? null : admissionExamScore.trim(),
        review_notes: reviewNotes.trim(),
        expected_updated_at: data.updated_at ?? null,
      });
      setStatus(updated.status);
      onSaved(updated);
      showSuccess("Guardado", "Estado del proceso actualizado.");
    } catch (err) {
      const apiErr = handleApiError(err);
      showError(
        apiErr.status === 409 ? "Versión obsoleta" : "Error",
        apiErr.message || "No se pudo guardar."
      );
    } finally {
      setSaving(false);
    }
  };

  const enrollHint = (() => {
    if (isFinalized) return null;
    if (data.status === "pending") {
      return "Primero acepta la solicitud para comenzar el proceso.";
    }
    if (data.status === "rejected") {
      return "Reabre la solicitud (pasa a «En revisión») antes de inscribir.";
    }
    if (documentsStatus !== "complete" || paymentStatus !== "validated") {
      return "Para inscribir: marca documentos completos y pago validado, o habilita excepciones en Política de ingreso.";
    }
    return "Para inscribir: documentos y pago listos, o habilita excepciones / ingreso tardío en Política de ingreso.";
  })();

  return (
    <div className="space-y-5 rounded-xl border border-border bg-surface-elevated p-6 shadow-sm">
      <div>
        <h3 className="text-lg font-semibold text-foreground">
          Proceso de admisión
        </h3>
        <p className="mt-1 text-sm text-fg-muted">
          {canEditEnrollment
            ? "1) Acepta la solicitud → 2) Marca documentos/pago → 3) Inscribe como alumno. Las notas se guardan al aceptar o al guardar estados."
            : "Consulta etapa, documentos y pago. No tienes permiso para modificar el proceso ni inscribir."}
        </p>
      </div>

      {isConverted ? (
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
      ) : isApproved ? (
        <div className="rounded-lg border border-warning/30 bg-warning/10 px-4 py-3 text-sm text-warning-foreground">
          Etapa «Inscrito» sin alumno vinculado. El proceso está bloqueado; revisa
          si la conversión quedó incompleta.
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <div>
          <label className="mb-1 block text-xs font-medium text-fg-muted">
            Etapa
          </label>
          <select
            className="w-full rounded-lg border border-border bg-surface-elevated px-3 py-2 text-sm disabled:opacity-60"
            value={status}
            disabled={fieldsLocked || data.status === "pending"}
            onChange={(e) => setStatus(e.target.value)}
          >
            {statusChoices.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          {data.status === "pending" ? (
            <p className="mt-1 text-xs text-fg-muted">
              Usa «Aceptar solicitud» para pasar a revisión.
            </p>
          ) : null}
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-fg-muted">
            Documentación
          </label>
          <select
            className="w-full rounded-lg border border-border bg-surface-elevated px-3 py-2 text-sm disabled:opacity-60"
            value={documentsStatus}
            disabled={fieldsLocked}
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
          <label className="mb-1 block text-xs font-medium text-fg-muted">
            Pago
          </label>
          <select
            className="w-full rounded-lg border border-border bg-surface-elevated px-3 py-2 text-sm disabled:opacity-60"
            value={paymentStatus}
            disabled={fieldsLocked}
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
          <label className="mb-1 block text-xs font-medium text-fg-muted">
            Examen admisión (0-10)
          </label>
          <input
            type="number"
            min={0}
            max={10}
            step="0.01"
            className="w-full rounded-lg border border-border bg-surface-elevated px-3 py-2 text-sm disabled:opacity-60"
            value={admissionExamScore}
            disabled={fieldsLocked}
            onChange={(e) => setAdmissionExamScore(e.target.value)}
            placeholder="Opcional"
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-fg-muted">
          Notas de revisión
        </label>
        <textarea
          className="w-full rounded-lg border border-border bg-surface-elevated px-3 py-2 text-sm disabled:opacity-60"
          rows={2}
          value={reviewNotes}
          disabled={fieldsLocked}
          onChange={(e) => setReviewNotes(e.target.value)}
          placeholder="Opcional: se guardan al aceptar o al pulsar Guardar estados"
        />
        {data.reviewed_at ? (
          <p className="mt-1 text-xs text-fg-muted">
            Revisión iniciada el {new Date(data.reviewed_at).toLocaleString("es-MX")}
            {data.reviewed_by ? ` · usuario #${data.reviewed_by}` : ""}
          </p>
        ) : null}
      </div>

      {canEditEnrollment ? (
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:flex-wrap">
        {data.status === "pending" && !isFinalized ? (
          <Button
            onClick={handleAccept}
            loading={saving}
            leftIcon={<IconByName name="check" className="h-4 w-4" />}
          >
            Aceptar solicitud
          </Button>
        ) : null}

        {!isFinalized && data.status !== "pending" ? (
          <Button
            onClick={handleSave}
            loading={saving}
            variant="primary"
          >
            Guardar estados
          </Button>
        ) : null}

        {!isFinalized ? (
          <Button
            variant="secondary"
            onClick={() => setConvertOpen(true)}
            disabled={!canOpenEnroll}
          >
            Inscribir como alumno oficial
          </Button>
        ) : null}

        {enrollHint ? (
          <span className="text-xs text-fg-muted">{enrollHint}</span>
        ) : null}
      </div>
      ) : null}

      {canEditEnrollment && !isFinalized ? (
        <ConvertToStudentModal
          open={convertOpen}
          target={{
            id: data.id,
            folio: data.folio,
            status,
            documents_status: documentsStatus,
            payment_status: paymentStatus,
            previous_school: data.previous_school,
            first_name: data.first_name,
            last_name: data.last_name,
            curp: data.curp,
          }}
          onClose={() => setConvertOpen(false)}
          onConverted={async () => {
            const updated = await getPreEnrollmentById(data.id);
            onSaved(updated);
          }}
        />
      ) : null}
    </div>
  );
}
