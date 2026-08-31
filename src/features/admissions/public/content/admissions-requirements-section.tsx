"use client";

import { motion } from "framer-motion";
import {
  ADMISSION_REQUIRED_DOCUMENTS,
  type AdmissionRequirement,
} from "./admission-requirements";
import {
  admissionsFadeUp,
  admissionsStaggerContainer,
} from "../lib/motion-presets";

type Props = {
  title?: string;
  subtitle?: string;
  documents?: AdmissionRequirement[];
  className?: string;
  /** Desactiva entrada animada cuando se incrusta en otra sección animada. */
  animate?: boolean;
};

export default function AdmissionsRequirementsSection({
  title = "Mientras tanto, prepara tu expediente",
  subtitle,
  documents = ADMISSION_REQUIRED_DOCUMENTS,
  className = "",
  animate = true,
}: Props) {
  const requiredCount = documents.filter((d) => d.required).length;

  const header = (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h2
          id="admissions-requirements-title"
          className="font-merriweather text-2xl font-medium text-foreground sm:text-3xl"
        >
          {title}
        </h2>
        {subtitle && (
          <p className="mt-2 max-w-prose text-sm leading-relaxed text-fg-muted sm:text-base">
            {subtitle}
          </p>
        )}
      </div>
      <span className="font-mono text-xs tracking-wide text-fg-muted">
        {requiredCount} obligatorios · {documents.length} en total
      </span>
    </div>
  );

  const grid = (
    <div className="grid grid-cols-1 border border-border sm:grid-cols-2 lg:grid-cols-3">
      {documents.map((doc) => (
        <article
          key={doc.id}
          className="border-b border-r border-border bg-surface-elevated p-5 sm:p-6"
        >
          <span className="font-mono text-[11px] tracking-[0.08em] text-primary">
            {doc.id}
          </span>
          <h3 className="mt-3 font-merriweather text-base font-medium text-foreground">
            {doc.title}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-fg-muted">
            {doc.description}
          </p>
          <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.12em] text-fg-muted">
            {doc.required ? "Obligatorio" : "Opcional"}
          </p>
        </article>
      ))}
    </div>
  );

  if (!animate) {
    return (
      <article
        aria-labelledby="admissions-requirements-title"
        className={`border-t border-border bg-surface-app px-4 py-12 sm:px-6 sm:py-16 lg:px-8 ${className}`}
      >
        <div className="mx-auto max-w-4xl">
          {header}
          {grid}
        </div>
      </article>
    );
  }

  return (
    <motion.article
      initial="hidden"
      animate="visible"
      variants={admissionsStaggerContainer}
      aria-labelledby="admissions-requirements-title"
      className={`border-t border-border bg-surface-app px-4 py-12 sm:px-6 sm:py-16 lg:px-8 ${className}`}
    >
      <div className="mx-auto max-w-4xl">
        <motion.div variants={admissionsFadeUp}>{header}</motion.div>

        <motion.div
          variants={admissionsStaggerContainer}
          className="grid grid-cols-1 border border-border sm:grid-cols-2 lg:grid-cols-3"
        >
          {documents.map((doc) => (
            <motion.article
              key={doc.id}
              variants={admissionsFadeUp}
              className="border-b border-r border-border bg-surface-elevated p-5 sm:p-6"
            >
              <span className="font-mono text-[11px] tracking-[0.08em] text-primary">
                {doc.id}
              </span>
              <h3 className="mt-3 font-merriweather text-base font-medium text-foreground">
                {doc.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-fg-muted">
                {doc.description}
              </p>
              <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.12em] text-fg-muted">
                {doc.required ? "Obligatorio" : "Opcional"}
              </p>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </motion.article>
  );
}
