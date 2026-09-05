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
import { deleteEvent } from "@/features/events/services/admin"
import type { EventRawItem } from "@/features/events/types/event"
import { eventsTableConfig } from "./events.config"
import { eventTableRenderers } from "./tableRenderers"

interface Props {
  data: EventRawItem[]
}

export default function EventsAdminList({ data: initialData }: Props) {
  const [data, setData] = useState<EventRawItem[]>(initialData)
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()
  const { confirm } = useConfirm()

  const handleDelete = (event: EventRawItem) => {
    confirm({
      title: "Eliminar evento",
      description: `¿Eliminar "${event.title}"? Esta acción no se puede deshacer.`,
      confirmLabel: "Eliminar",
      cancelLabel: "Cancelar",
      variant: "danger",
      onConfirm: async () => {
        setIsDeleting(true)
        try {
          await deleteEvent(event.id)
          setData((prev) => prev.filter((item) => item.id !== event.id))
          globalToast.success("Evento eliminado", "El evento se eliminó correctamente.")
        } catch (err) {
          const message = err instanceof Error ? err.message : "No se pudo eliminar el evento."
          globalToast.error("Error al eliminar", message)
        } finally {
          setIsDeleting(false)
        }
      },
    })
  }

  const tableConfig: TableConfig<EventRawItem> = {
    ...eventsTableConfig,
    actions: eventsTableConfig.actions?.map((action) =>
      action.icon === "trash" ? { ...action, onClick: handleDelete } : action
    ),
  }

  return (
    <div className="space-y-2 lg:space-y-6">
      <GenericHeader
        title="Eventos"
        description="Administra las actividades que se muestran en /eventos y el calendario escolar."
      >
        <Button variant="primary" onClick={() => router.push("/Event/create")}>
          Crear un evento
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
          renderers={eventTableRenderers}
          icons={tableIcons}
          emptyMessage="No se encontraron eventos registrados."
          minRows={5}
        />
      </div>
    </div>
  )
}
