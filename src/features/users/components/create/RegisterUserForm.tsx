"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { registerUserSchema, type RegisterUserFormData, } from "@/features/users/schemas/user.schemas";
import { getRoles, registerUser, type Role, } from "@/features/users/services/users.service";
import PermissionSelector from "@/features/users/components/shared/PermissionSelector";
import UserInputs from "@/features/users/components/create/UserInputs";
import { globalToast } from "@/lib/toast";
import { ApiError } from "@/lib/types/auth";
import { formatError } from "@/lib/api";
import { SectionWrapper } from "../shared/SectionWrapper";
import { Button } from "@/components/ui/Button";

export default function RegisterUserForm({
  onSuccess,
  onCancel,
}: {
  onSuccess?: () => void;
  onCancel?: () => void;
} = {}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [roles, setRoles] = useState<Role[]>([]);
  const [selectedRoles, setSelectedRoles] = useState<string[]>(["user"]);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [loadingRoles, setLoadingRoles] = useState(true);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RegisterUserFormData>({
    resolver: zodResolver(registerUserSchema),
  });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await getRoles();
        if (!cancelled) setRoles(data);
      } catch (error) {
        console.error("Error loading roles:", error);
      } finally {
        if (!cancelled) setLoadingRoles(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const onSubmit = async (data: RegisterUserFormData) => {
    setIsSubmitting(true);
    try {
      const newUser = await registerUser({
        ...data,
        roles: selectedRoles.length > 0 ? selectedRoles : undefined,
        permissions:
          selectedPermissions.length > 0 ? selectedPermissions : undefined,
      });
      globalToast.success("Exito", `Usuario "${newUser.name}" creado exitosamente`);
      reset();
      setSelectedRoles(["user"]);
      setSelectedPermissions([]);
      if (onSuccess) {
        onSuccess();
      } else {
        router.push("/users");
      }
    } catch (err: unknown) {
      globalToast.error("Error al crear el usuario", formatError(err as ApiError));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <SectionWrapper
          left={
            <UserInputs
              register={register}
              errors={errors}
              roles={roles}
              selectedRoles={selectedRoles}
              onSelectedRolesChange={setSelectedRoles}
              loadingRoles={loadingRoles}
            />
          }
          right={
            <div className="flex min-w-0 flex-col-reverse gap-2 lg:flex-col lg:gap-4">
              <PermissionSelector
                selectedPermissions={selectedPermissions}
                onChange={setSelectedPermissions}
              />
              <div className="rounded-lg bg-primary-soft p-4">
                <p className="mb-2 text-sm font-medium text-primary">
                  Requisitos de contraseña:
                </p>
                <ul className="list-inside list-disc space-y-1 text-xs text-primary">
                  <li>Mínimo 8 caracteres</li>
                  <li>Al menos una letra mayúscula</li>
                  <li>Al menos una letra minúscula</li>
                  <li>Al menos un número</li>
                </ul>
              </div>
            </div>
          }
          bottom={
            <div className="mt-4 flex justify-end gap-3">
              <Button
                type="button"
                variant="secondary"
                disabled={isSubmitting}
                onClick={() => (onCancel ? onCancel() : router.back())}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                loading={isSubmitting}
                loadingText="Creando usuario..."
              >
                Crear usuario
              </Button>
            </div>
          }
        />
      </form>
    </div>
  );
}
