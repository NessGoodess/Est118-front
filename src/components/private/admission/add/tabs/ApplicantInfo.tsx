// src/components/private/admission/add/tabs/ApplicantInfo.tsx

import { useFormContext } from "react-hook-form";
import { FormData } from "@/lib/validations/admissions/admissions.schema";
import { FloatingInput } from "@/components/ui/FloatingInputs";
import { FloatingSelect } from "@/components/ui/FloatingSelect";

export default function TabApplicantInfo() {
    const { register, formState: { errors } } = useFormContext<FormData>();
    
    return (
        <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-4 text-slate-700">Datos del Aspirante</h3>
            <div className="grid lg:grid-cols-3 gap-4 mb-4">
                <FloatingInput
                    label="Apellido Paterno"
                    type="text"
                    {...register("applicantInfo.lastName")}
                    error={errors.applicantInfo?.lastName?.message}
                    placeholder="Paterno"
                    required
                />
                <FloatingInput
                    label="Apellido Materno"
                    type="text"
                    {...register("applicantInfo.secondLastName")}
                    error={errors.applicantInfo?.secondLastName?.message}
                    placeholder="Materno"
                />
                <FloatingInput
                    label="Nombre Completo"
                    type="text"
                    {...register("applicantInfo.firstName")}
                    error={errors.applicantInfo?.firstName?.message}
                    placeholder="Nombre(s)"
                    required
                />
            </div>
            <div className="grid lg:grid-cols-3 gap-4 mb-4">
                <FloatingInput
                    label="CURP"
                    type="text"
                    {...register("applicantInfo.curp")}
                    error={errors.applicantInfo?.curp?.message}
                    placeholder="CURP (18 caracteres)"
                    required
                />
                <FloatingInput
                    label="Fecha de Nacimiento"
                    type="date"
                    {...register("applicantInfo.birthDate")}
                    error={errors.applicantInfo?.birthDate?.message}
                    placeholder="AAAA-MM-DD"
                    required
                />
                <FloatingInput
                    label="Edad"
                    type="number"
                    {...register("applicantInfo.age", { valueAsNumber: true })}
                    error={errors.applicantInfo?.age?.message}
                    placeholder="Edad"
                    required
                />
            </div>
            <div className="grid lg:grid-cols-2 gap-4">
                <FloatingInput
                    label="Correo Electrónico Estudiante"
                    type="email"
                    {...register("applicantInfo.studentEmail")}
                    error={errors.applicantInfo?.studentEmail?.message}
                    placeholder="Correo de contacto"
                    required
                />
                <FloatingInput
                    label="Teléfono"
                    type="text"
                    {...register("applicantInfo.phone")}
                    error={errors.applicantInfo?.phone?.message}
                    placeholder="Teléfono a 10 dígitos"
                    required
                />
                <FloatingInput
                    label="Lugar de Nacimiento"
                    type="text"
                    {...register("applicantInfo.placeOfBirth")}
                    error={errors.applicantInfo?.placeOfBirth?.message}
                    placeholder="Estado o Ciudad"
                    required
                />
                <FloatingSelect
                    label="Género"
                    {...register("applicantInfo.gender")}
                    error={errors.applicantInfo?.gender?.message}
                    placeholder="Género"
                    required
                >
                    <option value="">Seleccione una opción...</option>
                    <option value="M">Masculino</option>
                    <option value="F">Femenino</option>
                    <option value="O">Otro</option>
                </FloatingSelect>
            </div>
        </div>
    );
}