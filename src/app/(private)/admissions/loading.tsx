export default function PreEnrollmentsLoading() {
  return (
    <div className="p-8 animate-pulse">
      <div className="h-8 w-64 bg-slate-200 rounded mb-6"></div>
      
      {/* Búsqueda skeleton */}
      <div className="max-w-md mb-4">
        <div className="h-10 bg-slate-200 rounded-lg"></div>
      </div>

      {/* Tabla skeleton */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        {/* Header */}
        <div className="bg-slate-50 border-b border-slate-200 px-4 py-3">
          <div className="flex gap-4">
            <div className="h-4 w-16 bg-slate-300 rounded"></div>
            <div className="h-4 w-32 bg-slate-300 rounded"></div>
            <div className="h-4 w-24 bg-slate-300 rounded"></div>
            <div className="h-4 w-20 bg-slate-300 rounded"></div>
            <div className="h-4 w-28 bg-slate-300 rounded"></div>
          </div>
        </div>

        {/* Filas */}
        <div className="divide-y divide-slate-200">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="px-4 py-3">
              <div className="flex gap-4">
                <div className="h-3 w-12 bg-slate-200 rounded"></div>
                <div className="h-3 w-48 bg-slate-200 rounded"></div>
                <div className="h-3 w-20 bg-slate-200 rounded"></div>
                <div className="h-3 w-16 bg-slate-200 rounded"></div>
                <div className="h-3 w-24 bg-slate-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}