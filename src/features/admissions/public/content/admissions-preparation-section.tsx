"use client";

import { motion } from "framer-motion";
import AdmissionsImportantNotes from "./admissions-important-notes";
import AdmissionsRequirementsSection from "./admissions-requirements-section";
import {
  admissionsEase,
  admissionsFadeUp,
  admissionsStaggerContainer,
} from "../lib/motion-presets";

type Props = {
  onStart: () => void;
};

export default function AdmissionsPreparationSection({ onStart }: Props) {
  return (
    <motion.section
      id="admissions-prep"
      initial="hidden"
      animate="visible"
      variants={admissionsStaggerContainer}
      className="scroll-mt-28 bg-surface-app px-4 py-10 sm:px-6 sm:py-14 lg:px-8"
    >
      <div className="mx-auto max-w-5xl space-y-8 md:rounded-2xl md:border md:border-border md:bg-surface-elevated md:p-8 md:shadow-sm lg:p-10">
        <motion.article variants={admissionsFadeUp} className="max-w-4xl">
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-primary">
            Antes de comenzar
          </p>
          <h2 className="mt-3 font-merriweather text-2xl font-bold text-foreground sm:text-3xl">
            Revise su expediente
          </h2>
          <p className="mt-3 text-base leading-relaxed text-fg-muted">
            El formulario toma unos 15–20 minutos. Tenga a la mano los datos del
            aspirante, del tutor y la documentación listada abajo.
          </p>
        </motion.article>

        <motion.div variants={admissionsFadeUp}>
          <AdmissionsRequirementsSection
            animate={false}
            title="Documentos necesarios"
            subtitle="Estos documentos se presentan en contraloría después de enviar el formulario en línea."
            className="!border-0 !bg-transparent !px-0 !py-0"
          />
        </motion.div>

        <motion.div variants={admissionsFadeUp}>
          <AdmissionsImportantNotes />
        </motion.div>

        <motion.div variants={admissionsFadeUp} className="pt-2">
          <motion.button
            type="button"
            onClick={onStart}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2, ease: admissionsEase }}
            className="w-full rounded-full bg-primary px-8 py-4 text-lg font-bold text-primary-foreground shadow-lg transition hover:bg-primary-hover hover:shadow-xl sm:w-auto"
          >
            Tengo todo listo, comenzar
          </motion.button>
        </motion.div>
      </div>
    </motion.section>
  );
}
