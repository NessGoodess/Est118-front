import UserFormSkeleton from "@/features/users/components/shared/UserFormSkeleton";

export default function EditUserLoading() {
  return (
    <div className="space-y-6">
      <UserFormSkeleton label="Cargando edición de usuario" />
    </div>
  );
}
