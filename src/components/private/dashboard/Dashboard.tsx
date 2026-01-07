"use client";

import DashboardStats from './DashboardStats';
import RecentActivity from './RecentActivity';

export default function ModernDashboard() {
  return (
    <div className="space-y-6 p-4">
      {/* Welcome section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">¡Bienvenido de vuelta!</h2>
            <p className="text-blue-100">
              Aquí tienes un resumen de la actividad escolar de hoy
            </p>
          </div>
          <div className="hidden md:block">
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Stats cards */}
      <DashboardStats />

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <RecentActivity />
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Acciones Rápidas</h3>
          </div>
          <div className="p-6 space-y-4">
            <button className="w-full flex items-center p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors group">
              <div className="p-2 bg-blue-600 rounded-lg group-hover:bg-blue-700 transition-colors">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <div className="ml-4 text-left">
                <p className="font-medium text-gray-900">Registrar Asistencia</p>
                <p className="text-sm text-gray-600">Escáner QR o manual</p>
              </div>
            </button>

            <button className="w-full flex items-center p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors group">
              <div className="p-2 bg-green-600 rounded-lg group-hover:bg-green-700 transition-colors">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div className="ml-4 text-left">
                <p className="font-medium text-gray-900">Generar Reporte</p>
                <p className="text-sm text-gray-600">Asistencia por grupo</p>
              </div>
            </button>

            <button className="w-full flex items-center p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors group">
              <div className="p-2 bg-purple-600 rounded-lg group-hover:bg-purple-700 transition-colors">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <div className="ml-4 text-left">
                <p className="font-medium text-gray-900">Gestionar Estudiantes</p>
                <p className="text-sm text-gray-600">Agregar o editar</p>
              </div>
            </button>

            <button className="w-full flex items-center p-4 bg-yellow-50 hover:bg-yellow-100 rounded-lg transition-colors group">
              <div className="p-2 bg-yellow-600 rounded-lg group-hover:bg-yellow-700 transition-colors">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div className="ml-4 text-left">
                <p className="font-medium text-gray-900">Configuración</p>
                <p className="text-sm text-gray-600">Ajustes del sistema</p>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Today's Schedule */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Horarios de Hoy</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { time: '08:00 - 08:50', group: '3°A', subject: 'Matemáticas', status: 'active' },
              { time: '09:00 - 09:50', group: '3°B', subject: 'Español', status: 'upcoming' },
              { time: '10:00 - 10:50', group: '2°A', subject: 'Ciencias', status: 'upcoming' },
              { time: '11:00 - 11:50', group: '2°B', subject: 'Historia', status: 'upcoming' },
              { time: '12:00 - 12:50', group: '1°A', subject: 'Geografía', status: 'upcoming' },
              { time: '13:00 - 13:50', group: '1°B', subject: 'Inglés', status: 'upcoming' },
            ].map((schedule, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border-2 transition-all ${
                  schedule.status === 'active'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-900">{schedule.time}</span>
                  {schedule.status === 'active' && (
                    <span className="px-2 py-1 bg-blue-600 text-white text-xs rounded-full">
                      En curso
                    </span>
                  )}
                </div>
                <p className="font-semibold text-gray-900">{schedule.group}</p>
                <p className="text-sm text-gray-600">{schedule.subject}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}



