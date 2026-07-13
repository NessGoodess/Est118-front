import PromotionDecisionsPanel from '@/components/private/admission/PromotionDecisionsPanel';
import ReEnrollmentPromotionPanel from '@/components/private/school/re-enrollment/ReEnrollmentPromotionPanel';
import ReEnrollmentStepGate from '@/components/private/school/re-enrollment/ReEnrollmentStepGate';

export default function ReEnrollmentPromotionPage() {
  return (
    <ReEnrollmentStepGate step="promotion">
      <div className="space-y-6">
        <section className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-900">
          En promoción solo se procesan alumnos <strong>ya validados</strong>. Usa casillas para marcar aprobado/reprobado y luego ejecuta la promoción en bloque desde este periodo.
        </section>
        <PromotionDecisionsPanel />
        <ReEnrollmentPromotionPanel />
      </div>
    </ReEnrollmentStepGate>
  );
}
