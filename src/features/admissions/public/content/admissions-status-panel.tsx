"use client";

import { useRouter } from "next/navigation";
import { useTransition, type ReactNode } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import AdmissionsCountdown from "./admissions-countdown";
import type { AdmissionStatusResponse } from "../../types/admission-cycles";
import {
  formatMedium,
  formatTime,
  formatLongWithoutTime,
} from "@/lib/utils/dateFormatter";
import {
  admissionsFadeUp,
  admissionsStaggerContainer,
} from "../lib/motion-presets";

type Props = {
  status: AdmissionStatusResponse;
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
  dateLabel?: string;
  dateValue?: ReactNode;
  note?: string;
  showCountdown?: boolean;
  countdownTarget?: string;
  showRefresh?: boolean;
};

function scheduleDateTime(iso: string | null): string | null {
  if (!iso) return null;
  return `${formatMedium(iso)} — ${formatTime(iso)}`;
}

function copyForStatus(status: AdmissionStatusResponse): PanelCopy {
  const cycle = status.cycle_name?.trim() || "Preinscripciones";

  switch (status.status) {
    case "not_started":
      return {
        headline: (
          <>
            Las preinscripciones{" "}
            <span className="text-primary font-semibold">están programadas</span>.
          </>
        ),
        body: "El formulario se habilitará en la fecha y hora indicadas.",
        stamp: {
          top: "Próximamente",
          mid: "disponible",
          bottom: "Est 118",
          ringClass: "border-primary text-primary",
        },
        dateLabel: "Apertura programada",
        dateValue: scheduleDateTime(status.start_at),
        note: "Cuando llegue la hora, pulse «Actualizar estado» o recargue la página. Puede guardar este enlace y volver en la fecha indicada.",
        showCountdown: Boolean(status.start_at),
        countdownTarget: status.start_at ?? undefined,
        showRefresh: true,
      };

    case "ended":
      return {
        headline: (
          <>
            El periodo de preinscripciones{" "}
            <span className="text-warning font-semibold">ya finalizó</span>.
          </>
        ),
        body: "Este ciclo ya no acepta nuevas solicitudes en línea, si necesita orientación, comuníquese con la escuela en horario de contraloría. Las preinscripciones en linea suelen abrir de nuevo entre febrero y marzo del siguiente año.",
        stamp: {
          top: "Periodo",
          mid: "cerrado",
          bottom: "Est 118",
          ringClass: "border-warning text-warning",
        },
        dateLabel: "Cierre del periodo",
        dateValue: status.end_at
          ? formatLongWithoutTime(status.end_at)
          : "Fecha no disponible",
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
          bottom: "Est 118",
          ringClass: "border-danger text-danger",
        },
        note: status.message ?? undefined,
        showRefresh: true,
      };

    case "active":
      return {
        headline: (
          <>
            Las preinscripciones{" "}
            <span className="text-success font-semibold">están abiertas</span>.
          </>
        ),
        body: "El formulario está disponible hasta la fecha y hora indicadas.",
        stamp: {
          top: "Registro",
          mid: "abierto",
          bottom: "Est 118",
          ringClass: "border-success text-success",
        },
        dateLabel: "Cierra el",
        dateValue: scheduleDateTime(status.end_at),
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
        body: "Cuando la escuela publique la convocatoria del ciclo, esta página mostrará las fechas y el formulario.",
        stamp: {
          top: "Por",
          mid: "anunciar",
          bottom: "Est 118",
          ringClass: "border-border text-fg-muted",
        },
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

export default function AdmissionsStatusPanel({ status }: Props) {
  const router = useRouter();
  const [isRefreshing, startRefresh] = useTransition();
  const copy = copyForStatus(status);
  const showActionCard =
    Boolean(copy.showCountdown && copy.countdownTarget) ||
    Boolean(copy.showRefresh);

  const refreshStatus = () => {
    startRefresh(() => {
      router.refresh();
    });
  };

  return (
    <section
      aria-labelledby="admissions-status-title"
      className="bg-surface-app px-4 pb-5 pt-10 sm:px-6 sm:pt-14 lg:px-8"
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
            className="mt-8 hidden lg:flex flex-wrap items-center gap-8"
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

          {!showActionCard && copy.note ? (
            <motion.p
              variants={admissionsFadeUp}
              className="mt-6 max-w-prose text-sm leading-relaxed text-fg-muted"
            >
              {copy.note}
            </motion.p>
          ) : null}
        </motion.div>

        {showActionCard ? (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="border border-border bg-surface-elevated p-6 sm:p-8"
          >
            {copy.showCountdown && copy.countdownTarget ? (
              <AdmissionsCountdown targetIso={copy.countdownTarget} />
            ) : null}

            {copy.showRefresh ? (
              <div
                className={`flex flex-wrap items-center gap-3 justify-end ${
                  copy.showCountdown ? "mt-6" : ""
                }`}
              >
                <Button
                  type="button"
                  variant={status.status === "service_error" ? "primary" : "ghost"}
                  size="md"
                  loading={isRefreshing}
                  loadingText={
                    status.status === "service_error"
                      ? "Reintentando…"
                      : "Actualizando…"
                  }
                  onClick={refreshStatus}
                >
                  {status.status === "service_error"
                    ? "Reintentar"
                    : "Actualizar estado"}
                </Button>
              </div>
            ) : null}

            {copy.note ? (
              <p
                className={`text-sm leading-relaxed text-fg-muted ${
                  copy.showCountdown || copy.showRefresh
                    ? "mt-6 border-t border-border pt-5"
                    : ""
                }`}
              >
                {copy.note}
              </p>
            ) : null}
          </motion.div>
        ) : null}
      </div>
    </section>
  );
}
