import { UseFormRegister, Control, FieldErrors } from "react-hook-form"
import { Controller } from "react-hook-form"
import { FloatingTextarea } from "@/components/ui/FloatingInputs"
import { FloatingSelect as FS } from "@/components/ui/FloatingSelect"
import { AnnouncementFormValues } from "@/lib/validations/announcement.schema"
import { SectionTitle } from "./SharedComponents"

interface Props {
  register: UseFormRegister<AnnouncementFormValues>
  control: Control<AnnouncementFormValues>
  errors: FieldErrors<AnnouncementFormValues>
  contentType: string
}

export function ContentSection({ register, control, errors, contentType }: Props) {
  return (
    <div className="px-6 py-7 md:px-8">
      <SectionTitle
        title="Contenido"
        description="Cuerpo del aviso que se muestra en la vista completa."
        icon={
          <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M4 6h16M4 12h12M4 18h8" />
          </svg>
        }
      />

      <Controller
        name="contentType"
        control={control}
        render={({ field }) => (
          <FS
            label="Tipo de contenido"
            helperText="Elige si el cuerpo es un párrafo o una lista de puntos."
            error={errors.contentType?.message}
            {...field}
          >
            <option value="text">Texto libre</option>
            <option value="list">Lista de puntos</option>
          </FS>
        )}
      />

      {contentType === "text" && (
        <FloatingTextarea
          label="Contenido"
          rows={5}
          error={errors.contentText?.message}
          {...register("contentText")}
        />
      )}

      {contentType === "list" && (
        <FloatingTextarea
          label="Ítems de la lista (un ítem por línea)"
          rows={5}
          placeholder={"Primer punto\nSegundo punto\nTercer punto"}
          helperText="Cada línea se convierte en un ítem de la lista."
          error={errors.contentItems?.message}
          {...register("contentItems")}
        />
      )}

      <div className="mt-2">
        <FloatingTextarea
          label="Resumen corto"
          rows={3}
          placeholder="Texto breve que aparece en la tarjeta de listado (máx. 300 caracteres)."
          helperText="Si lo dejas vacío se usará el inicio del contenido."
          error={errors.summary?.message}
          {...register("summary")}
        />
      </div>
    </div>
  )
}
