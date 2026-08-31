"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { AdmissionStatusResponse } from "../../types/admission-cycles";
import {
  admissionsFadeUp,
  admissionsStaggerContainer,
} from "../lib/motion-presets";

type Props = {
  status?: Pick<AdmissionStatusResponse, "cycle_name"> | null;
};

const SCHOOL_SLOGAN =
  "Institución pública comprometida con la excelencia académica y la formación técnica integral de nuestros estudiantes, desde 1984 al servicio de Oaxaca.";

export default function AdmissionsSchoolHero({ status }: Props) {
  const cycleLabel = status?.cycle_name?.trim() || "Preinscripciones";

  return (
    <section
      aria-labelledby="admissions-school-hero-title"
      className="public-hero-offset relative overflow-hidden border-b border-white/10 bg-linear-to-br from-brand-900 via-brand-700 to-brand-500 text-white"
    >
      <div
        className="absolute inset-0 bg-[url('/background4.png')] bg-cover bg-center opacity-20"
        aria-hidden
      />
      <div
        className="absolute inset-0 bg-linear-to-t from-brand-900/80 via-brand-900/40 to-transparent"
        aria-hidden
      />

      <div className="relative z-10 mx-auto max-w-5xl px-4 pb-12 sm:px-6 md:pb-16 lg:px-8">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={admissionsStaggerContainer}
        >
          <motion.div
            variants={admissionsFadeUp}
            className="mb-8 flex flex-wrap items-center gap-4 md:gap-6"
          >
            <div className="flex items-center gap-3 rounded-xl bg-white/10 px-3 py-2 backdrop-blur-sm">
              <Image
                src="/Logo_IEEPO.png"
                alt="IEEPO"
                width={48}
                height={48}
                className="h-10 w-auto object-contain md:h-12"
              />
              <div className="h-8 w-px bg-white/25" aria-hidden />
              <Image
                src="/Logo_EST118.png"
                alt="Escuela Secundaria Técnica 118"
                width={48}
                height={48}
                className="h-10 w-auto object-contain md:h-12"
              />
            </div>
            <div className="hidden h-px flex-1 bg-white/15 sm:block" aria-hidden />
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/70 sm:text-xs">
              CCT 09DST0118V · IEEPO
            </p>
          </motion.div>

          <motion.p
            variants={admissionsFadeUp}
            className="mb-5 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.18em] text-accent-gold"
          >
            <span className="inline-block h-px w-6 bg-accent-gold" aria-hidden />
            Portal de {cycleLabel}
          </motion.p>

          <motion.div variants={admissionsFadeUp} className="max-w-3xl">
            <h1
              id="admissions-school-hero-title"
              className="font-merriweather text-[clamp(1.75rem,4.5vw,2.75rem)] font-bold leading-tight tracking-tight text-white"
            >
              Escuela Secundaria{" "}
              <span className="text-accent-gold">Técnica No. 118</span>
            </h1>

            <p className="mt-5 max-w-[42rem] text-base leading-relaxed text-white/90 md:text-[17px] md:leading-[1.7]">
              {SCHOOL_SLOGAN}
            </p>

            <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.12em] text-white/60">
              Registro en línea para aspirantes a primer grado · Oaxaca de Juárez
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
