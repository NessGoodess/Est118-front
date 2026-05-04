// src/components/private/admission/add/tabs/AcademicInfo.tsx
import { useFormContext } from "react-hook-form";
import { FormData } from "@/lib/validations/admissions/admissions.schema";
import { FloatingInput } from "@/components/ui/FloatingInputs";

export default function TabAcademicInfo() {
    const { register, formState: { errors }, watch } = useFormContext<FormData>();
    const hasSiblings = watch("academicInfo.hasSiblings");

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-4 text-slate-700">Información Académica</h3>
            <div className="grid lg:grid-cols-2 gap-4 mb-4">
                <FloatingInput
                    label="Escuela de Procedencia"
                    type="text"
                    {...register("academicInfo.previousSchool")}
                    error={errors.academicInfo?.previousSchool?.message}
                    placeholder="Nombre completo de primaria"
                    required
                />
                <FloatingInput
                    label="Promedio Actual"
                    type="number"
                    step="0.1"
                    {...register("academicInfo.currentAverage")}
                    error={errors.academicInfo?.currentAverage?.message}
                    placeholder="Ej. 8.5"
                    required
                />
            </div>
            <div className="mb-4 flex flex-col gap-2">
                <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-700">
                    <input type="checkbox" {...register("academicInfo.hasSiblings")} className="w-4 h-4 text-blue-600 rounded" />
                    ¿Tiene hermanos inscritos en la escuela?
                </label>
            </div>
            {hasSiblings && (
                <div className="mt-4">
                    <FloatingInput
                        label="Detalles de Hermanos"
                        type="text"
                        {...register("academicInfo.siblingsDetails")}
                        error={errors.academicInfo?.siblingsDetails?.message}
                        placeholder="Nombres y grados de hermanos"
                    />
                </div>
            )}
        </div>
    );
}
