"use client";

export default function ModernDashboard() {
  return (
    <div className="space-y-6">
      <div className="bg-brand rounded-xl p-6 text-white shadow-card">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">¡Bienvenido de vuelta!</h2>
            <p className="text-brand-100">
              Escuela Secundaria Técnica 118
            </p>
          </div>
          <div className="hidden md:block">
            <div className="w-16 h-16 bg-surface-elevated/20 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-surface-elevated rounded-xl shadow-card border border-border grid grid-cols-1 lg:grid-cols-3 gap-6">
        <p className="text-fg-muted p-5">
          Sin configuraciones de dashboard aún
        </p>
      </div>
    </div>
  );
}
