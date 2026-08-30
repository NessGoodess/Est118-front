"use client"

import { Controller, type Control, type FieldErrors, type UseFormRegister } from "react-hook-form"
import { FloatingInput } from "@/components/ui/FloatingInputs"
import { FloatingSelect } from "@/components/ui/FloatingSelect"
import { IconByName } from "@/components/ui/icons"
import {
  ANNOUNCEMENT_TYPES,
  type AnnouncementFormValues,
} from "@/features/announcements/validations/announcement.schema"
import { SectionTitle, ToggleChip } from "./form-ui"

type Props = {
  register: UseFormRegister<AnnouncementFormValues>
  control: Control<AnnouncementFormValues>
  errors: FieldErrors<AnnouncementFormValues>
  showUrgentAlertLabel: boolean
}

export default function AnnouncementFormGeneralSection({
  register,
  control,
  errors,
  showUrgentAlertLabel,
}: Props) {
  return (
    <div className="px-6 py-7 md:px-8">
      <SectionTitle
        title="Información general"
        description="Datos principales del aviso que se muestran en la tarjeta de listado y en la vista completa."
        icon={<IconByName name="fileText" className="h-4.5 w-4.5" />}
      />

      <div className="grid gap-x-5 gap-y-0 md:grid-cols-2">
        <FloatingInput
          label="Título del aviso"
          required
          error={errors.title?.message}
          {...register("title")}
        />
        <FloatingInput
          label="Slug (URL amigable)"
          placeholder="mi-aviso-importante"
          helperText="Déjalo vacío para generarlo automáticamente."
          error={errors.slug?.message}
          {...register("slug")}
        />
        <FloatingInput
          label="Autor"
          placeholder="Dirección, Comunicación Escolar…"
          error={errors.author?.message}
          {...register("author")}
        />
        <Controller
          name="type"
          control={control}
          render={({ field }) => (
            <FloatingSelect
              label="Tipo de aviso"
              required
              error={errors.type?.message}
              helperText="El encabezado y badge de alerta se derivan del tipo."
              {...field}
            >
              {ANNOUNCEMENT_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </FloatingSelect>
          )}
        />
      </div>

      <div className="mt-1 grid gap-x-5 gap-y-0 md:grid-cols-2">
        <FloatingInput
          label="Fecha y hora de publicación"
          type="datetime-local"
          helperText="Solo se usa con «Programar». «Publicar ahora» publica al instante; «Borrador» no publica."
          error={errors.publishedAt?.message}
          className="[&_label]:top-0! [&_label]:text-xs! [&_label]:font-semibold! [&_label]:bg-surface-elevated! [&_label]:px-2! [&_label]:-translate-y-1/2!"
          {...register("publishedAt")}
        />
      </div>

      <div className="mt-1 flex flex-wrap gap-2.5">
        <Controller
          name="important"
          control={control}
          render={({ field }) => (
            <ToggleChip
              checked={field.value}
              onChange={field.onChange}
              label="Marcar como importante"
            />
          )}
        />
      </div>

      {showUrgentAlertLabel && (
        <div className="mt-4">
          <FloatingInput
            label="Texto del badge de alerta (Urgente)"
            placeholder="Aviso urgente, Atención inmediata…"
            error={errors.headerAlertLabel?.message}
            {...register("headerAlertLabel")}
          />
        </div>
      )}
    </div>
  )
}
