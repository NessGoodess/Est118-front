

export const tableRenderers = {
  'status-badge': (value: unknown) => (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${(value as string) === 'active'
        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
        : 'bg-slate-100 text-slate-600 border-slate-200'
      }`}>
      {(value as string) === 'active' ? 'Activo' : 'Inactivo'}
    </span>
  ),
  'email-link': (value: unknown) => (
    <a href={`mailto:${value}`} className="text-blue-600 hover:underline text-sm">
      {value as string}
    </a>
  ),
};