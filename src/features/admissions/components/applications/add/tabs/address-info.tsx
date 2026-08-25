import { useFormContext } from "react-hook-form";
import { FormData } from "@/features/admissions/validations/admissions.schema";
import { FloatingInput } from "@/components/ui/FloatingInputs";
import TabSectionTitle, { FieldIcon } from "./tab-section-title";

export default function TabAddressInfo() {
  const {
    register,
    formState: { errors },
  } = useFormContext<FormData>();

  return (
    <TabSectionTitle title="Domicilio" icon="mapPin">
      <div className="grid gap-4 lg:grid-cols-3">
        <FloatingInput
          label="Código Postal"
          type="text"
          {...register("addressInfo.postalCode")}
          error={errors.addressInfo?.postalCode?.message}
          placeholder="Ej. 68000"
          icon={<FieldIcon name="mail" />}
          required
        />
        <FloatingInput
          label="Estado"
          type="text"
          {...register("addressInfo.state")}
          error={errors.addressInfo?.state?.message}
          placeholder="Estado"
          icon={<FieldIcon name="globe" />}
          required
        />
        <FloatingInput
          label="Ciudad"
          type="text"
          {...register("addressInfo.city")}
          error={errors.addressInfo?.city?.message}
          placeholder="Ciudad o Municipio"
          icon={<FieldIcon name="building" />}
          required
        />
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <FloatingInput
          label="Tipo de Asentamiento"
          type="text"
          {...register("addressInfo.neighborhoodType")}
          error={errors.addressInfo?.neighborhoodType?.message}
          placeholder="Colonia, Fraccionamiento..."
          icon={<FieldIcon name="map" />}
          required
        />
        <FloatingInput
          label="Nombre de Asentamiento"
          type="text"
          {...register("addressInfo.neighborhoodName")}
          error={errors.addressInfo?.neighborhoodName?.message}
          placeholder="Nombre"
          icon={<FieldIcon name="map" />}
          required
        />
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <FloatingInput
          label="Tipo de Calle"
          type="text"
          {...register("addressInfo.streetType")}
          error={errors.addressInfo?.streetType?.message}
          placeholder="Avenida, Andador..."
          icon={<FieldIcon name="home" />}
          required
        />
        <FloatingInput
          label="Nombre de Calle"
          type="text"
          {...register("addressInfo.streetName")}
          error={errors.addressInfo?.streetName?.message}
          placeholder="Nombre"
          icon={<FieldIcon name="home" />}
          required
        />
        <div className="flex gap-2">
          <FloatingInput
            label="No. Exterior"
            type="text"
            {...register("addressInfo.houseNumber")}
            error={errors.addressInfo?.houseNumber?.message}
            placeholder="Ext."
            icon={<FieldIcon name="hash" />}
            required
          />
          <FloatingInput
            label="No. Interior"
            type="text"
            {...register("addressInfo.unitNumber")}
            error={errors.addressInfo?.unitNumber?.message}
            placeholder="Int."
            icon={<FieldIcon name="hash" />}
          />
        </div>
      </div>
    </TabSectionTitle>
  );
}
