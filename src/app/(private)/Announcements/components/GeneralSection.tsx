import { UseFormRegister, Control, FieldErrors } from "react-hook-form"
import { Controller } from "react-hook-form"
import { FloatingInput } from "@/components/ui/FloatingInputs"
import { FloatingSelect } from "@/components/ui/FloatingSelect"
import { ToggleChip } from "./SharedComponents"
import { ANNOUNCEMENT_TYPES, AnnouncementFormValues } from "@/lib/validations/announcement.schema"
import { SectionTitle } from "./SharedComponents"

interface Props {
  register: UseFormRegister<AnnouncementFormValues>
  control: Control<AnnouncementFormValues>
  errors: FieldErrors<AnnouncementFormValues>
  headerAlertEnabled: boolean
}

export function GeneralSection({ register, control, errors, headerAlertEnabled }: Props) {
  return (
    <div className="px-6 py-7 md:px-8">
      <SectionTitle
        title="Información general"
        description="Datos principales del aviso que se muestran en la tarjeta de listado y en la vista completa."
        icon={
          <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        }
      />

      <div className="grid gap-x-5 gap-y-0 md:grid-cols-2">
        <FloatingInput
          label="Título del aviso"
          required
          error={errors.title?.message}
          {...register("title")}
        />
        <FloatingInput
          label="Encabezado (header)"
          placeholder="Comunicado, Calendario, Noticias…"
          helperText='Texto destacado encima del título. Ej: "Comunicado"'
          error={errors.header?.message}
          {...register("header")}
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
      </div>

      <div className="grid gap-x-5 gap-y-0 md:grid-cols-2">
        <Controller
          name="type"
          control={control}
          render={({ field }) => (
            <FloatingSelect
              label="Tipo de aviso"
              required
              error={errors.type?.message}
              helperText="Clasifica el aviso para facilitar su filtrado."
              {...field}
            >
              {ANNOUNCEMENT_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </FloatingSelect>
          )}
        />
        <FloatingInput
          label="Fecha y hora de publicación"
          type="datetime-local"
          helperText="Déjalo vacío para publicar ahora mismo."
          error={errors.publishedAt?.message}
          {...register("publishedAt")}
        />
      </div>

      {/* Toggles */}
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
        <Controller
          name="headerAlertEnabled"
          control={control}
          render={({ field }) => (
            <ToggleChip
              checked={field.value}
              onChange={field.onChange}
              label="Mostrar badge de alerta"
            />
          )}
        />
      </div>

      {headerAlertEnabled && (
        <div className="mt-4">
          <FloatingInput
            label="Texto del badge de alerta"
            placeholder="Importante, Fechas oficiales, Urgente…"
            error={errors.headerAlertLabel?.message}
            {...register("headerAlertLabel")}
          />
        </div>
      )}
    </div>
  )
}
