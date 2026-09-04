/** Anchors de la página pública de preinscripciones. */
export const ADMISSIONS_PREP_ID = "admissions-prep";
export const ADMISSIONS_FORM_ID = "admissions-form";

/** Scroll suave al nodo; espera al siguiente frame para nodos recién montados. */
export function scrollToId(id: string) {
  window.requestAnimationFrame(() => {
    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}
