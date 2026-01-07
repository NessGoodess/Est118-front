"use client";

interface ActivityItem {
  id: string;
  type: 'attendance' | 'late' | 'absence' | 'system';
  student: string;
  group: string;
  time: string;
  description: string;
}

const activities: ActivityItem[] = [
  {
    id: '1',
    type: 'attendance',
    student: 'Ana García López',
    group: '3°A',
    time: '08:15',
    description: 'Registró asistencia con QR',
  },
  {
    id: '2',
    type: 'late',
    student: 'Carlos Mendoza Ruiz',
    group: '3°A',
    time: '08:12',
    description: 'Llegó tarde - registrado manualmente',
  },
  {
    id: '3',
    type: 'attendance',
    student: 'María Fernández Torres',
    group: '3°B',
    time: '08:08',
    description: 'Registró asistencia con QR',
  },
  {
    id: '4',
    type: 'absence',
    student: 'José Luis Martín',
    group: '3°A',
    time: '08:30',
    description: 'Marcado como falta',
  },
  {
    id: '5',
    type: 'system',
    student: 'Sistema',
    group: 'General',
    time: '08:00',
    description: 'Inicio de clases - 3°A',
  },
];

function ActivityItem({ activity }: { activity: ActivityItem }) {
  const typeConfig = {
    attendance: {
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'text-green-600 bg-green-50',
    },
    late: {
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'text-yellow-600 bg-yellow-50',
    },
    absence: {
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      ),
      color: 'text-red-600 bg-red-50',
    },
    system: {
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      color: 'text-blue-600 bg-blue-50',
    },
  };

  const config = typeConfig[activity.type];

  return (
    <div className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
      <div className={`p-2 rounded-lg ${config.color}`}>
        {config.icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-gray-900 truncate">
            {activity.student}
          </p>
          <p className="text-xs text-gray-500">{activity.time}</p>
        </div>
        <p className="text-xs text-gray-600">{activity.group}</p>
        <p className="text-sm text-gray-700 mt-1">{activity.description}</p>
      </div>
    </div>
  );
}

export default function RecentActivity() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Actividad Reciente</h3>
          <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
            Ver todo
          </button>
        </div>
      </div>
      <div className="p-6">
        <div className="space-y-1">
          {activities.map((activity) => (
            <ActivityItem key={activity.id} activity={activity} />
          ))}
        </div>
      </div>
    </div>
  );
}










