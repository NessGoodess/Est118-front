"use client"

import { Controller, type Control, type FieldErrors, type UseFormRegister } from "react-hook-form"
import { FloatingInput } from "@/components/ui/FloatingInputs"
import { IconByName } from "@/components/ui/icons"
import type { AnnouncementFormValues } from "@/features/announcements/validations/announcement.schema"
import { Divider, SectionTitle, ToggleChip } from "./form-ui"

type Props = {
  register: UseFormRegister<AnnouncementFormValues>
  control: Control<AnnouncementFormValues>
  errors: FieldErrors<AnnouncementFormValues>
  secondaryButtonEnabled: boolean
}

export default function AnnouncementFormActionsSection({
  register,
  control,
  errors,
  secondaryButtonEnabled,
}: Props) {
  return (
    <div className="px-6 py-7 md:px-8">
      <SectionTitle
        title="Botones de acción"
        description="Configura los botones que aparecerán al pie del aviso para dirigir al usuario."
        icon={<IconByName name="link" className="h-4.5 w-4.5" />}
      />

      <Divider />

      <div className="mb-4 flex items-center gap-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-fg-muted">
          Botón secundario
        </p>
        <Controller
          name="secondaryButtonEnabled"
          control={control}
          render={({ field }) => (
            <ToggleChip
              checked={field.value}
              onChange={field.onChange}
              label={field.value ? "Habilitado" : "Deshabilitado"}
            />
          )}
        />
      </div>

      {secondaryButtonEnabled && (
        <div className="grid gap-x-5 gap-y-0 md:grid-cols-2">
          <FloatingInput
            label="Texto del botón secundario"
            error={errors.secondaryButtonLabel?.message}
            {...register("secondaryButtonLabel")}
          />
          <FloatingInput
            label="URL del botón secundario"
            error={errors.secondaryButtonHref?.message}
            {...register("secondaryButtonHref")}
          />
        </div>
      )}
    </div>
  )
}
