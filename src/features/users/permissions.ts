/** Spatie permission names for the users admin feature */
export const USER_PERMISSIONS = {
  view: "view users",
  create: "create users",
  edit: "edit users",
  delete: "delete users",
} as const;

export type UserPermission =
  (typeof USER_PERMISSIONS)[keyof typeof USER_PERMISSIONS];
