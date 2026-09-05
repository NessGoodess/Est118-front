import { EnhancedTableConfig } from "@/lib/types/data-table"
import { isAnnouncementPublished } from "@/features/announcements/lib/announcement-display"
import type { EventRawItem } from "@/features/events/types/event"

export const eventsTableConfig: EnhancedTableConfig<EventRawItem> = {
  columns: [
    {
      key: "title",
      label: "Título",
      width: "auto",
      align: "left" as const,
      sortable: true,
      searchable: true,
      render: "title",
    },
    {
      key: "type",
      label: "Tipo",
      width: "140px",
      align: "center" as const,
      sortable: true,
      searchable: true,
      render: "type-badge",
    },
    {
      key: "starts_at",
      label: "Inicio",
      width: "170px",
      align: "left" as const,
      sortable: true,
      render: "datetime",
    },
    {
      key: "location",
      label: "Lugar",
      width: "160px",
      align: "left" as const,
      sortable: true,
      searchable: true,
      render: "location",
    },
    {
      key: "status",
      label: "Estado",
      width: "120px",
      align: "center" as const,
      sortable: false,
      render: "publish-status",
    },
    {
      key: "important",
      label: "Importante",
      width: "110px",
      align: "center" as const,
      sortable: true,
      render: "important-badge",
    },
  ],
  actions: [
    {
      label: "",
      icon: "eye",
      href: (item: EventRawItem) => `/eventos/${item.slug || item.id}`,
      variant: "secondary" as const,
      show: (item) => isAnnouncementPublished(item.published_at),
    },
    {
      label: "",
      icon: "edit",
      href: (item: EventRawItem) => `/Event/${item.id}/edit`,
      variant: "primary" as const,
    },
    {
      label: "",
      icon: "trash",
      onClick: () => {},
      variant: "danger" as const,
    },
  ],

  features: {
    rowClickable: true,
    rowClickRoute: (item: EventRawItem) => `/Event/${item.id}/edit`,
    selectionEnabled: false,
  },

  itemsPerPage: 10,
  searchable: true,
  sortable: true,
  selectable: false,
}
