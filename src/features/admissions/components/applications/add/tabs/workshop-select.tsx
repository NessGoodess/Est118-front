import { useFormContext } from "react-hook-form";
import { FormData } from "@/features/admissions/validations/admissions.schema";
import { ADMISSION_WORKSHOP_OPTIONS } from "@/features/admissions/types/workshops";
import { FloatingSelect } from "@/components/ui/FloatingSelect";
import TabSectionTitle, { FieldIcon } from "./tab-section-title";

export default function TabWorkshopSelect() {
  const {
    register,
    formState: { errors },
  } = useFormContext<FormData>();

  return (
    <TabSectionTitle title="Selección de Taller" icon="palette">
      <div className="grid gap-4 lg:grid-cols-2">
        <FloatingSelect
          label="Primera Opción"
          {...register("workshopSelect.workshopFirstChoice")}
          error={errors.workshopSelect?.workshopFirstChoice?.message}
          placeholder=""
          icon={<FieldIcon name="star" />}
          required
        >
          {ADMISSION_WORKSHOP_OPTIONS.map((workshop) => (
            <option key={workshop} value={workshop}>
              {workshop}
            </option>
          ))}
        </FloatingSelect>
        <FloatingSelect
          label="Segunda Opción"
          {...register("workshopSelect.workshopSecondChoice")}
          error={errors.workshopSelect?.workshopSecondChoice?.message}
          placeholder=""
          icon={<FieldIcon name="starHalf" />}
          required
        >
          {ADMISSION_WORKSHOP_OPTIONS.map((workshop) => (
            <option key={workshop} value={workshop}>
              {workshop}
            </option>
          ))}
        </FloatingSelect>
      </div>
    </TabSectionTitle>
  );
}
