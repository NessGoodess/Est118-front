import { formatShortWithTime } from "@/lib/utils/dateFormatter";

export const tableRenderers = {
  'pre-status': (value: unknown) => {
    const v = (value as string) || 'pending';
    const map: Record<string, { label: string; cls: string }> = {
      pending: { label: 'Preinscrito', cls: 'bg-slate-100 text-slate-700 border-slate-200' },
      in_review: { label: 'En revisión', cls: 'bg-amber-50 text-amber-800 border-amber-200' },
      approved: { label: 'Aprobado', cls: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
      rejected: { label: 'Rechazado', cls: 'bg-red-50 text-red-700 border-red-200' },
    };
    const cfg = map[v] ?? { label: v, cls: 'bg-slate-100 text-slate-600 border-slate-200' };
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${cfg.cls}`}>
        {cfg.label}
      </span>
    );
  },
  'docs-status': (value: unknown) => {
    const v = (value as string) || 'pending';
    const isOk = v === 'complete';
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
        isOk ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-700 border-slate-200'
      }`}>
        {isOk ? 'Completos' : 'Pendientes'}
      </span>
    );
  },
  'pay-status': (value: unknown) => {
    const v = (value as string) || 'pending';
    const isOk = v === 'validated';
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
        isOk ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-700 border-slate-200'
      }`}>
        {isOk ? 'Validado' : 'Pendiente'}
      </span>
    );
  },
  'enrollment-done': (value: unknown) => {
    const id = value as number | null | undefined;
    const done = typeof id === 'number' && id > 0;
    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
          done ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-slate-100 text-slate-600 border-slate-200'
        }`}
      >
        {done ? `Inscrito #${id}` : 'Sin inscribir'}
      </span>
    );
  },
  'email-link': (value: unknown) => (
    <a href={`mailto:${value}`} className="text-blue-600 hover:underline text-sm">
      {value as string}
    </a>
  ),
  'date': (value: unknown) => (
    <span className="text-sm">
      {formatShortWithTime(value as Date)}
    </span>
  ),
};