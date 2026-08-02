import ProfileSection from "./ProfileSection";
import { formatPlain } from "./formatters";
import type { StudentDetailPayload } from "@/features/students/types/student-profile";

export default function StudentGuardiansSection({
  guardians,
}: {
  guardians: StudentDetailPayload["guardians"];
}) {
  return (
    <ProfileSection
      title="Tutores"
      description="Relación tutores-estudiantes."
    >
      {guardians && guardians.length > 0 ? (
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {guardians.map((g, idx) => (
            <li key={idx} className="rounded-xl border border-border bg-surface-muted/40 p-4 shadow-sm">
              <div className="font-semibold text-foreground">{formatPlain(g.name)}</div>
              <div className="mt-2 text-sm text-fg-muted space-y-1">
                <div>
                  <span className="text-fg-muted">Parentesco: </span>
                  {formatPlain(g.relationship)}
                </div>
                <div>
                  <span className="text-fg-muted">Teléfono: </span>
                  {formatPlain(g.phone)}
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-fg-muted">Sin tutores registrados o asociados.</p>
      )}
    </ProfileSection>
  );
}
