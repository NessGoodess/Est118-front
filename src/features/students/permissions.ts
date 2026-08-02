/** Spatie permissions for the students feature */
export const STUDENT_PERMISSIONS = {
  view: "view students",
  create: "create students",
  edit: "edit students",
  delete: "delete students",
  viewPhotos: "view student photos",
  managePhotos: "manage student photos",
} as const;

export type StudentPermission =
  (typeof STUDENT_PERMISSIONS)[keyof typeof STUDENT_PERMISSIONS];
