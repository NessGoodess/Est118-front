"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/Button";
import { FloatingInput } from "@/components/ui/FloatingInputs";
import { FloatingSelect } from "@/components/ui/FloatingSelect";
import ProfileSection from "../ProfileSection";
import ProfileInfoTile from "../ProfileInfoTile";
import { formatFieldValue } from "../formatters";
import type { StudentProfileStudentInfo } from "@/features/students/types/student-profile";
import {
  studentProfileSchema,
  toProfilePayload,
  type StudentProfileFormValues,
  type StudentProfileUpdatePayload,
} from "@/features/students/schemas/student-update.schema";

function toDefaults(info: StudentProfileStudentInfo): StudentProfileFormValues {
  return {
    first_name: info.first_name ?? "",
    last_name: info.last_name ?? "",
    national_id: info.national_id ?? "",
    birth_date: info.birth_date ? String(info.birth_date).slice(0, 10) : "",
    gender:
      info.gender === "M" || info.gender === "F" || info.gender === "O" ? info.gender : "",
    phone_number: info.phone ?? "",
    phone_second_number: info.phone_secondary ?? "",
    email: info.email ?? "",
  };
}

interface StudentInfoSectionProps {
  info: StudentProfileStudentInfo;
  canEdit: boolean;
  saving?: boolean;
  onSave: (profile: StudentProfileUpdatePayload) => Promise<unknown>;
}

export default function StudentInfoSection({
  info,
  canEdit,
  saving,
  onSave,
}: StudentInfoSectionProps) {
  const [editing, setEditing] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<StudentProfileFormValues>({
    resolver: zodResolver(studentProfileSchema),
    defaultValues: toDefaults(info),
  });

  useEffect(() => {
    if (!editing) reset(toDefaults(info));
  }, [info, editing, reset]);

  const onSubmit = handleSubmit(async (data) => {
    const ok = await onSave(toProfilePayload(data));
    if (ok) setEditing(false);
  });

  const tiles = [
    { key: "full_name", label: "Nombre completo", value: info.full_name ?? info.name },
    { key: "national_id", label: "CURP", value: info.national_id },
    { key: "birth_date", label: "Fecha de nacimiento", value: info.birth_date },
    { key: "gender", label: "Sexo", value: info.gender },
    { key: "phone", label: "Teléfono principal", value: info.phone },
    { key: "phone_secondary", label: "Teléfono secundario", value: info.phone_secondary },
    { key: "email", label: "Correo electrónico", value: info.email },
    { key: "credential_id", label: "Credencial / UID", value: info.credential_id },
  ];

  return (
    <ProfileSection
      title="Datos del alumno"
      description="Información del perfil del alumno"
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
              <Button type="submit" form="student-profile-form" size="sm" loading={saving}>
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
          id="student-profile-form"
          onSubmit={onSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1 min-w-0"
          noValidate
        >
          <FloatingInput
            label="Nombre(s)"
            required
            disabled={saving}
            {...register("first_name")}
            error={errors.first_name?.message}
          />
          <FloatingInput
            label="Apellidos"
            required
            disabled={saving}
            {...register("last_name")}
            error={errors.last_name?.message}
          />
          <FloatingInput
            label="CURP"
            required
            disabled={saving}
            {...register("national_id")}
            error={errors.national_id?.message}
          />
          <FloatingInput
            label="Fecha de nacimiento"
            type="date"
            disabled={saving}
            {...register("birth_date")}
            error={errors.birth_date?.message}
          />
          <FloatingSelect
            label="Sexo"
            required
            disabled={saving}
            {...register("gender")}
            error={errors.gender?.message}
          >
            <option value="M">Masculino</option>
            <option value="F">Femenino</option>
            <option value="O">No Especificado</option>
          </FloatingSelect>
          <FloatingInput
            label="Teléfono principal"
            type="tel"
            disabled={saving}
            {...register("phone_number")}
            error={errors.phone_number?.message}
          />
          <FloatingInput
            label="Teléfono secundario"
            disabled={saving}
            type="tel"
            {...register("phone_second_number")}
            error={errors.phone_second_number?.message}
          />
          <FloatingInput
            label="Correo"
            type="email"
            disabled={saving}
            {...register("email")}
            error={errors.email?.message}
          />
        </form>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {tiles.map((t) => (
            <ProfileInfoTile key={t.key} label={t.label} value={formatFieldValue(t.key, t.value)} />
          ))}
        </div>
      )}
    </ProfileSection>
  );
}
