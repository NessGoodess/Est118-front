import { useFormContext } from "react-hook-form";
import { FormData } from "@/features/admissions/validations/admissions.schema";
import { FloatingInput } from "@/components/ui/FloatingInputs";
import TabSectionTitle, { FieldIcon } from "./tab-section-title";

export default function TabGuardianInfo() {
  const {
    register,
    formState: { errors },
  } = useFormContext<FormData>();

  return (
    <TabSectionTitle title="Información del Tutor" icon="users">
      <div className="grid gap-4 lg:grid-cols-3">
        <FloatingInput
          label="Apellido Paterno Tutor"
          type="text"
          {...register("guardianInfo.guardianLastName")}
          error={errors.guardianInfo?.guardianLastName?.message}
          placeholder="Paterno"
          icon={<FieldIcon name="user" />}
          required
        />
        <FloatingInput
          label="Apellido Materno Tutor"
          type="text"
          {...register("guardianInfo.guardianSecondLastName")}
          error={errors.guardianInfo?.guardianSecondLastName?.message}
          placeholder="Materno"
          icon={<FieldIcon name="user" />}
        />
        <FloatingInput
          label="Nombre Tutor"
          type="text"
          {...register("guardianInfo.guardianFirstName")}
          error={errors.guardianInfo?.guardianFirstName?.message}
          placeholder="Nombre(s)"
          icon={<FieldIcon name="user" />}
          required
        />
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <FloatingInput
          label="Parentesco"
          type="text"
          {...register("guardianInfo.guardianRelationship")}
          error={errors.guardianInfo?.guardianRelationship?.message}
          placeholder="Madre, Padre..."
          icon={<FieldIcon name="heart" />}
          required
        />
        <FloatingInput
          label="Teléfono Tutor"
          type="text"
          {...register("guardianInfo.guardianPhone")}
          error={errors.guardianInfo?.guardianPhone?.message}
          placeholder="A 10 dígitos"
          icon={<FieldIcon name="phone" />}
          required
        />
        <FloatingInput
          label="CURP Tutor"
          type="text"
          {...register("guardianInfo.guardianCurp")}
          error={errors.guardianInfo?.guardianCurp?.message}
          placeholder="Opcional"
          icon={<FieldIcon name="idCard" />}
        />
      </div>
    </TabSectionTitle>
  );
}
