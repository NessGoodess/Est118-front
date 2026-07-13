'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useReEnrollment } from '@/contexts/ReEnrollmentContext';
import ReEnrollmentStatusBanner from '@/components/private/school/re-enrollment/ReEnrollmentStatusBanner';
import { ReEnrollmentProcessStep } from '@/lib/types/school/re-enrollment';

const STEPS: Array<{
  key: ReEnrollmentProcessStep;
  label: string;
  href: string;
  description: string;
}> = [
  {
    key: 'configuration',
    label: 'Configuración',
    href: '/re-enrollment/settings',
    description: 'Abrir periodo y fechas',
  },
  {
    key: 'validation',
    label: 'Validación',
    href: '/re-enrollment/validation',
    description: 'Revisar alumnos elegibles',
  },
  {
    key: 'promotion',
    label: 'Promoción',
    href: '/re-enrollment/promotion',
    description: 'Promover de grado en bloque',
  },
  {
    key: 'groups',
    label: 'Asignación de grupos',
    href: '/re-enrollment/groups',
    description: 'Conservar o cambiar grupo',
  },
  {
    key: 'completed',
    label: 'Finalizadas',
    href: '/re-enrollment/completed',
    description: 'Consulta histórica',
  },
];

const STEP_ORDER: ReEnrollmentProcessStep[] = [
  'configuration',
  'validation',
  'promotion',
  'groups',
  'completed',
];

function stepIndex(step: ReEnrollmentProcessStep): number {
  return STEP_ORDER.indexOf(step);
}

function isStepLocked(
  stepKey: ReEnrollmentProcessStep,
  currentIdx: number,
  status: string | undefined
): boolean {
  const idx = stepIndex(stepKey);

  if (!status || status === 'finalized') return false;

  if (status === 'draft') {
    return stepKey !== 'configuration' && stepKey !== 'completed';
  }

  if (status === 'closed') {
    return !['configuration', 'completed'].includes(stepKey);
  }

  return idx > currentIdx + 1;
}

export default function ReEnrollmentWizard() {
  const pathname = usePathname();
  const { activePeriod, stats } = useReEnrollment();

  const currentStep = activePeriod?.current_step ?? 'configuration';
  const currentIdx = stepIndex(currentStep);
  const skipGroups = activePeriod?.keep_current_groups === true;

  const visibleSteps = STEPS.filter((s) => !(skipGroups && s.key === 'groups'));

  return (
    <div className="space-y-4">
      <ReEnrollmentStatusBanner />
      <div className="bg-white border rounded-xl p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              {activePeriod?.name ?? 'Reinscripciones'}
            </h1>
            <p className="text-sm text-gray-500">
              Proceso guiado para control escolar. No promuevas alumno por alumno: valida, promueve y cierra.
            </p>
          </div>
          {stats && (
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-900">{stats.progress_percent}%</div>
              <div className="text-xs text-gray-500">listos para promover</div>
            </div>
          )}
        </div>

        {stats && (
          <div className="mt-4">
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-900 transition-all"
                style={{ width: `${stats.progress_percent}%` }}
              />
            </div>
            <div className="mt-2 grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs text-gray-600">
              <span>{stats.total_students} alumnos</span>
              <span>{stats.validated} validados</span>
              <span>{stats.with_debts} con adeudos</span>
              <span>{stats.pending} pendientes</span>
              <span>{stats.rejected} bajas/rechazos</span>
            </div>
          </div>
        )}
      </div>

      <nav className="flex flex-wrap gap-2">
        <Link
          href="/re-enrollment"
          className={`px-3 py-2 rounded-lg text-sm border ${
            pathname === '/re-enrollment'
              ? 'bg-blue-900 text-white border-blue-900'
              : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
          }`}
        >
          Tablero
        </Link>
        {visibleSteps.map((step) => {
          const idx = stepIndex(step.key);
          const isActive = pathname.startsWith(step.href);
          const isDone = idx < currentIdx;
          const isLocked = isStepLocked(step.key, currentIdx, activePeriod?.status);

          return (
            <Link
              key={step.key}
              href={isLocked ? '#' : step.href}
              onClick={(e) => isLocked && e.preventDefault()}
              className={`px-3 py-2 rounded-lg text-sm border transition-colors ${
                isActive
                  ? 'bg-blue-900 text-white border-blue-900'
                  : isDone
                    ? 'bg-green-50 text-green-800 border-green-200'
                    : isLocked
                      ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                      : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
              }`}
              title={step.description}
            >
              {isDone ? '✓ ' : ''}
              {step.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
