"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  editUserSchema,
  type EditUserFormData,
} from "@/features/users/schemas/user.schemas";
import {
  getRoles,
  updateUser,
  type Role,
} from "@/features/users/services/users.service";
import type { UserDetail } from "@/features/users/types/users";
import PermissionSelector from "@/features/users/components/shared/PermissionSelector";
import EditUserInputs from "@/features/users/components/edit/EditUserInputs";
import { SectionWrapper } from "@/features/users/components/shared/SectionWrapper";
import { Button } from "@/components/ui/Button";
import { globalToast } from "@/lib/toast";

interface EditUserFormProps {
  user: UserDetail;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function EditUserForm({
  user,
  onSuccess,
  onCancel,
}: EditUserFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [roles, setRoles] = useState<Role[]>([]);
  const [selectedRoles, setSelectedRoles] = useState<string[]>(
    user.roles[0]?.name ? [user.roles[0].name] : []
  );
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>(
    user.permissions.map((p) => p.name) || []
  );
  const [loadingRoles, setLoadingRoles] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EditUserFormData>({
    resolver: zodResolver(editUserSchema),
    defaultValues: { name: user.name, email: user.email },
  });

  useEffect(() => {
    setSelectedRoles(user.roles[0]?.name ? [user.roles[0].name] : []);
    setSelectedPermissions(user.permissions.map((p) => p.name) || []);
  }, [user]);

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

  const onSubmit = async (data: EditUserFormData) => {
    setErrorMessage("");
    setIsSubmitting(true);
    try {
      await updateUser(user.id, {
        ...data,
        roles: selectedRoles,
        permissions: selectedPermissions,
      });
      globalToast.success("Usuario actualizado exitosamente");
      onSuccess?.();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Error al actualizar el usuario";
      setErrorMessage(message);
      globalToast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <SectionWrapper
          left={
            <EditUserInputs
              register={register}
              errors={errors}
              roles={roles}
              selectedRoles={selectedRoles}
              onSelectedRolesChange={setSelectedRoles}
              loadingRoles={loadingRoles}
            />
          }
          right={
            <PermissionSelector
              selectedPermissions={selectedPermissions}
              onChange={setSelectedPermissions}
            />
          }
          bottom={
            <div className="mt-4 flex flex-col gap-3">
              {errorMessage ? (
                <div className="rounded-lg border border-danger/30 bg-danger/10 p-3 text-sm text-danger">
                  {errorMessage}
                </div>
              ) : null}
              <div className="flex justify-end gap-3">
                {onCancel ? (
                  <Button
                    type="button"
                    variant="secondary"
                    disabled={isSubmitting}
                    onClick={onCancel}
                  >
                    Cancelar
                  </Button>
                ) : null}
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  loading={isSubmitting}
                  loadingText="Actualizando..."
                >
                  Actualizar usuario
                </Button>
              </div>
            </div>
          }
        />
      </form>
    </div>
  );
}
