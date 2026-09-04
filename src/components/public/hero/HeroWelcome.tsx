"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { IconByName } from "@/components/ui/icons";
import { useAdmissionPublicStatus } from "@/features/admissions/context/admission-public-status-context";

const ease = [0.16, 1, 0.3, 1] as const;

const FACTS = [
  "Fundada en 1984",
  "Educación pública",
  "Oaxaca de Juárez",
];

export default function HeroWelcome() {
  const { heroCtaLabel, formOpen } = useAdmissionPublicStatus();

  return (
    <section
      id="inicio"
      className="public-home-hero relative flex flex-col overflow-hidden"
    >
      <Image
        src="/background1.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />

      <div className="absolute inset-0 bg-linear-to-r from-brand-950/95 via-brand-900/80 to-brand-900/40" />
      <div className="absolute inset-0 bg-linear-to-t from-brand-950/90 via-transparent to-brand-950/40" />

      <div className="relative z-10 mx-auto flex min-h-0 w-full max-w-7xl flex-1 items-center px-4 pb-10 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease }}
          className="max-w-3xl text-public-on-media"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-public-glass-border bg-public-glass px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-public-on-media/90 backdrop-blur-sm">
            IEEPO · Oaxaca
          </span>

          <h1 className="mt-4 font-merriweather text-[clamp(1.75rem,5vw,3.75rem)] font-bold leading-[1.1] drop-shadow-lg sm:mt-6">
            Escuela Secundaria
            <span className="mt-1 block text-public-cta">Técnica No. 118</span>
          </h1>

          <p className="mt-4 max-w-xl text-base leading-relaxed text-public-on-media/85 drop-shadow sm:mt-6 sm:text-lg lg:text-xl">
            Formación técnica y académica para las nuevas generaciones de la
            ciudad de Oaxaca.
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:items-center">
            <Link href="/inscripciones" className="sm:w-auto">
              <motion.span
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center justify-center gap-2 rounded-full bg-public-cta px-7 py-3.5 text-base font-bold text-public-cta-fg shadow-lg transition-colors hover:brightness-95 sm:px-8 sm:py-4"
              >
                {heroCtaLabel}
                {formOpen ? <IconByName name="arrowRight" className="h-5 w-5" /> : null}
              </motion.span>
            </Link>

            <motion.a
              href="#notices"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center justify-center gap-2 rounded-full border-2 border-public-glass-strong/70 px-7 py-3.5 text-base font-semibold text-public-on-media transition-colors hover:bg-public-glass-strong hover:text-brand-900 sm:px-8 sm:py-4"
            >
              <IconByName name="megaphone" className="h-5 w-5" />
              Avisos y noticias
            </motion.a>
          </div>

          <ul className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-public-on-media-muted sm:mt-8">
            {FACTS.map((fact) => (
              <li key={fact} className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-public-cta" />
                {fact}
              </li>
            ))}
          </ul>
        </motion.div>
      </div>

      <motion.a
        href="#notices"
        aria-label="Desplazarse a avisos"
        className="absolute bottom-4 left-1/2 z-10 -translate-x-1/2 text-public-on-media/80 transition-colors hover:text-public-on-media sm:bottom-6"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
      >
        <IconByName name="chevronDown" className="h-6 w-6 sm:h-7 sm:w-7" />
      </motion.a>
    </section>
  );
}
