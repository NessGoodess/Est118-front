"use client";

import {
  ADMISSION_CONTRALORIA_HOURS,
  ADMISSION_FACEBOOK_URL,
} from "./admission-requirements";
import { IconByName } from "@/components/ui/icons";

export default function AdmissionsImportantNotes() {
  return (
    <article className="rounded-lg border-l-4 border-warning bg-warning/10 p-5 sm:p-6">
      <h3 className="mb-3 flex items-center gap-2 font-semibold text-foreground">
        <IconByName name="info" className="h-5 w-5 shrink-0 text-warning" />
        Notas importantes
      </h3>
      <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground sm:text-base">
        <li>
          Si preinscribe a más de un aspirante, use un correo electrónico
          diferente por cada solicitud.
        </li>
        <li>
          La información oficial se publica en el Facebook de la escuela:{" "}
          <a
            href={ADMISSION_FACEBOOK_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-primary underline hover:text-primary-hover"
          >
            EscSecTecnica118
          </a>
          .
        </li>
        <li>
          Para concluir el trámite debe acudir a contraloría en horario de{" "}
          <strong>{ADMISSION_CONTRALORIA_HOURS}</strong>, con su folio y la
          documentación requerida.
        </li>
      </ul>
    </article>
  );
}
