"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { DataTable } from "@/components/ui/DataTable"
import { Button } from "@/components/ui/Button"
import GenericHeader from "@/components/ui/GenericHeader"
import { useConfirm } from "@/components/ui/confirm"
import { tableIcons } from "@/features/announcements/components/list/icons"
import { globalToast } from "@/lib/toast"
import type { TableConfig } from "@/lib/types/data-table"
import { deleteGallery } from "@/features/gallery/api/admin"
import type { GalleryRawItem } from "@/features/gallery/types/gallery"
import { galleriesTableConfig } from "./galleries.config"
import { galleryTableRenderers } from "./tableRenderers"

interface Props {
  data: GalleryRawItem[]
}

export default function GalleriesList({ data: initialData }: Props) {
  const [data, setData] = useState<GalleryRawItem[]>(initialData)
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()
  const { confirm } = useConfirm()

  const handleDelete = (gallery: GalleryRawItem) => {
    confirm({
      title: "Eliminar galería",
      description: `¿Eliminar el álbum "${gallery.title}"? También se borrarán sus ${gallery.items_count ?? 0} fotos del servidor.`,
      confirmLabel: "Eliminar",
      cancelLabel: "Cancelar",
      variant: "danger",
      onConfirm: async () => {
        setIsDeleting(true)
        try {
          await deleteGallery(gallery.id)
          setData((prev) => prev.filter((item) => item.id !== gallery.id))
          globalToast.success("Galería eliminada", "El álbum se eliminó correctamente.")
        } catch (err) {
          const message = err instanceof Error ? err.message : "No se pudo eliminar la galería."
          globalToast.error("Error al eliminar", message)
        } finally {
          setIsDeleting(false)
        }
      },
    })
  }

  const tableConfig: TableConfig<GalleryRawItem> = {
    ...galleriesTableConfig,
    actions: galleriesTableConfig.actions?.map((action) =>
      action.icon === "trash" ? { ...action, onClick: handleDelete } : action
    ),
  }

  return (
    <div className="space-y-2 lg:space-y-6">
      <GenericHeader
        title="Galerías"
        description="Administra los álbumes de fotos que se muestran en el sitio público."
      >
        <Button variant="primary" onClick={() => router.push("/Gallery/create")}>
          Crear una galería
        </Button>
      </GenericHeader>

      <div
        className={
          isDeleting
            ? "pointer-events-none opacity-50 transition-opacity"
            : "transition-opacity"
        }
      >
        <DataTable
          config={tableConfig}
          data={data}
          renderers={galleryTableRenderers}
          icons={tableIcons}
          emptyMessage="No se encontraron galerías registradas."
          minRows={5}
        />
      </div>
    </div>
  )
}
