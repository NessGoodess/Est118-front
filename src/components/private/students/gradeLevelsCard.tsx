import { Grade } from "@/lib/types/students";

export default function GradeLevelsCard({
    grade_name,
    total_students,
    total_groups,
    is_active,
    isSelected }: Grade & { isSelected: boolean }) {
    return (
        <>
            <div className={`bg-white rounded-lg shadow-md text-black p-4 hover:bg-slate-50 border-2 
                ${isSelected ? "border-blue-900" : "border-transparent"}`}>
                <div className="flex bg-blue-900 text-white p-2 rounded-lg">
                    <p className="font-bold text-lg">{grade_name} <span>grado</span></p>
                </div>
                <div className="flex justify-between gap-2 py-2 md:py-3 overflow-x-auto">
                    <div className="bg-slate-100 rounded-lg p-2">
                        <p>{total_students} <span>Alumnos</span></p>
                    </div>
                    <div className="bg-slate-100 rounded-lg p-2">
                        <p>{total_groups} grupos</p>

                    </div>
                </div>
                <div className={is_active ? "bg-green-500 h-1" : "bg-red-500 h-1"}></div>
            </div>
        </>
    );
}