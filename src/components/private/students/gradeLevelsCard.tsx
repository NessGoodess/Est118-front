import { Grade } from "@/lib/types/students";

export default function GradeLevelsCard({
    grade_name,
    total_students,
    total_groups,
    is_active,
    isSelected }: Grade & { isSelected: boolean }) {
    return (
        <>
            <div className={`bg-surface-elevated rounded-lg shadow-md text-foreground p-4 hover:bg-surface-muted border-2 
                ${isSelected ? "border-primary" : "border-transparent"}`}>
                <div className="flex bg-primary text-primary-foreground p-2 rounded-lg">
                    <p className="font-bold text-lg">{grade_name} <span>grado</span></p>
                </div>
                <div className="flex justify-between gap-2 py-2 md:py-3 overflow-x-auto">
                    <div className="bg-surface-muted rounded-lg p-2 text-foreground">
                        <p>{total_students} <span>Alumnos</span></p>
                    </div>
                    <div className="bg-surface-muted rounded-lg p-2 text-foreground">
                        <p>{total_groups} grupos</p>

                    </div>
                </div>
                <div className={is_active ? "bg-success h-1" : "bg-danger h-1"}></div>
            </div>
        </>
    );
}
