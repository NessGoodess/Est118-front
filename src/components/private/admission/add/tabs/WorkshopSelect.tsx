// src/components/private/admission/add/tabs/WorkshopSelect.tsx
import { useFormContext } from "react-hook-form";
import { FormData } from "@/lib/validations/admissions/admissions.schema";
import { FloatingSelect } from "@/components/ui/FloatingSelect";

export default function TabWorkshopSelect() {
    const { register, formState: { errors } } = useFormContext<FormData>();
    
    return (
        <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-4 text-slate-700">Selección de Taller</h3>
            <div className="grid lg:grid-cols-2 gap-4">
                <FloatingSelect
                    label="Primera Opción"
                    {...register("workshopSelect.workshopFirstChoice")}
                    error={errors.workshopSelect?.workshopFirstChoice?.message}
                    placeholder="Taller"
                    required
                >
                    <option value="">Seleccione taller...</option>
                    <option value="INFORMATICA">Informática</option>
                    <option value="ELECTRICIDAD">Electricidad</option>
                    <option value="CARPINTERIA">Carpintería</option>
                    <option value="DISEÑO_MECANICO">Diseño Mecánico</option>
                </FloatingSelect>
                <FloatingSelect
                    label="Segunda Opción"
                    {...register("workshopSelect.workshopSecondChoice")}
                    error={errors.workshopSelect?.workshopSecondChoice?.message}
                    placeholder="Taller Alternativo"
                    required
                >
                    <option value="">Seleccione taller...</option>
                    <option value="INFORMATICA">Informática</option>
                    <option value="ELECTRICIDAD">Electricidad</option>
                    <option value="CARPINTERIA">Carpintería</option>
                    <option value="DISEÑO_MECANICO">Diseño Mecánico</option>
                </FloatingSelect>
            </div>
        </div>
    );
}
