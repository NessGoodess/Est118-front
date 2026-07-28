import { formatShortWithTime } from "@/lib/utils/dateFormatter";

export const tableRenderers = {
  'pre-status': (value: unknown) => {
    const v = (value as string) || 'pending';
    const map: Record<string, { label: string; cls: string }> = {
      pending: { label: 'Preinscrito', cls: 'bg-surface-muted text-foreground border-border' },
      in_review: { label: 'En revisión', cls: 'bg-warning/10 text-warning-foreground border-warning/30' },
      approved: { label: 'Aprobado', cls: 'bg-success/10 text-success border-success/30' },
      rejected: { label: 'Rechazado', cls: 'bg-danger/10 text-danger border-danger/30' },
    };
    const cfg = map[v] ?? { label: v, cls: 'bg-surface-muted text-fg-muted border-border' };
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
        isOk ? 'bg-success/10 text-success border-success/30' : 'bg-surface-muted text-foreground border-border'
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
        isOk ? 'bg-success/10 text-success border-success/30' : 'bg-surface-muted text-foreground border-border'
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
          done ? 'bg-success/10 text-success border-success/30' : 'bg-surface-muted text-fg-muted border-border'
        }`}
      >
        {done ? `Inscrito #${id}` : 'Sin inscribir'}
      </span>
    );
  },
  'email-link': (value: unknown) => (
    <a href={`mailto:${value}`} className="text-primary hover:underline text-sm">
      {value as string}
    </a>
  ),
  'date': (value: unknown) => (
    <span className="text-sm">
      {formatShortWithTime(value as Date)}
    </span>
  ),
};