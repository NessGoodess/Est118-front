import { useFormContext } from "react-hook-form";
import { FormData } from "@/features/admissions/validations/admissions.schema";
import { FloatingInput } from "@/components/ui/FloatingInputs";
import TabSectionTitle, { FieldIcon } from "./tab-section-title";

export default function TabTuitionVoucher() {
  const {
    register,
    formState: { errors },
    watch,
  } = useFormContext<FormData>();
  const hasVoucher = watch("tuitionVoucher.hasSchoolVoucher");

  return (
    <TabSectionTitle title="Vales Escolares" icon="ticket">
      <div className="mb-4 flex flex-col gap-2">
        <label className="flex cursor-pointer items-center gap-2 text-sm text-foreground">
          <input
            type="checkbox"
            {...register("tuitionVoucher.hasSchoolVoucher")}
            className="h-4 w-4 rounded text-primary"
          />
          ¿Cuenta con vale escolar?
        </label>
      </div>
      {hasVoucher ? (
        <FloatingInput
          label="Folio del Vale"
          type="text"
          {...register("tuitionVoucher.schoolVoucherFolio")}
          error={errors.tuitionVoucher?.schoolVoucherFolio?.message}
          placeholder="Escriba el folio..."
          icon={<FieldIcon name="hash" />}
        />
      ) : null}
    </TabSectionTitle>
  );
}
