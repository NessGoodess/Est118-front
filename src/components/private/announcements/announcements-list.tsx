"use client"
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DataTable } from '@/components/ui/DataTable';
import { announcementsTableConfig } from './announcements.config';
import { tableIcons } from './icons';
import { tableRenderers } from './tableRerenders';
import { TableConfig } from '@/lib/types/data-table';
import { AnnouncementRawItem, deleteAnnouncement } from '@/lib/services/announcements.service';
import { globalToast } from '@/lib/toast';
import { handleApiError } from '@/lib/api';
import { useConfirm } from '@/components/ui/confirm';

interface Props {
  data: AnnouncementRawItem[];
}

export default function AnnouncementsList({ data: initialData }: Props) {
  const [data, setData] = useState<AnnouncementRawItem[]>(initialData);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();
  const { confirm } = useConfirm();

  const handleDelete = async (announcement: AnnouncementRawItem) => {
    confirm({
      title: 'Eliminar aviso',
      description: `¿Estás seguro de que deseas eliminar el aviso "${announcement.title}"?`,
      confirmLabel: 'Eliminar',
      cancelLabel: 'Cancelar',
      variant: 'danger',
      onConfirm: async () => {
        setIsDeleting(true);
        try {
          await deleteAnnouncement(announcement.id);
          setData(prev => prev.filter(item => item.id !== announcement.id));
          globalToast.success("Aviso eliminado", "El aviso se eliminó correctamente.");
        } catch (err) {
          const apiError = handleApiError(err);
          globalToast.error("Error al eliminar", apiError.message ?? "No se pudo eliminar el aviso.");
        } finally {
          setIsDeleting(false);
        }
      }
    });
  };

  // Clone config and inject the delete handler
  const tableConfig: TableConfig<AnnouncementRawItem> = {
    ...announcementsTableConfig,
    actions: announcementsTableConfig.actions?.map(action => {
      if (action.icon === 'trash') {
        return {
          ...action,
          onClick: handleDelete
        };
      }
      return action;
    })
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6 mt-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Avisos</h1>
          <p className="text-sm text-fg-muted mt-1">
            Administra los avisos y comunicados que se muestran en el sitio público.
          </p>
        </div>
        <button
          onClick={() => router.push('/Announcement')}
          className="inline-flex items-center gap-2 bg-primary hover:bg-primary-hover text-primary-foreground px-4 py-2 rounded-xl transition-colors font-medium text-sm shadow-sm"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Crear Aviso
        </button>
      </div>

      <div className={isDeleting ? 'opacity-50 pointer-events-none transition-opacity' : 'transition-opacity'}>
        <DataTable
          config={tableConfig}
          data={data}
          renderers={tableRenderers}
          icons={tableIcons}
          emptyMessage="No se encontraron avisos registrados."
          minRows={5}
        />
      </div>
    </div>
  );
}
