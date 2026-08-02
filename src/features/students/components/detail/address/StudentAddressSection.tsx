"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/Button";
import { FloatingInput } from "@/components/ui/FloatingInputs";
import ProfileSection from "../ProfileSection";
import ProfileInfoTile from "../ProfileInfoTile";
import { formatPlain } from "../formatters";
import type { AddressDetail } from "@/features/students/types/student-profile";
import {
  ADDRESS_FIELD_LABELS,
  studentAddressSchema,
  toAddressPayload,
  type StudentAddressFormValues,
  type StudentAddressUpdatePayload,
} from "@/features/students/schemas/student-update.schema";

function toDefaults(address: AddressDetail | null | undefined): StudentAddressFormValues {
  return Object.fromEntries(
    ADDRESS_FIELD_LABELS.map(({ key }) => [key, address?.[key] ?? ""])
  ) as StudentAddressFormValues;
}

interface StudentAddressSectionProps {
  address: AddressDetail | null | undefined;
  canEdit: boolean;
  saving?: boolean;
  onSave: (address: StudentAddressUpdatePayload) => Promise<unknown>;
}

export default function StudentAddressSection({
  address,
  canEdit,
  saving,
  onSave,
}: StudentAddressSectionProps) {
  const [editing, setEditing] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<StudentAddressFormValues>({
    resolver: zodResolver(studentAddressSchema),
    defaultValues: toDefaults(address),
  });

  useEffect(() => {
    if (!editing) reset(toDefaults(address));
  }, [address, editing, reset]);

  const tiles = useMemo(
    () =>
      ADDRESS_FIELD_LABELS.map(({ key, label }) => ({
        key,
        label,
        value: formatPlain(address?.[key]),
      })),
    [address]
  );

  const hasData = tiles.some((t) => t.value !== "—");

  const onSubmit = handleSubmit(async (data) => {
    const ok = await onSave(toAddressPayload(data));
    if (ok) setEditing(false);
  });

  return (
    <ProfileSection
      title="Domicilio"
      description="Información de domicilio del estudiante."
      elevated={editing}
      actions={
        canEdit ? (
          editing ? (
            <>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                disabled={saving}
                onClick={() => setEditing(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" form="student-address-form" size="sm" loading={saving}>
                Guardar
              </Button>
            </>
          ) : (
            <Button type="button" variant="secondary" size="sm" onClick={() => setEditing(true)}>
              Editar
            </Button>
          )
        ) : null
      }
    >
      {editing ? (
        <form
          id="student-address-form"
          onSubmit={onSubmit}
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-4 gap-y-1 min-w-0"
          noValidate
        >
          {ADDRESS_FIELD_LABELS.map(({ key, label }) => (
            <FloatingInput
              key={key}
              label={label}
              disabled={saving}
              {...register(key)}
              error={errors[key]?.message}
            />
          ))}
        </form>
      ) : hasData ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {tiles.map((t) => (
            <ProfileInfoTile key={t.key} label={t.label} value={t.value} />
          ))}
        </div>
      ) : (
        <p className="text-sm text-fg-muted">Sin domicilio capturado para este perfil.</p>
      )}
    </ProfileSection>
  );
}
