import ProfileSection from "./ProfileSection";

export default function StudentSubjectsSection({ subjects }: { subjects: string[] | null | undefined }) {
  return (
    <ProfileSection
      title="Materias"
      description="Materias asociadas al grupo vigente."
    >
      {subjects && subjects.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {subjects.map((s, i) => (
            <span
              key={i}
              className="inline-flex items-center rounded-full border border-border bg-surface-muted px-3 py-1 text-sm text-foreground"
            >
              {s}
            </span>
          ))}
        </div>
      ) : (
        <p className="text-sm text-fg-muted">Sin materias asociadas.</p>
      )}
    </ProfileSection>
  );
}
