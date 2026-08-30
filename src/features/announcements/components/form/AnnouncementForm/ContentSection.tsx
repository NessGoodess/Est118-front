"use client"

import { Controller, type Control, type FieldErrors, type UseFormRegister, type UseFormSetValue } from "react-hook-form"
import { FloatingTextarea } from "@/components/ui/FloatingInputs"
import { IconByName } from "@/components/ui/icons"
import { Button } from "@/components/ui/Button"
import ContentBlocksEditor from "./ContentBlocksEditor"
import { summaryFromBlocks } from "@/features/announcements/lib/announcement-display"
import type { AnnouncementFormValues } from "@/features/announcements/validations/announcement.schema"
import { SectionTitle } from "./form-ui"

type Props = {
  register: UseFormRegister<AnnouncementFormValues>
  control: Control<AnnouncementFormValues>
  errors: FieldErrors<AnnouncementFormValues>
  setValue: UseFormSetValue<AnnouncementFormValues>
  contentBlocks: AnnouncementFormValues["contentBlocks"]
  mediaType: AnnouncementFormValues["mediaType"]
}

export default function AnnouncementFormContentSection({
  register,
  control,
  errors,
  setValue,
  contentBlocks,
  mediaType,
}: Props) {
  const isFacebook = mediaType === "facebook"

  function handleGenerateSummary() {
    const generated = summaryFromBlocks(contentBlocks)
    if (generated) setValue("summary", generated, { shouldValidate: true })
  }

  return (
    <div className="px-6 py-7 md:px-8">
      <SectionTitle
        title={isFacebook ? "Detalles opcionales" : "Contenido"}
        description={
          isFacebook
            ? "Con Facebook el post es el contenido principal. Resumen y bloques solo si quieres añadir algo más."
            : "Resumen para tarjetas y listados; bloques extendidos solo en la vista de detalle."
        }
        icon={<IconByName name="list" className="h-4.5 w-4.5" />}
      />

      <div className="mb-2 flex flex-wrap items-end justify-between gap-3">
        <div className="min-w-0 flex-1">
          <FloatingTextarea
            label={isFacebook ? "Resumen (opcional)" : "Resumen"}
            required={!isFacebook}
            rows={3}
            placeholder={
              isFacebook
                ? "Opcional. Si lo dejas vacío se usa el título en tarjetas."
                : "Texto breve (160–300 caracteres) para home, listado y redes."
            }
            helperText={
              isFacebook
                ? "No es obligatorio cuando el post de Facebook es la media."
                : "Aparece en tarjetas, en redes y el sección del detalle."
            }
            error={errors.summary?.message}
            {...register("summary")}
          />
        </div>
        {!isFacebook ? (
          <Button type="button" variant="secondary" onClick={handleGenerateSummary}>
            Generar desde bloques
          </Button>
        ) : null}
      </div>

      <div className="mt-6">
        <p className="mb-2 text-sm font-semibold text-foreground">
          {isFacebook ? "Texto adicional (opcional)" : "Contenido extendido (vista de detalle)"}
        </p>
        <p className="mb-3 text-xs text-fg-muted">
          {isFacebook
            ? "Solo si hace falta aclarar algo que no diga el post."
            : "Bloques tipados: párrafos, listas, imagen por URL o YouTube."}
        </p>
        <Controller
          name="contentBlocks"
          control={control}
          render={({ field }) => (
            <ContentBlocksEditor value={field.value ?? []} onChange={field.onChange} />
          )}
        />
      </div>
    </div>
  )
}
