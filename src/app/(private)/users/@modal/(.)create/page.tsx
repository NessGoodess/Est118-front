"use client";

import { RegisterUserForm } from "@/features/users";
import UsersRouteModal, {
  useCancelUsersModal,
  useCloseUsersModalAndRefreshList,
} from "@/features/users/components/modal/UsersRouteModal";

export default function CreateUserModalPage() {
  const onSuccess = useCloseUsersModalAndRefreshList();
  const onCancel = useCancelUsersModal();

  return (
    <UsersRouteModal title="Crear usuario" maxWidth="6xl" reopenKey="create">
      <RegisterUserForm onSuccess={onSuccess} onCancel={onCancel} />
    </UsersRouteModal>
  );
}
