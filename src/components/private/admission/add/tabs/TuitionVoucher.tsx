// src/components/private/admission/add/tabs/TuitionVoucher.tsx
import { useFormContext } from "react-hook-form";
import { FormData } from "@/lib/validations/admissions/admissions.schema";
import { FloatingInput } from "@/components/ui/FloatingInputs";

export default function TabTuitionVoucher() {
    const { register, formState: { errors }, watch } = useFormContext<FormData>();
    const hasVoucher = watch("tuitionVoucher.hasSchoolVoucher");

    return (
        <div className="bg-surface-elevated p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-4 text-foreground">Vales Escolares</h3>
            <div className="flex flex-col gap-2 mb-4">
                <label className="flex items-center gap-2 cursor-pointer text-sm text-foreground">
                    <input type="checkbox" {...register("tuitionVoucher.hasSchoolVoucher")} className="w-4 h-4 text-primary rounded" />
                    ¿Cuenta con vale escolar?
                </label>
            </div>
            {hasVoucher && (
                <FloatingInput
                    label="Folio del Vale"
                    type="text"
                    {...register("tuitionVoucher.schoolVoucherFolio")}
                    error={errors.tuitionVoucher?.schoolVoucherFolio?.message}
                    placeholder="Escriba el folio..."
                />
            )}
        </div>
    );
}
