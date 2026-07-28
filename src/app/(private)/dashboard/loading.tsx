export default function DashboardLoading() {
  return (
    <div className="flex items-center justify-center min-h-[60vh] p-4">
      <div className="text-center space-y-6">
        {/* Spinner animado */}
        <div className="flex justify-center">
          <div className="relative w-16 h-16">
            {/* Círculo exterior girando */}
            <div className="absolute inset-0 border-4 border-border rounded-full"></div>
            <div className="absolute inset-0 border-4 border-transparent border-t-blue-600 rounded-full animate-spin"></div>
            
            {/* Círculo interior girando en dirección opuesta */}
            <div className="absolute inset-2 border-4 border-primary/30 rounded-full"></div>
            <div className="absolute inset-2 border-4 border-transparent border-t-primary rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '0.8s' }}></div>
          </div>
        </div>

        {/* Texto de carga */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-foreground">Cargando dashboard...</h3>
          <p className="text-sm text-fg-muted">Preparando tu información</p>
        </div>

        {/* Indicador de progreso animado */}
        <div className="w-48 mx-auto h-1 bg-surface-muted rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-brand to-brand-600 rounded-full animate-pulse" style={{ width: '60%' }}></div>
        </div>
      </div>
    </div>
  );
}

