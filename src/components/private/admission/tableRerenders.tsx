

export const tableRenderers = {
  'status-badge': (value: string) => (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
      value === 'active'
        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
        : 'bg-slate-100 text-slate-600 border-slate-200'
    }`}>
      {value === 'active' ? 'Activo' : 'Inactivo'}
    </span>
  ),
  'email-link': (value: string) => (
    <a href={`mailto:${value}`} className="text-blue-600 hover:underline text-sm">
      {value}
    </a>
  ),
};