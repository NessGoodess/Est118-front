"use client"
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DataTable } from '@/components/ui/DataTable';
import { announcementsTableConfig } from './announcements.config';
import { tableIcons } from './icons';
import { tableRenderers } from './tableRerenders';
import { TableConfig } from '@/lib/types/data-table';
import { AnnouncementRawItem, deleteAnnouncement } from '@/features/announcements/services/announcements.service';
import { globalToast } from '@/lib/toast';
import { handleApiError } from '@/lib/api';
import { useConfirm } from '@/components/ui/confirm';
import { IconByName } from '@/components/ui/icons';
import { Button } from '@/components/ui/Button';
import GenericHeader from '@/components/ui/GenericHeader';

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
    <div className="space-y-2 lg:space-y-6">
      <GenericHeader

        title="Avisos"
        description="Administra los avisos y comunicados que se muestran en el sitio público."
      >
        <Button variant="primary" onClick={() => router.push('/Announcement/create')}>
          Crear un aviso
        </Button>
      </GenericHeader>

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
