import { formatShortWithTime, formatDate } from "@/lib/utils/dateFormatter";
import { AnnouncementRawItem } from "@/lib/services/announcements.service";

export const tableRenderers = {
  'type-badge': (value: unknown, _row: unknown) => {
    const type = value as string;
    const colors: Record<string, string> = {
      Informativo: 'bg-blue-50 text-blue-700 border-blue-200',
      Urgente: 'bg-red-50 text-red-700 border-red-200',
      Recordatorio: 'bg-amber-50 text-amber-700 border-amber-200',
      Tarea: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      General: 'bg-slate-50 text-slate-700 border-slate-200',
    };
    
    const colorClass = colors[type] || colors['General'];
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${colorClass}`}>
        {type}
      </span>
    );
  },
  
  'important-badge': (value: unknown, _row: unknown) => {
    const isImportant = value as boolean;
    if (!isImportant) return null;
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-red-100 text-red-700">
        Importante
      </span>
    );
  },
  
  'date': (value: unknown, _row: unknown) => {
    if (!value) return <span className="text-slate-400 text-sm">-</span>;
    return (
      <span className="text-sm">
        {formatDate(value as string)}
      </span>
    );
  },
  
  'datetime': (value: unknown, _row: unknown) => {
    if (!value) return <span className="text-slate-400 text-sm">-</span>;
    return (
      <span className="text-sm cursor-help" title={new Date(value as string).toLocaleString()}>
        {formatShortWithTime(new Date(value as string))}
      </span>
    );
  },
};
