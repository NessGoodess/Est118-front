"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  changePasswordSchema,
  type ChangePasswordFormData,
} from "@/features/users/schemas/user.schemas";
import { changePassword } from "@/features/users/services/users.service";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { FloatingPassword } from "@/components/ui/FloatingInputs";
import { IconByName } from "@/components/ui/icons";
import { globalToast } from "@/lib/toast";
import { Button } from "@/components/ui/Button";

interface ChangePasswordFormProps {
  userId: number;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function ChangePasswordForm({
  userId,
  onSuccess,
  onCancel,
}: ChangePasswordFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
  });

  const onSubmit = async (data: ChangePasswordFormData) => {
    setErrorMessage("");
    setIsSubmitting(true);
    try {
      await changePassword(userId, data.password, data.password_confirmation);
      globalToast.success("Contraseña actualizada exitosamente");
      reset();
      onSuccess?.();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Error al actualizar la contraseña";
      setErrorMessage(message);
      globalToast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
      <div className="bg-surface-elevated rounded-lg border border-border p-4 shadow-card">
      <FloatingPassword
        label="Nueva contraseña"
        type="password"
        autoComplete="new-password"
        required
        {...register("password")}
        error={errors.password?.message}
        icon={<IconByName name="lock" className="h-5 w-5" />}
      />

      <FloatingPassword
        label="Confirmar contraseña"
        type="password"
        autoComplete="new-password"
        required
        {...register("password_confirmation")}
        error={errors.password_confirmation?.message}
        icon={<IconByName name="lock" className="h-5 w-5" />}
      />

      {errorMessage ? (
        <div className="rounded-lg border border-danger/30 bg-danger/10 p-3 text-sm text-danger">
          {errorMessage}
        </div>
      ) : null}

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
      <div className="flex justify-end gap-3">
        {onCancel ? (
          <Button
            variant="secondary"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
        ) : null}
        <Button type="submit" variant="primary" disabled={isSubmitting}>
          {isSubmitting ? "Actualizando..." : "Actualizar"}
        </Button>
      </div>
    </form>
  );
}
