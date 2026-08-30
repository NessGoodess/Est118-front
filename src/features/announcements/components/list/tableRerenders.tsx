import { formatShortWithTime, formatDate } from "@/lib/utils/dateFormatter";
import { announcementStatusLabel } from "@/features/announcements/lib/announcement-display";
import type { AnnouncementRawItem } from "@/features/announcements/services/announcements.service";

export const tableRenderers = {
  'title': (value: unknown) => {
    const title = value as string;
    return (
      <span className="line-clamp-2 whitespace-wrap max-w-sm">{title}</span>
    );
  },
  'type-badge': (value: unknown) => {
    const type = value as string;
    const colors: Record<string, string> = {
      Informativo: 'bg-primary-soft text-primary border-border',
      Urgente: 'bg-danger/10 text-danger border-danger/30',
      Recordatorio: 'bg-warning/10 text-warning-foreground border-warning/30',
      Tarea: 'bg-success/10 text-success border-success/30',
      General: 'bg-surface-muted text-foreground border-border',
      Noticia: 'bg-accent/15 text-accent border-accent/30',
    };
    
    const colorClass = colors[type] || colors['General'];
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${colorClass}`}>
        {type}
      </span>
    );
  },
  
  'important-badge': (value: unknown) => {
    const isImportant = value as boolean;
    if (!isImportant) return null;
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-danger/15 text-danger">
        Importante
      </span>
    );
  },

  'publish-status': (_value: unknown, row?: AnnouncementRawItem) => {
    const status = announcementStatusLabel(row?.published_at);
    const colors: Record<string, string> = {
      Borrador: 'bg-surface-muted text-fg-muted border-border',
      Programado: 'bg-warning/10 text-warning-foreground border-warning/30',
      Publicado: 'bg-success/10 text-success border-success/30',
    };
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${colors[status]}`}>
        {status}
      </span>
    );
  },
  
  'date': (value: unknown) => {
    if (!value) return <span className="text-fg-muted text-sm">-</span>;
    return (
      <span className="text-sm">
        {formatDate(value as string)}
      </span>
    );
  },
  
  'datetime': (value: unknown) => {
    if (!value) return <span className="text-fg-muted text-sm">-</span>;
    return (
      <span className="text-sm cursor-help" title={new Date(value as string).toLocaleString()}>
        {formatShortWithTime(new Date(value as string))}
      </span>
    );
  },
};
