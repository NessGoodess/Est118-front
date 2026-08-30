"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import GenericHeader from "@/components/ui/GenericHeader"
import { Button } from "@/components/ui/Button"
import FacebookShareButton from "@/features/announcements/shared/FacebookShareButton"

type Props = {
  isEditing: boolean
  editId?: string
  isPublicVisible?: boolean
  onPreview: () => void
}

export default function AnnouncementFormHeader({
  isEditing,
  editId,
  isPublicVisible,
  onPreview,
}: Props) {
  const router = useRouter()

  return (
    <GenericHeader
      title={isEditing ? "Editar aviso" : "Nuevo aviso"}
      description={
        isEditing
          ? "Modifica los detalles del comunicado."
          : "Crea y publica un comunicado para la comunidad escolar."
      }
    >
      <div className="flex flex-wrap items-center gap-3">
        <Button variant="secondary" onClick={onPreview}>
          Vista previa
        </Button>
        {isEditing && editId && isPublicVisible ? (
          <Link
            href={`/Announcements/${editId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-md border border-border bg-surface-elevated px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-surface-muted"
          >
            Ver público
          </Link>
        ) : null}
        {isEditing && editId && isPublicVisible ? (
          <FacebookShareButton idOrSlug={String(editId)} variant="ghost" label="Compartir" />
        ) : null}
        <Button variant="ghost" onClick={() => router.push("/Announcement")}>
          &larr; Volver a la lista
        </Button>
      </div>
    </GenericHeader>
  )
}
