export { default as UsersTable } from "./components/list/UsersTable";
export { default as UsersFilters } from "./components/list/UsersFilters";
export { default as RegisterUserForm } from "./components/create/RegisterUserForm";
export { default as UserDetailView } from "./components/detail/UserDetailView";
export { default as EditUserForm } from "./components/edit/EditUserForm";
export { default as ChangePasswordForm } from "./components/password/ChangePasswordForm";
export { default as PermissionSelector } from "./components/shared/PermissionSelector";
export { default as PermissionTableSkeleton } from "./components/shared/PermissionTableSkeleton";
export { default as UserFormSkeleton } from "./components/shared/UserFormSkeleton";
export { default as UserDetailSkeleton } from "./components/detail/UserDetailSkeleton";
export { default as PasswordFormSkeleton } from "./components/password/PasswordFormSkeleton";

export { useUserCapabilities, useUsers, useUserDetail } from "./hooks";
export type { UserCapabilities, UsersListFilters } from "./hooks";
export { USER_PERMISSIONS } from "./permissions";
export type { UserPermission } from "./permissions";

export type {
  UserListItem,
  UserDetail,
  RegisterUserData,
  Role,
  Permission,
  RolePayload,
  PermissionPayload,
} from "./types/users";

export {
  labelPermission,
  labelPermissionCategory,
  labelRole,
} from "./utils/permissionLabels";

export {
  registerUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  changePassword,
  resendVerification,
  getRoles,
  getPermissions,
} from "./services/users.service";

export {
  registerUserSchema,
  editUserSchema,
  changePasswordSchema,
} from "./schemas/user.schemas";
export type {
  RegisterUserFormData,
  EditUserFormData,
  ChangePasswordFormData,
} from "./schemas/user.schemas";
