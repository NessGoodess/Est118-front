import UserFormSkeleton from "@/features/users/components/shared/UserFormSkeleton";

export default function CreateUserLoading() {
  return (
    <div className="space-y-6">
      <UserFormSkeleton
        label="Cargando crear usuario"
        showPasswordHints
      />
    </div>
  );
}
