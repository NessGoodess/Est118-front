import { useFormContext } from "react-hook-form";
import { FormData } from "@/features/admissions/validations/admissions.schema";
import { FloatingInput } from "@/components/ui/FloatingInputs";
import TabSectionTitle, { FieldIcon } from "./tab-section-title";

export default function TabAcademicInfo() {
  const {
    register,
    formState: { errors },
    watch,
  } = useFormContext<FormData>();
  const hasSiblings = watch("academicInfo.hasSiblings");

  return (
    <TabSectionTitle title="Información Académica" icon="graduationCap">
      <div className="grid gap-4 lg:grid-cols-2">
        <FloatingInput
          label="Escuela de Procedencia"
          type="text"
          {...register("academicInfo.previousSchool")}
          error={errors.academicInfo?.previousSchool?.message}
          placeholder="Nombre completo de primaria"
          icon={<FieldIcon name="school" />}
          required
        />
        <FloatingInput
          label="Promedio Actual"
          type="number"
          step="0.1"
          {...register("academicInfo.currentAverage")}
          error={errors.academicInfo?.currentAverage?.message}
          placeholder="Ej. 8.5"
          icon={<FieldIcon name="star" />}
          required
        />
      </div>
      <div className="flex flex-col gap-2">
        <label className="flex cursor-pointer items-center gap-2 text-sm text-foreground">
          <input
            type="checkbox"
            {...register("academicInfo.hasSiblings")}
            className="h-4 w-4 rounded text-primary"
          />
          ¿Tiene hermanos inscritos en la escuela?
        </label>
      </div>
      {hasSiblings ? (
        <div className="mt-4">
          <FloatingInput
            label="Detalles de Hermanos"
            type="text"
            {...register("academicInfo.siblingsDetails")}
            error={errors.academicInfo?.siblingsDetails?.message}
            placeholder="Nombres y grados de hermanos"
            icon={<FieldIcon name="users" />}
          />
        </div>
      ) : null}
    </TabSectionTitle>
  );
}
