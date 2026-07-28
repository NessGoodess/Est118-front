// src/components/private/admission/add/tabs/WorkshopSelect.tsx
import { useFormContext } from "react-hook-form";
import { FormData } from "@/lib/validations/admissions/admissions.schema";
import { FloatingSelect } from "@/components/ui/FloatingSelect";

export default function TabWorkshopSelect() {
    const { register, formState: { errors } } = useFormContext<FormData>();

    return (
        <div className="bg-surface-elevated p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-4 text-foreground">Selección de Taller</h3>
            <div className="grid lg:grid-cols-2 gap-4">
                <FloatingSelect
                    label="Primera Opción"
                    {...register("workshopSelect.workshopFirstChoice")}
                    error={errors.workshopSelect?.workshopFirstChoice?.message}
                    placeholder=""
                    required
                >
                    <option value="Confección del vestido e industria Textil">Confeccion del vestido e Industria Textil </option>
                    <option value="Maquinas, herramientas y sistemas de control">Maquinas, Herramientas y Sistemas de Control</option>
                    <option value="Diseño Industrial">Diseño Industrial</option>
                    <option value="Informática">Informática</option>
                </FloatingSelect>
                <FloatingSelect
                    label="Segunda Opción"
                    {...register("workshopSelect.workshopSecondChoice")}
                    error={errors.workshopSelect?.workshopSecondChoice?.message}
                    placeholder=""
                    required
                >
                    <option value="Confección del vestido e industria Textil">Confeccion del vestido e Industria Textil </option>
                    <option value="Maquinas, herramientas y sistemas de control">Maquinas, Herramientas y Sistemas de Control</option>
                    <option value="Diseño Industrial">Diseño Industrial</option>
                    <option value="Informática">Informática</option>
                </FloatingSelect>
            </div>
        </div>
    );
}