import { EnhancedTableConfig } from "@/lib/types/data-table";
import { AnnouncementRawItem } from "@/features/announcements/services/announcements.service";
import { globalToast } from "@/lib/toast";
import { getAnnouncementPublicUrl, openFacebookShare } from "@/features/announcements/lib/urls";
import { isAnnouncementPublished } from "@/features/announcements/lib/announcement-display";

export const announcementsTableConfig: EnhancedTableConfig<AnnouncementRawItem> = {
  columns: [
    {
      key: 'title',
      label: 'Título',
      width: 'auto',
      align: 'left' as const,
      sortable: true,
      searchable: true,
      render: 'title',
    },
    {
      key: 'type',
      label: 'Tipo',
      width: '130px',
      align: 'center' as const,
      sortable: true,
      render: 'type-badge',
    },
    {
      key: 'status',
      label: 'Estado',
      width: '120px',
      align: 'center' as const,
      sortable: false,
      render: 'publish-status',
    },
    {
      key: 'important',
      label: 'Prioridad',
      width: '100px',
      align: 'center' as const,
      sortable: true,
      render: 'important-badge',
    },
    {
      key: 'author',
      label: 'Autor',
      width: 'auto',
      align: 'left' as const,
      sortable: true,
      searchable: true,
    },
    {
      key: 'published_at',
      label: 'Fecha de publicación',
      width: '160px',
      align: 'left' as const,
      sortable: true,
      render: 'datetime',
    },
    {
      key: 'created_at',
      label: 'Fecha de creación',
      width: '160px',
      align: 'left' as const,
      sortable: true,
      render: 'date',
    },
  ],
  actions: [
    {
      label: '',
      icon: 'eye',
      href: (item: AnnouncementRawItem) => `/Announcements/${item.slug || item.id}`,
      variant: 'secondary' as const,
      show: (item) => isAnnouncementPublished(item.published_at),
    },
    {
      label: '',
      icon: 'duplicate',
      href: (item: AnnouncementRawItem) => `/Announcement/create?from=${item.id}`,
      variant: 'secondary' as const,
    },
    {
      label: '',
      icon: 'edit',
      href: (item: AnnouncementRawItem) => `/Announcement/${item.id}/edit`,
      variant: 'primary' as const,
    },
    {
      label: '',
      icon: 'trash',
      onClick: () => { },
      variant: 'danger' as const,
    },
    {
      label: '',
      icon: 'share',
      variant: 'secondary' as const,
      show: (item) => isAnnouncementPublished(item.published_at),
      onClick: (item: AnnouncementRawItem) => {
        const origin =
          process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ||
          window.location.origin;
        const url = getAnnouncementPublicUrl(
          item.slug || String(item.id),
          origin
        );
        openFacebookShare(url);
        globalToast.success("Abriendo Facebook para compartir");
      },
    }
  ],

  features: {
    rowClickable: true,
    rowClickRoute: (item: AnnouncementRawItem) => `/Announcement/${item.id}/edit`,
    selectionEnabled: false,
  },

  itemsPerPage: 10,
  searchable: true,
  sortable: true,
  selectable: false,
};
