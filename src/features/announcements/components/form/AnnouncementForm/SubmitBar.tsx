"use client"

import { Button } from "@/components/ui/Button"
import type { PublishAction } from "@/features/announcements/lib/announcement-display"

type Props = {
  isEditing: boolean
  isSubmitting: boolean
  onCancel: () => void
  onAction: (action: PublishAction) => void
}

export default function AnnouncementFormSubmitBar({
  isEditing,
  isSubmitting,
  onCancel,
  onAction,
}: Props) {
  return (
    <div className="flex flex-col gap-4 rounded-b-2xl bg-surface-muted px-6 py-5 md:px-8">
      <p className="text-xs text-fg-muted">
        Los campos marcados con <span className="text-danger">*</span> son obligatorios.
        Usa <strong className="font-medium">Programar</strong> con fecha futura o{" "}
        <strong className="font-medium">Publicar ahora</strong> para hacerlo visible.
      </p>

      <div className="flex w-full flex-wrap items-center justify-end gap-3">
        <Button variant="secondary" type="button" onClick={onCancel} disabled={isSubmitting}>
          Cancelar
        </Button>
        <Button
          variant="secondary"
          type="button"
          disabled={isSubmitting}
          onClick={() => onAction("draft")}
        >
          Guardar borrador
        </Button>
        <Button
          variant="secondary"
          type="button"
          disabled={isSubmitting}
          onClick={() => onAction("schedule")}
        >
          Programar
        </Button>
        <Button
          variant="primary"
          type="button"
          disabled={isSubmitting}
          onClick={() => onAction("publish")}
        >
          {isEditing ? "Publicar / actualizar" : "Publicar ahora"}
        </Button>
      </div>
    </div>
  )
}
