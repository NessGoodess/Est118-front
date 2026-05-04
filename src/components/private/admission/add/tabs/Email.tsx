// src/components/private/admission/add/tabs/Email.tsx

import { useFormContext } from "react-hook-form";
import { FormData } from "@/lib/validations/admissions/admissions.schema";
import { FloatingInput } from "@/components/ui/FloatingInputs";

export default function TabEmail() {
    const { register, formState: { errors } } = useFormContext<FormData>();
    
    return (
        <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-4 text-slate-700">Validación de Correo Electrónico</h3>
            <div className="grid lg:grid-cols-2 gap-4">
                <FloatingInput
                    label="Correo Electrónico a Validar"
                    type="email"
                    {...register("email.contactEmail")}
                    error={errors.email?.contactEmail?.message}
                    placeholder="ejemplo@correo.com"
                    required
                />
                <FloatingInput
                    label="Confirmar Correo Electrónico"
                    type="email"
                    {...register("email.contactEmailConfirmation")}
                    error={errors.email?.contactEmailConfirmation?.message}
                    placeholder="ejemplo@correo.com"
                    required
                />
            </div>
        </div>
    );
}