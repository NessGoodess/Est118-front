import { DailyAttendanceStudent,CredentialLifecycleStatus, GeneralAttendanceStatus} from "@/lib/types/general-attendance";
import { formatTime } from "@/lib/utils/dateFormatter"; 
import LazyStudentPhoto from "./LazyStudentPhoto";

interface StudentCardProps {
    student: DailyAttendanceStudent;
}
const CREDENTIAL_LABELS: Record<CredentialLifecycleStatus, string> = {
    not_configured: "NFC no configurado",
    configured: "NFC configurado",
    nfc_ready: "NFC listo",
    printed: "Credencial impresa",
    delivered: "Credencial entregada",
    lost: "Credencial perdida",
    replacement_pending: "Reposición pendiente",
  };
  
  const STATUS_STYLES: Record<
  GeneralAttendanceStatus,
  { card: string; badge: string; label: string }
> = {
  present: {
    card: "bg-green-50",
    badge: "bg-green-100 text-green-800",
    label: "Presente",
  },
  late: {
    card: "bg-amber-50",
    badge: "bg-amber-100 text-amber-900",
    label: "Retardo",
  },
  absent: {
    card: "bg-red-50",
    badge: "bg-red-100 text-red-800",
    label: "Ausente",
  },
  excused: {
    card: "bg-sky-50",
    badge: "bg-sky-100 text-sky-800",
    label: "Justificado",
  },
  pending: {
    card: "bg-white",
    badge: "bg-gray-100 text-gray-700",
    label: "Pendiente",
  },
};

export default function StudentCard({ student }: StudentCardProps ) {
    const style = STATUS_STYLES[student.status] ?? STATUS_STYLES.pending;
    const entry = student.entry_at ? formatTime(student.entry_at) : null;
    const exit = student.exit_at ? formatTime(student.exit_at) : null;
    const credentialLabel = CREDENTIAL_LABELS[student.credential_status];
    const showCredentialAlert =
      student.credential_status === "not_configured" ||
      student.credential_status === "lost" ||
      student.credential_status === "replacement_pending";
  
    return (
      <div
        className={`border rounded-lg p-4 transition-shadow hover:shadow-md border-blue-900 ${style.card}`}
      >
        <div className="flex items-start gap-3">
          <LazyStudentPhoto student={student} />
  
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <p className="text-sm font-medium text-gray-900 truncate">
                {student.name}
              </p>
              <span
                className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${style.badge}`}
              >
                {style.label}
              </span>
            </div>
  
            {(student.group || student.grade) && (
              <p className="mt-0.5 text-sm text-gray-500">
                {[student.grade, student.group].filter(Boolean).join(" · ")}
              </p>
            )}
  
            {(entry || exit) && (
              <p className="mt-1 text-xs text-gray-600">
                {entry && `Entrada ${entry}`}
                {entry && exit && " · "}
                {exit && `Salida ${exit}`}
              </p>
            )}
  
            {showCredentialAlert && (
              <p className="mt-1 text-xs font-medium text-orange-700">
                {credentialLabel}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }