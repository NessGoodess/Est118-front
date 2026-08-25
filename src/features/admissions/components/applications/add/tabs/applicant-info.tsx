import { useFormContext } from "react-hook-form";
import { FormData } from "@/features/admissions/validations/admissions.schema";
import { FloatingInput } from "@/components/ui/FloatingInputs";
import { FloatingSelect } from "@/components/ui/FloatingSelect";
import TabSectionTitle, { FieldIcon } from "./tab-section-title";

export default function TabApplicantInfo() {
  const {
    register,
    formState: { errors },
  } = useFormContext<FormData>();

  return (
    <TabSectionTitle title="Datos del Aspirante" icon="user">
      <div className="grid gap-4 lg:grid-cols-3">
        <FloatingInput
          label="Apellido Paterno"
          type="text"
          {...register("applicantInfo.lastName")}
          error={errors.applicantInfo?.lastName?.message}
          placeholder="Paterno"
          icon={<FieldIcon name="user" />}
          required
        />
        <FloatingInput
          label="Apellido Materno"
          type="text"
          {...register("applicantInfo.secondLastName")}
          error={errors.applicantInfo?.secondLastName?.message}
          placeholder="Materno"
          icon={<FieldIcon name="user" />}
        />
        <FloatingInput
          label="Nombre Completo"
          type="text"
          {...register("applicantInfo.firstName")}
          error={errors.applicantInfo?.firstName?.message}
          placeholder="Nombre(s)"
          icon={<FieldIcon name="user" />}
          required
        />
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <FloatingInput
          label="CURP"
          type="text"
          {...register("applicantInfo.curp")}
          error={errors.applicantInfo?.curp?.message}
          placeholder="CURP (18 caracteres)"
          icon={<FieldIcon name="idCard" />}
          required
        />
        <FloatingInput
          label="Fecha de Nacimiento"
          type="date"
          {...register("applicantInfo.birthDate")}
          error={errors.applicantInfo?.birthDate?.message}
          placeholder="AAAA-MM-DD"
          icon={<FieldIcon name="calendar" />}
          required
        />
        <FloatingInput
          label="Edad"
          type="number"
          {...register("applicantInfo.age", { valueAsNumber: true })}
          error={errors.applicantInfo?.age?.message}
          placeholder="Edad"
          icon={<FieldIcon name="calendarDays" />}
          required
        />
      </div>
      <div className="grid gap-3 lg:grid-cols-2">
        <FloatingInput
          label="Correo Electrónico Estudiante"
          type="email"
          {...register("applicantInfo.studentEmail")}
          error={errors.applicantInfo?.studentEmail?.message}
          placeholder="Correo de contacto"
          icon={<FieldIcon name="mail" />}
          required
        />
        <FloatingInput
          label="Teléfono"
          type="text"
          {...register("applicantInfo.phone")}
          error={errors.applicantInfo?.phone?.message}
          placeholder="Teléfono a 10 dígitos"
          icon={<FieldIcon name="phone" />}
          required
        />
        <FloatingInput
          label="Lugar de Nacimiento"
          type="text"
          {...register("applicantInfo.placeOfBirth")}
          error={errors.applicantInfo?.placeOfBirth?.message}
          placeholder="Estado o Ciudad"
          icon={<FieldIcon name="mapPin" />}
          required
        />
        <FloatingSelect
          label="Género"
          {...register("applicantInfo.gender")}
          error={errors.applicantInfo?.gender?.message}
          placeholder="Género"
          icon={<FieldIcon name="venusMars" />}
          required
        >
          <option value="">Seleccione una opción...</option>
          <option value="M">Masculino</option>
          <option value="F">Femenino</option>
          <option value="O">Otro</option>
        </FloatingSelect>
      </div>
    </TabSectionTitle>
  );
}
