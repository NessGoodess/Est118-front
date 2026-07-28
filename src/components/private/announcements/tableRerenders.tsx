import { formatShortWithTime, formatDate } from "@/lib/utils/dateFormatter";

export const tableRenderers = {
  'type-badge': (value: unknown) => {
    const type = value as string;
    const colors: Record<string, string> = {
      Informativo: 'bg-primary-soft text-primary border-border',
      Urgente: 'bg-danger/10 text-danger border-danger/30',
      Recordatorio: 'bg-warning/10 text-warning-foreground border-warning/30',
      Tarea: 'bg-success/10 text-success border-success/30',
      General: 'bg-surface-muted text-foreground border-border',
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
