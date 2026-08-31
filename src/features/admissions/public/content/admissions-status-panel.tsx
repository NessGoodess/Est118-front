"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { ReactNode } from "react";
import AdmissionsCountdown from "./admissions-countdown";
import type { AdmissionStatusResponse } from "../../types/admission-cycles";
import {
  formatMedium,
  formatTime24,
  formatLongWithoutTime,
} from "@/lib/utils/dateFormatter";
import {
  admissionsFadeUp,
  admissionsStaggerContainer,
} from "../lib/motion-presets";

type Props = {
  status: AdmissionStatusResponse;
  /** When true, show compact “open” banner above the wizard. */
  showActiveBanner?: boolean;
};

type StampConfig = {
  top: string;
  mid: string;
  bottom: string;
  ringClass: string;
};

type PanelCopy = {
  headline: ReactNode;
  body: string;
  stamp: StampConfig;
  ledgerStatus: string;
  ledgerStatusDot: string;
  dateLabel?: string;
  dateValue?: ReactNode;
  footnote?: string;
  showCountdown?: boolean;
  countdownTarget?: string;
};

function scheduleDateTime(iso: string | null): string | null {
  if (!iso) return null;
  return `${formatMedium(iso)} — ${formatTime24(iso)} hrs`;
}

function copyForStatus(status: AdmissionStatusResponse): PanelCopy {
  const cycle = status.cycle_name?.trim() || "Preinscripciones";

  switch (status.status) {
    case "not_started":
      return {
        headline: (
          <>
            Las preinscripciones{" "}
            <span className="text-primary font-semibold">aún no han abierto</span>.
          </>
        ),
        body: "Estamos preparando el registro para el próximo ciclo. El formulario se activará en la fecha indicada; no es necesario refrescar la página.",
        stamp: {
          top: "Próximamente",
          mid: "disponible",
          bottom: "Técnica 118",
          ringClass: "border-primary text-primary",
        },
        ledgerStatus: "Cerrado por ahora",
        ledgerStatusDot: "bg-warning",
        dateLabel: "Apertura programada",
        dateValue: scheduleDateTime(status.start_at),
        footnote:
          "Al llegar la hora, el formulario aparecerá en esta misma página. Puede guardar este enlace y volver en la fecha indicada.",
        showCountdown: Boolean(status.start_at),
        countdownTarget: status.start_at ?? undefined,
      };

    case "ended":
      return {
        headline: (
          <>
            El periodo de preinscripciones{" "}
            <span className="text-warning font-semibold">ya finalizó</span>.
          </>
        ),
        body: "Este ciclo ya no acepta nuevas solicitudes en línea. Las preinscripciones suelen abrir de nuevo entre febrero y marzo del siguiente año.",
        stamp: {
          top: "Periodo",
          mid: "cerrado",
          bottom: "Técnica 118",
          ringClass: "border-warning text-warning",
        },
        ledgerStatus: "Convocatoria cerrada",
        ledgerStatusDot: "bg-warning",
        dateLabel: "Cierre del periodo",
        dateValue: status.end_at
          ? formatLongWithoutTime(status.end_at)
          : "Fecha no disponible",
        footnote:
          "Si necesita orientación, comuníquese con la escuela en horario de contraloría.",
      };

    case "service_error":
      return {
        headline: (
          <>
            No pudimos{" "}
            <span className="text-danger font-semibold">verificar el estado</span>{" "}
            del periodo.
          </>
        ),
        body: "Por seguridad, el formulario no se muestra hasta confirmar si las preinscripciones están abiertas.",
        stamp: {
          top: "Estado",
          mid: "pendiente",
          bottom: "Técnica 118",
          ringClass: "border-danger text-danger",
        },
        ledgerStatus: "Servicio no disponible",
        ledgerStatusDot: "bg-danger",
        footnote: status.message ?? undefined,
      };

    case "active":
      return {
        headline: (
          <>
            Las preinscripciones{" "}
            <span className="text-success font-semibold">están abiertas</span>.
          </>
        ),
        body: "Complete el formulario en línea. Después deberá acudir a contraloría con su folio y la documentación requerida.",
        stamp: {
          top: "Registro",
          mid: "abierto",
          bottom: "Técnica 118",
          ringClass: "border-success text-success",
        },
        ledgerStatus: "Convocatoria abierta",
        ledgerStatusDot: "bg-success",
        dateLabel: "Cierra el",
        dateValue: scheduleDateTime(status.end_at),
        footnote: `Ciclo: ${cycle}. Tiempo estimado del formulario: 15–20 minutos.`,
      };

    default:
      return {
        headline: (
          <>
            Por ahora{" "}
            <span className="text-foreground font-semibold">no hay un periodo</span>{" "}
            de preinscripción habilitado.
          </>
        ),
        body: "Cuando la escuela publique la convocatoria del ciclo, esta página mostrará las fechas y el formulario automáticamente.",
        stamp: {
          top: "Por",
          mid: "anunciar",
          bottom: "Técnica 118",
          ringClass: "border-border text-fg-muted",
        },
        ledgerStatus: "Sin convocatoria activa",
        ledgerStatusDot: "bg-fg-muted",
        footnote:
          "Las preinscripciones suelen abrirse una vez al año, normalmente de febrero a marzo.",
      };
  }
}

function StatusStamp({ stamp }: { stamp: StampConfig }) {
  return (
    <div
      className={`flex h-[7.5rem] w-[7.5rem] shrink-0 -rotate-6 items-center justify-center rounded-full border-2 outline outline-1 outline-offset-[6px] ${stamp.ringClass} outline-current/30`}
    >
      <div className="rotate-6 text-center">
        <span className="block font-mono text-[9px] uppercase tracking-[0.16em] opacity-80">
          {stamp.top}
        </span>
        <span className="font-merriweather my-1 block text-xl font-medium italic">
          {stamp.mid}
        </span>
        <span className="block font-mono text-[8px] uppercase tracking-[0.12em] opacity-70">
          {stamp.bottom}
        </span>
      </div>
    </div>
  );
}

export default function AdmissionsStatusPanel({
  status,
  showActiveBanner = false,
}: Props) {
  const copy = copyForStatus(status);
  const folio = status.cycle_id
    ? `Ciclo ${status.cycle_id}`
    : "Preinscripciones";

  if (showActiveBanner && status.status === "active") {
    return (
      <section
        aria-labelledby="admissions-status-title"
        className="border-b border-border bg-surface-app"
      >
        <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={admissionsStaggerContainer}
            className="flex flex-wrap items-center justify-between gap-4"
          >
            <motion.div variants={admissionsFadeUp}>
              <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-success">
                Convocatoria abierta
              </p>
              <h2
                id="admissions-status-title"
                className="mt-1 font-merriweather text-lg font-semibold text-foreground"
              >
                Ya puede iniciar su solicitud en línea
              </h2>
              {copy.dateValue && (
                <p className="mt-1 text-sm text-fg-muted">
                  {copy.dateLabel}:{" "}
                  <span className="font-medium text-foreground">
                    {copy.dateValue}
                  </span>
                </p>
              )}
            </motion.div>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section
      aria-labelledby="admissions-status-title"
      className="bg-surface-app px-4 py-10 sm:px-6 sm:py-14 lg:px-8"
    >
      <div className="mx-auto max-w-4xl space-y-10">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={admissionsStaggerContainer}
          className="max-w-2xl"
        >
          <motion.p
            variants={admissionsFadeUp}
            className="mb-4 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.16em] text-primary"
          >
            <span className="inline-block h-px w-5 bg-primary" aria-hidden />
            Estado del periodo
          </motion.p>

          <motion.h2
            variants={admissionsFadeUp}
            id="admissions-status-title"
            className="font-merriweather text-[clamp(1.5rem,3.5vw,2.25rem)] font-medium leading-snug text-foreground"
          >
            {copy.headline}
          </motion.h2>

          <motion.p
            variants={admissionsFadeUp}
            className="mt-4 max-w-prose text-base leading-relaxed text-fg-muted"
          >
            {copy.body}
          </motion.p>

          <motion.div
            variants={admissionsFadeUp}
            className="mt-8 flex flex-wrap items-center gap-8"
          >
            <StatusStamp stamp={copy.stamp} />
            {copy.dateLabel && copy.dateValue && (
              <div>
                <span className="mb-2 block font-mono text-[11px] uppercase tracking-[0.12em] text-fg-muted">
                  {copy.dateLabel}
                </span>
                <span className="text-lg font-medium text-foreground sm:text-xl">
                  {copy.dateValue}
                </span>
              </div>
            )}
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="border border-border bg-surface-elevated p-6 sm:p-8"
        >
          <div className="mb-6 flex flex-wrap items-baseline justify-between gap-3 border-b border-border pb-4">
            <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-fg-muted">
              {folio}
            </span>
            <span className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.1em] text-fg-muted">
              <span
                className={`inline-block h-1.5 w-1.5 rounded-full ${copy.ledgerStatusDot}`}
                aria-hidden
              />
              {copy.ledgerStatus}
            </span>
          </div>

          {copy.showCountdown && copy.countdownTarget && (
            <AdmissionsCountdown targetIso={copy.countdownTarget} />
          )}

          {status.status === "service_error" && (
            <div className="space-y-4">
              {copy.footnote && (
                <p className="text-sm leading-relaxed text-fg-muted">
                  {copy.footnote}
                </p>
              )}
              <Link
                href="/inscripciones"
                className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
              >
                Reintentar
              </Link>
            </div>
          )}

          {status.status !== "service_error" && copy.footnote && (
            <p
              className={`text-sm leading-relaxed text-fg-muted ${
                copy.showCountdown ? "mt-6 border-t border-border pt-5" : ""
              }`}
            >
              {copy.footnote}
            </p>
          )}
        </motion.div>
      </div>
    </section>
  );
}
