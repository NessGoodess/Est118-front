import { EnhancedTableConfig } from "@/lib/types/data-table"
import { isAnnouncementPublished } from "@/features/announcements/lib/announcement-display"
import type { GalleryRawItem } from "@/features/gallery/types/gallery"

export const galleriesTableConfig: EnhancedTableConfig<GalleryRawItem> = {
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
      key: "category",
      label: "Categoría",
      width: "140px",
      align: "center" as const,
      sortable: true,
      searchable: true,
      render: "category-badge",
    },
    {
      key: "items_count",
      label: "Fotos",
      width: "90px",
      align: "center" as const,
      sortable: true,
      render: "photos-count",
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
      key: "featured",
      label: "Destacada",
      width: "110px",
      align: "center" as const,
      sortable: true,
      render: "featured-badge",
    },
    {
      key: "published_at",
      label: "Fecha de publicación",
      width: "160px",
      align: "left" as const,
      sortable: true,
      render: "datetime",
    },
  ],
  actions: [
    {
      label: "",
      icon: "eye",
      href: (item: GalleryRawItem) => `/galeria/${item.slug || item.id}`,
      variant: "secondary" as const,
      show: (item) => isAnnouncementPublished(item.published_at),
    },
    {
      label: "",
      icon: "edit",
      href: (item: GalleryRawItem) => `/Gallery/${item.id}/edit`,
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
    rowClickRoute: (item: GalleryRawItem) => `/Gallery/${item.id}/edit`,
    selectionEnabled: false,
  },

  itemsPerPage: 10,
  searchable: true,
  sortable: true,
  selectable: false,
}
