import { UseFormRegister, Control, FieldErrors } from "react-hook-form"
import { Controller } from "react-hook-form"
import { FloatingInput } from "@/components/ui/FloatingInputs"
import { AnnouncementFormValues } from "@/lib/validations/announcement.schema"
import { SectionTitle, Divider, ToggleChip } from "./SharedComponents"

interface Props {
  register: UseFormRegister<AnnouncementFormValues>
  control: Control<AnnouncementFormValues>
  errors: FieldErrors<AnnouncementFormValues>
  secondaryButtonEnabled: boolean
}

export function ActionsSection({ register, control, errors, secondaryButtonEnabled }: Props) {
  return (
    <div className="px-6 py-7 md:px-8">
      <SectionTitle
        title="Botones de acción"
        description="Configura los botones que aparecerán al pie del aviso para dirigir al usuario."
        icon={
          <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
        }
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
