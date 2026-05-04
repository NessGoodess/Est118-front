// src/components/private/admission/add/tabs/AddressInfo.tsx
import { useFormContext } from "react-hook-form";
import { FormData } from "@/lib/validations/admissions/admissions.schema";
import { FloatingInput } from "@/components/ui/FloatingInputs";

export default function TabAddressInfo() {
    const { register, formState: { errors } } = useFormContext<FormData>();
    
    return (
        <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-4 text-slate-700">Domicilio</h3>
            <div className="grid lg:grid-cols-3 gap-4 mb-4">
                <FloatingInput
                    label="Código Postal"
                    type="text"
                    {...register("addressInfo.postalCode")}
                    error={errors.addressInfo?.postalCode?.message}
                    placeholder="Ej. 68000"
                    required
                />
                <FloatingInput
                    label="Estado"
                    type="text"
                    {...register("addressInfo.state")}
                    error={errors.addressInfo?.state?.message}
                    placeholder="Estado"
                    required
                />
                <FloatingInput
                    label="Ciudad"
                    type="text"
                    {...register("addressInfo.city")}
                    error={errors.addressInfo?.city?.message}
                    placeholder="Ciudad o Municipio"
                    required
                />
            </div>
            <div className="grid lg:grid-cols-2 gap-4 mb-4">
                <FloatingInput
                    label="Tipo de Asentamiento"
                    type="text"
                    {...register("addressInfo.neighborhoodType")}
                    error={errors.addressInfo?.neighborhoodType?.message}
                    placeholder="Colonia, Fraccionamiento..."
                    required
                />
                <FloatingInput
                    label="Nombre de Asentamiento"
                    type="text"
                    {...register("addressInfo.neighborhoodName")}
                    error={errors.addressInfo?.neighborhoodName?.message}
                    placeholder="Nombre"
                    required
                />
            </div>
            <div className="grid lg:grid-cols-3 gap-4">
                <FloatingInput
                    label="Tipo de Calle"
                    type="text"
                    {...register("addressInfo.streetType")}
                    error={errors.addressInfo?.streetType?.message}
                    placeholder="Avenida, Andador..."
                    required
                />
                <FloatingInput
                    label="Nombre de Calle"
                    type="text"
                    {...register("addressInfo.streetName")}
                    error={errors.addressInfo?.streetName?.message}
                    placeholder="Nombre"
                    required
                />
                <div className="flex gap-2">
                    <FloatingInput
                        label="No. Exterior"
                        type="text"
                        {...register("addressInfo.houseNumber")}
                        error={errors.addressInfo?.houseNumber?.message}
                        placeholder="Ext."
                        required
                    />
                    <FloatingInput
                        label="No. Interior"
                        type="text"
                        {...register("addressInfo.unitNumber")}
                        error={errors.addressInfo?.unitNumber?.message}
                        placeholder="Int."
                    />
                </div>
            </div>
        </div>
    );
}
