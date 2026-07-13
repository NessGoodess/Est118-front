'use client';

import { useReEnrollment } from '@/contexts/ReEnrollmentContext';

export default function ReEnrollmentDashboardPage() {
  const { stats, activePeriod, loading } = useReEnrollment();

  if (loading) {
    return <div className="text-sm text-gray-500">Cargando tablero...</div>;
  }

  return (
    <section className="bg-white border rounded-xl p-6 space-y-4">
      <h2 className="text-lg font-semibold">Tablero del proceso</h2>
      {!activePeriod ? (
        <p className="text-sm text-gray-500">Crea y abre un periodo en Configuración para comenzar.</p>
      ) : stats ? (
        <>
          <p className="text-sm text-gray-600">
            {activePeriod.name} · Estado: <strong>{activePeriod.status}</strong> · Paso: <strong>{activePeriod.current_step}</strong>
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <StatCard label="Alumnos" value={stats.total_students} />
            <StatCard label="Validados" value={stats.validated} />
            <StatCard label="Con adeudos" value={stats.with_debts} />
            <StatCard label="Listos para promover" value={stats.ready_for_promotion} />
          </div>
          <p className="text-xs text-gray-500">
            Flujo recomendado: Configuración → Validación → Promoción → Grupos (opcional) → Finalizar.
          </p>
        </>
      ) : null}
    </section>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="border rounded-lg p-3">
      <div className="text-2xl font-bold text-blue-900">{value}</div>
      <div className="text-xs text-gray-500">{label}</div>
    </div>
  );
}
