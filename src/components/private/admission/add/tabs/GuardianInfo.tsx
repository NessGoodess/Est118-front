// src/components/private/admission/add/tabs/GuardianInfo.tsx
import { useFormContext } from "react-hook-form";
import { FormData } from "@/lib/validations/admissions/admissions.schema";
import { FloatingInput } from "@/components/ui/FloatingInputs";

export default function TabGuardianInfo() {
    const { register, formState: { errors } } = useFormContext<FormData>();
    
    return (
        <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-4 text-slate-700">Información del Tutor</h3>
            <div className="grid lg:grid-cols-3 gap-4 mb-4">
                <FloatingInput
                    label="Apellido Paterno Tutor"
                    type="text"
                    {...register("guardianInfo.guardianLastName")}
                    error={errors.guardianInfo?.guardianLastName?.message}
                    placeholder="Paterno"
                    required
                />
                <FloatingInput
                    label="Apellido Materno Tutor"
                    type="text"
                    {...register("guardianInfo.guardianSecondLastName")}
                    error={errors.guardianInfo?.guardianSecondLastName?.message}
                    placeholder="Materno"
                />
                <FloatingInput
                    label="Nombre Tutor"
                    type="text"
                    {...register("guardianInfo.guardianFirstName")}
                    error={errors.guardianInfo?.guardianFirstName?.message}
                    placeholder="Nombre(s)"
                    required
                />
            </div>
            <div className="grid lg:grid-cols-3 gap-4">
                <FloatingInput
                    label="Parentesco"
                    type="text"
                    {...register("guardianInfo.guardianRelationship")}
                    error={errors.guardianInfo?.guardianRelationship?.message}
                    placeholder="Madre, Padre..."
                    required
                />
                <FloatingInput
                    label="Teléfono Tutor"
                    type="text"
                    {...register("guardianInfo.guardianPhone")}
                    error={errors.guardianInfo?.guardianPhone?.message}
                    placeholder="A 10 dígitos"
                    required
                />
                <FloatingInput
                    label="CURP Tutor"
                    type="text"
                    {...register("guardianInfo.guardianCurp")}
                    error={errors.guardianInfo?.guardianCurp?.message}
                    placeholder="Opcional"
                />
            </div>
        </div>
    );
}
