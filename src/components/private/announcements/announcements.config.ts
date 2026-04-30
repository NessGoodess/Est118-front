import { EnhancedTableConfig } from "@/lib/types/data-table";
import { AnnouncementRawItem } from "@/lib/services/announcements.service";
import { globalToast } from "@/lib/toast";

export const announcementsTableConfig: EnhancedTableConfig<AnnouncementRawItem> = {
  columns: [
    {
      key: 'title',
      label: 'Título',
      width: 'auto',
      align: 'left' as const,
      sortable: true,
      searchable: true,
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
      // The frontend public detail page lives on /Announcements/[id]
      href: (item: AnnouncementRawItem) => `/Announcements/${item.id}`,
      variant: 'secondary' as const,
    },
    {
      label: '',
      icon: 'edit',
      // Send to the form page with an edit param.
      href: (item: AnnouncementRawItem) => `/Announcement?edit=1&id=${item.id}`,
      variant: 'primary' as const,
    },
    {
      label: '',
      icon: 'trash',
      // Action is handled by the parent list component.
      onClick: () => { /* Placeholder, set by component */ },
      variant: 'danger' as const,
    },
    {
      label: '',
      icon: 'share',
      variant: 'secondary' as const,
      onClick: async (item: AnnouncementRawItem) => {
        const url = `${window.location.origin}/Announcements/${item.id}`;

        if (navigator.share) {
          try {
            await navigator.share({
              title: item.title,
              text: `mira este aviso: ${item.title}`,
              url: url,
            });
          } catch (error) {
            console.error('Error sharing:', error);
            globalToast.error('Error al compartir');
          }
        } else if (navigator.clipboard && window.isSecureContext) {
          try {
            await navigator.clipboard.writeText(url);
            globalToast.success('Enlace copiado al portapapeles');
          } catch (error) {
            console.error('Clipboard error:', error);
            globalToast.error('No se pudo copiar el enlace');
          }
        } else {
          // 🔥 Fallback viejo (100% confiable)
          const textarea = document.createElement('textarea');
          textarea.value = url;
          document.body.appendChild(textarea);
          textarea.select();
          try {
            document.execCommand('copy');
            globalToast.success('Enlace copiado');
          } catch {
            globalToast.error('No se pudo copiar el enlace');
          }
          document.body.removeChild(textarea);
        }
      }

    }
  ],

  features: {
    rowClickable: true,
    rowClickRoute: (item: AnnouncementRawItem) => `/Announcements/${item.id}`,
    selectionEnabled: false,
  },

  itemsPerPage: 10,
  searchable: true,
  sortable: true,
  selectable: false, // Disable checkbox column
};

