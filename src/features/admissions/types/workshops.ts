/**
 * Catálogo de talleres para preinscripciones.
 * Valores = lo que se guarda en workshop_first_choice / workshop_second_choice.
 */
export const AdmissionWorkshop = {
  ApparelAndTextile: "Confección del vestido e industria textil",
  MachinesAndControl: "Máquinas, herramientas y sistemas de control",
  IndustrialDesign: "Diseño Industrial",
  Informatics: "Informática",
} as const;

export type AdmissionWorkshop =
  (typeof AdmissionWorkshop)[keyof typeof AdmissionWorkshop];

export const ADMISSION_WORKSHOP_OPTIONS: readonly AdmissionWorkshop[] =
  Object.values(AdmissionWorkshop);
