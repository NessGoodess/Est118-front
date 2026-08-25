import { useFormContext } from "react-hook-form";
import { FormData } from "@/features/admissions/validations/admissions.schema";
import { FloatingInput } from "@/components/ui/FloatingInputs";
import TabSectionTitle, { FieldIcon } from "./tab-section-title";

export default function TabEmail() {
  const {
    register,
    formState: { errors },
  } = useFormContext<FormData>();

  return (
    <TabSectionTitle title="Validación de Correo Electrónico" icon="mail">
      <div className="grid gap-4 lg:grid-cols-2">
        <FloatingInput
          label="Correo Electrónico a Validar"
          type="email"
          {...register("email.contactEmail")}
          error={errors.email?.contactEmail?.message}
          placeholder="ejemplo@correo.com"
          icon={<FieldIcon name="mail" />}
          required
        />
        <FloatingInput
          label="Confirmar Correo Electrónico"
          type="email"
          {...register("email.contactEmailConfirmation")}
          error={errors.email?.contactEmailConfirmation?.message}
          placeholder="ejemplo@correo.com"
          icon={<FieldIcon name="atSign" />}
          required
        />
      </div>
    </TabSectionTitle>
  );
}
