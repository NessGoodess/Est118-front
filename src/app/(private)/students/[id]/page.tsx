"use client";

import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import GenericHeader from "@/components/ui/GenericHeader";
import { Button } from "@/components/ui/Button";
import { getStudentDetail } from "@/lib/services/students.service";
import Image from "next/image";
import { handleApiError } from "@/lib/api";
import { StudentDetailPayload } from "@/lib/types/student-profile";
import StudentPhotoModal from "@/components/private/students/StudentsByGrade/StudentPhotoModal";
import StudentPhotoLightbox from "@/components/private/students/StudentPhotoLightbox";
import { formatMedium, formatMediumWithTime } from "@/lib/utils/dateFormatter";

/** Columnas reales de `addresses` (migration) en orden legible */
const ADDRESS_FIELD_ORDER: Array<{ key: keyof NonNullable<StudentDetailPayload["address_detail"]>; label: string }> = [
  { key: "street_type", label: "Tipo de vialidad" },
  { key: "street_name", label: "Nombre de calle" },
  { key: "house_number", label: "Número exterior" },
  { key: "apartament_number", label: "Número interior / unidad" },
  { key: "neighborhood_type", label: "Tipo de colonia" },
  { key: "neighborhood_name", label: "Colonia" },
  { key: "postal_code", label: "Código postal" },
  { key: "city", label: "Ciudad" },
  { key: "state", label: "Estado" },
];

function formatGender(g: string | null | undefined): string {
  if (!g) return "—";
  if (g === "M") return "Masculino";
  if (g === "F") return "Femenino";
  if (g === "O") return "Otro / no binario";
  return g;
}

function isDateLikeKey(key: string): boolean {
  return (
    key.includes("_at") ||
    key === "birth_date" ||
    key === "recorded_at" ||
    key === "created_at" ||
    key === "updated_at"
  );
}

function formatFieldValue(key: string, value: unknown): string {
  if (value === null || value === undefined || value === "") return "—";
  if (typeof value === "boolean") return value ? "Sí" : "No";
  if (key === "gender" && typeof value === "string") return formatGender(value);
  if (typeof value === "string" && isDateLikeKey(key)) {
    try {
      return key.includes("_at") && value.includes("T")
        ? formatMediumWithTime(value)
        : formatMedium(value);
    } catch {
      return String(value);
    }
  }
  if (typeof value === "object" && value !== null && "toString" in value) return String(value);
  return String(value);
}

function formatPlain(v: unknown): string {
  if (v === null || v === undefined || v === "") return "—";
  if (typeof v === "boolean") return v ? "Sí" : "No";
  return String(v);
}

function formatApproval(v: unknown): string {
  if (v === null || v === undefined) return "Pendiente";
  return v === true ? "Aprobado" : "No aprobado";
}

/** Campos alineados con `profiles` + `students` (migrations) */
function studentInfoCards(info: StudentDetailPayload["student_info"]): { key: string; label: string; value: unknown }[] {
  const rec = info as Record<string, unknown>;
  const order: Array<{ key: string; label: string }> = [
    { key: "id", label: "ID alumno (students.id)" },
    { key: "credential_id", label: "Credencial / UID (students.credential_id)" },
    { key: "full_name", label: "Nombre completo" },
    { key: "national_id", label: "Identificador nacional (CURP)" },
    { key: "birth_date", label: "Fecha de nacimiento" },
    { key: "gender", label: "Sexo" },
    { key: "phone", label: "Teléfono principal" },
    { key: "phone_secondary", label: "Teléfono secundario" },
    { key: "email", label: "Correo electrónico" },
    { key: "profile_picture_filename", label: "Archivo de foto (profiles.profile_picture)" },
    { key: "profile_updated_at", label: "Última actualización del perfil" },
  ];
  return order.map(({ key, label }) => ({ key, label, value: rec[key] }));
}

function SectionCard({
  title,
  description,
  children,
  className = "",
}: {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`rounded-2xl border border-border/80 bg-surface-elevated shadow-sm overflow-hidden ${className}`}
    >
      <div className="border-b border-border bg-surface-muted/70 px-5 py-4">
        <h2 className="text-base font-semibold text-foreground tracking-tight">{title}</h2>
        {description ? <p className="text-sm text-fg-muted mt-1">{description}</p> : null}
      </div>
      <div className="p-5 sm:p-6">{children}</div>
    </section>
  );
}

function InfoTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="group rounded-xl border border-border bg-surface-muted/60 p-4 transition-colors hover:bg-surface-muted hover:border-border/80">
      <div className="text-[11px] font-semibold uppercase tracking-wider text-fg-muted">{label}</div>
      <div className="mt-1.5 text-sm font-medium text-foreground break-words leading-snug">{value}</div>
    </div>
  );
}

export default function StudentProfilePage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);
  const [detail, setDetail] = useState<StudentDetailPayload | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [photoOpen, setPhotoOpen] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const load = useCallback(async () => {
    if (!Number.isFinite(id) || id < 1) {
      setError("ID inválido");
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await getStudentDetail(id);
      setDetail(data);
    } catch (e) {
      setError(handleApiError(e).message || "No se pudo cargar el alumno");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  const subject = detail?.student_info
    ? { id: detail.student_info.id, name: detail.student_info.name ?? detail.student_info.full_name ?? "Alumno" }
    : null;

  const displayName = detail?.student_info.full_name || detail?.student_info.name || "Expediente";

  const bestPhotoUrl = useMemo(() => {
    if (!detail?.photos) return null;
    return detail.photos.original_url || detail.photos.profile_url || detail.photos.thumbnail_url || null;
  }, [detail?.photos]);

  const lightboxUrl = useMemo(() => {
    if (!detail?.photos) return null;
    return detail.photos.original_url || detail.photos.profile_url || null;
  }, [detail?.photos]);

  const addressTiles = useMemo(() => {
    const a = detail?.address_detail;
    if (!a) return [];
    return ADDRESS_FIELD_ORDER.map(({ key, label }) => ({
      key: String(key),
      label,
      value: formatPlain(a[key]),
    }));
  }, [detail?.address_detail]);

  if (!Number.isFinite(id) || id < 1) {
    return <div className="text-sm text-danger">Identificador de alumno no válido.</div>;
  }

  return (
    <>
      <button
        type="button"
        onClick={() => router.push("/students/all-students")}
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary-hover transition-colors"
      >
        <span aria-hidden>←</span> Volver a estudiantes
      </button>

      <GenericHeader
        title={loading ? "Expediente del estudiante" : displayName}
        description="Datos según el esquema actual (profiles, students, enrollments, addresses). Los huecos se muestran como —."
      />

      {loading && (
        <div className="mt-8 flex items-center gap-3 text-fg-muted">
          <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-border border-t-primary" />
          <span className="text-sm">Cargando expediente…</span>
        </div>
      )}

      {error && !loading && (
        <div className="mt-6 rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">{error}</div>
      )}

      {detail && !loading && (
        <div className="mt-8 space-y-8">
          {/* Hero: foto + identificación */}
          <div className="rounded-2xl border border-border/80 bg-surface-elevated shadow-sm overflow-hidden">
            <div className="p-6 sm:p-8 flex flex-col lg:flex-row gap-8 lg:gap-10 lg:items-stretch">
              <div className="flex flex-col items-center sm:items-start shrink-0">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-fg-muted mb-3">
                  Fotografía institucional
                </span>
                <div className="relative rounded-2xl overflow-hidden ring-2 ring-border shadow-lg bg-surface-muted">
                  {bestPhotoUrl ? (
                    <button
                      type="button"
                      onClick={() => setLightboxOpen(true)}
                      className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface-elevated rounded-2xl"
                      title="Ver foto en grande"
                    >
                      <Image
                        src={bestPhotoUrl}
                        alt={displayName}
                        width={320}
                        height={320}
                        className="w-[min(100vw-3rem,20rem)] h-[min(100vw-3rem,20rem)] sm:w-80 sm:h-80 object-cover"
                        priority
                        unoptimized
                      />
                    </button>
                  ) : (
                    <div className="w-[min(100vw-3rem,20rem)] h-[min(100vw-3rem,20rem)] sm:w-80 sm:h-80 grid place-items-center text-fg-muted text-sm text-center px-6 bg-surface-muted">
                      Sin foto registrada. Usa Capturar para agregar una.
                    </div>
                  )}
                </div>
                <div className="mt-4 flex flex-wrap gap-2 justify-center sm:justify-start">
                  {bestPhotoUrl && (
                    <Button variant="secondary" size="sm" onClick={() => setLightboxOpen(true)}>
                      Ver en grande
                    </Button>
                  )}
                  <Button variant="primary" size="sm" onClick={() => setPhotoOpen(true)}>
                    {bestPhotoUrl ? "Renovar foto" : "Capturar foto"}
                  </Button>
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-6">
                  <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">{displayName}</h1>
                  <span className="text-sm text-fg-muted font-mono">ID {detail.student_info.id}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {studentInfoCards(detail.student_info).map(({ key, label, value }) => (
                    <InfoTile key={key} label={label} value={formatFieldValue(key, value)} />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <SectionCard
            title="Matrícula vigente"
            description="Inscripción con status activo (tabla enrollments + class_groups + academic_years)."
          >
            {detail.current_enrollment ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <InfoTile label="Grado" value={formatPlain(detail.current_enrollment.grade_level)} />
                <InfoTile label="Grupo" value={formatPlain(detail.current_enrollment.class_group)} />
                <InfoTile label="Ciclo escolar" value={formatPlain(detail.current_enrollment.academic_year)} />
                <InfoTile
                  label="ID inscripción"
                  value={formatPlain(detail.current_enrollment.enrollment_id)}
                />
                <InfoTile
                  label="Alta (enrollments.created_at)"
                  value={formatFieldValue("created_at", detail.current_enrollment.recorded_at)}
                />
                <InfoTile
                  label="Última modificación (enrollments.updated_at)"
                  value={formatFieldValue("updated_at", detail.current_enrollment.updated_at)}
                />
                <InfoTile
                  label="Nuevo ingreso (is_new_admission)"
                  value={formatPlain(detail.current_enrollment.is_new_admission)}
                />
                <InfoTile
                  label="Aprobación anual (is_approved)"
                  value={formatApproval(detail.current_enrollment.is_approved)}
                />
                <InfoTile
                  label="Resultado promoción (promotion_result)"
                  value={formatPlain(detail.current_enrollment.promotion_result)}
                />
              </div>
            ) : (
              <div className="rounded-xl border border-warning/30 bg-warning/10 px-4 py-3 text-sm text-warning-foreground">
                No hay inscripción activa: el alumno no aparece enlazado a un grupo en este ciclo o falta completar la
                matrícula.
              </div>
            )}
          </SectionCard>

          <SectionCard title="Domicilio" description="Tabla addresses vinculada por profiles.address_id.">
            {addressTiles.length > 0 && addressTiles.some((t) => t.value !== "—") ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {addressTiles.map((t) => (
                  <InfoTile key={t.key} label={t.label} value={t.value} />
                ))}
              </div>
            ) : (
              <p className="text-sm text-fg-muted">Sin domicilio capturado para este perfil.</p>
            )}
          </SectionCard>

          <SectionCard
            title="Materias del grupo actual"
            description="Materias derivadas de school_classes del grupo de la inscripción activa."
          >
            {detail.subjects && detail.subjects.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {detail.subjects.map((s, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center rounded-full border border-border bg-surface-muted px-3 py-1 text-sm text-foreground"
                  >
                    {s}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-fg-muted">Sin materias asociadas al grupo vigente.</p>
            )}
          </SectionCard>

          <SectionCard
            title="Historial de inscripciones"
            description="Todas las filas de enrollments para este estudiante (orden descendente por id)."
          >
            {detail.all_enrollments && Array.isArray(detail.all_enrollments) && detail.all_enrollments.length > 0 ? (
              <div className="overflow-x-auto rounded-xl border border-border">
                <table className="min-w-full text-sm">
                  <thead className="bg-surface-muted text-left text-xs font-semibold uppercase tracking-wide text-fg-muted">
                    <tr>
                      <th className="px-3 py-3">ID</th>
                      <th className="px-3 py-3">Estado</th>
                      <th className="px-3 py-3">Grado</th>
                      <th className="px-3 py-3">Grupo</th>
                      <th className="px-3 py-3">Ciclo</th>
                      <th className="px-3 py-3">Nuevo ing.</th>
                      <th className="px-3 py-3">Aprobación</th>
                      <th className="px-3 py-3">Promoción</th>
                      <th className="px-3 py-3">Creado</th>
                      <th className="px-3 py-3">Actualizado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {(detail.all_enrollments as Array<Record<string, unknown>>).map((row, idx: number) => (
                      <tr key={idx} className="hover:bg-surface-muted/80 transition-colors">
                        <td className="px-3 py-2.5 font-mono text-xs">{formatPlain(row.id)}</td>
                        <td className="px-3 py-2.5">{formatPlain(row.status)}</td>
                        <td className="px-3 py-2.5">{formatPlain(row.grade_level)}</td>
                        <td className="px-3 py-2.5">{formatPlain(row.class_group)}</td>
                        <td className="px-3 py-2.5">{formatPlain(row.academic_year)}</td>
                        <td className="px-3 py-2.5">{formatPlain(row.is_new_admission)}</td>
                        <td className="px-3 py-2.5">{formatApproval(row.is_approved)}</td>
                        <td className="px-3 py-2.5">{formatPlain(row.promotion_result)}</td>
                        <td className="px-3 py-2.5 whitespace-nowrap text-xs text-fg-muted">
                          {formatFieldValue("created_at", row.created_at)}
                        </td>
                        <td className="px-3 py-2.5 whitespace-nowrap text-xs text-fg-muted">
                          {formatFieldValue("updated_at", row.updated_at)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-sm text-fg-muted">Sin historial de inscripciones.</p>
            )}
          </SectionCard>

          <SectionCard
            title="Tutores"
            description="Relación guardian_student (parentesco en pivot relationship cuando existe)."
          >
            {detail.guardians && detail.guardians.length > 0 ? (
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {detail.guardians.map((g, idx) => (
                  <li
                    key={idx}
                    className="rounded-xl border border-border bg-surface-muted/40 p-4 shadow-sm"
                  >
                    <div className="font-semibold text-foreground">{formatPlain(g.name)}</div>
                    <div className="mt-2 text-sm text-fg-muted space-y-1">
                      <div>
                        <span className="text-fg-muted">Parentesco: </span>
                        {formatPlain(g.relationship)}
                      </div>
                      <div>
                        <span className="text-fg-muted">Teléfono: </span>
                        {formatPlain(g.phone)}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-fg-muted">Sin tutores vinculados en guardian_student.</p>
            )}
          </SectionCard>
        </div>
      )}

      <StudentPhotoModal student={subject} isOpen={photoOpen} onClose={() => setPhotoOpen(false)} onSaved={load} />

      <StudentPhotoLightbox
        isOpen={lightboxOpen}
        imageUrl={lightboxUrl}
        alt={displayName}
        onClose={() => setLightboxOpen(false)}
      />
    </>
  );
}
