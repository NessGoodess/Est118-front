"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { IconByName } from "@/components/ui/icons";
import { useAdmissionPublicStatus } from "@/features/admissions/context/admission-public-status-context";

const ease = [0.16, 1, 0.3, 1] as const;

const FACTS = [
  { value: "1984", label: "Año de fundación" },
  { value: "100%", label: "Educación pública" },
  { value: "09DST0118V", label: "Clave del centro" },
];

export default function HeroWelcome() {
  const { heroCtaLabel, formOpen } = useAdmissionPublicStatus();

  return (
    <section
      id="inicio"
      className="public-home-hero relative flex flex-col overflow-hidden bg-brand-950"
    >
      <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-brand-900 via-brand-950 to-brand-950" />
      <div className="pointer-events-none absolute -left-40 top-0 h-105 w-105 rounded-full bg-brand-500/20 blur-3xl" />

      <div className="relative z-10 mx-auto flex min-h-0 w-full max-w-7xl flex-1 items-center px-4 pb-10 sm:px-6 lg:px-8">
        <div className="grid w-full grid-cols-1 items-center gap-8 lg:grid-cols-[1.05fr_1fr] lg:gap-12">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease }}
            className="text-white"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-white/85">
              IEEPO · Oaxaca de Juárez
            </span>

            <h1 className="mt-4 font-merriweather text-[clamp(1.75rem,4.5vw,3.25rem)] font-bold leading-[1.1] sm:mt-5">
              Escuela Secundaria
              <span className="mt-1 block text-accent-gold">
                Técnica No. 118
              </span>
            </h1>

            <p className="mt-4 max-w-lg text-base leading-relaxed text-white/80 sm:mt-5 sm:text-lg">
              Formación técnica y académica para las nuevas generaciones de la
              ciudad de Oaxaca, desde 1984.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:mt-7 sm:flex-row sm:items-center">
              <Link href="/inscripciones">
                <motion.span
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center justify-center gap-2 rounded-full bg-accent-gold px-7 py-3.5 text-base font-bold text-brand-950 shadow-lg transition-colors hover:brightness-95 sm:px-8 sm:py-4"
                >
                  {heroCtaLabel}
                  {formOpen ? (
                    <IconByName name="arrowRight" className="h-5 w-5" />
                  ) : null}
                </motion.span>
              </Link>

              <motion.a
                href="#notices"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center justify-center gap-2 rounded-full border border-white/40 px-7 py-3.5 text-base font-semibold text-white transition-colors hover:bg-white hover:text-brand-950 sm:px-8 sm:py-4"
              >
                <IconByName name="megaphone" className="h-5 w-5" />
                Avisos y noticias
              </motion.a>
            </div>

            <dl className="mt-6 grid max-w-lg grid-cols-3 gap-4 border-t border-white/15 pt-5 sm:mt-8 sm:gap-6 sm:pt-6">
              {FACTS.map((fact) => (
                <div key={fact.label}>
                  <dt className="sr-only">{fact.label}</dt>
                  <dd className="font-merriweather text-lg font-bold text-accent-gold sm:text-xl">
                    {fact.value}
                  </dd>
                  <p className="mt-1 text-[11px] leading-snug text-white/60 sm:text-xs">
                    {fact.label}
                  </p>
                </div>
              ))}
            </dl>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.15, ease }}
            className="relative hidden min-h-0 lg:block"
          >
            <div className="relative mx-auto aspect-4/5 w-full max-h-[min(58vh,calc(100dvh-var(--public-header-offset)-3rem))] overflow-hidden rounded-3xl border border-white/15 shadow-2xl">
              <Image
                src="/background1.png"
                alt="Instalaciones de la Escuela Secundaria Técnica No. 118"
                fill
                priority
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-brand-950/70 via-transparent to-transparent" />
            </div>

            <div className="absolute -bottom-4 left-6 flex items-center gap-3 rounded-2xl border border-white/15 bg-brand-950/90 px-5 py-3 shadow-xl backdrop-blur-sm">
              <IconByName name="mapPin" className="h-5 w-5 text-accent-gold" />
              <div className="text-white">
                <p className="text-sm font-semibold leading-tight">
                  Oaxaca de Juárez
                </p>
                <p className="text-xs text-white/60">Centro de la ciudad</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <motion.a
        href="#notices"
        aria-label="Desplazarse a avisos"
        className="absolute bottom-4 left-1/2 z-10 -translate-x-1/2 text-white/70 transition-colors hover:text-white sm:bottom-6"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
      >
        <IconByName name="chevronDown" className="h-6 w-6 sm:h-7 sm:w-7" />
      </motion.a>
    </section>
  );
}
