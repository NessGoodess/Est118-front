/**
 * Spatie permissions for school academic years (ciclos escolares).
 *
 *  - view   → ver listado / usar en otros módulos
 *  - create → crear, activar, generar grupos
 *  - delete → eliminar (sin uso / sin inscripciones)
 *  - edit   → no habilitado por ahora
 */
export const ACADEMIC_YEAR_PERMISSIONS = {
  view: "view academic years",
  create: "create academic years",
  delete: "delete academic years",
} as const;

export type AcademicYearPermission =
  (typeof ACADEMIC_YEAR_PERMISSIONS)[keyof typeof ACADEMIC_YEAR_PERMISSIONS];
