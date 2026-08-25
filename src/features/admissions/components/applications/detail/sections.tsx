import type { PreEnrollmentApi } from "@/features/admissions/types/pre-enrollment-api";
import { formatMedium } from "@/lib/utils/dateFormatter";
import { DetailField, DetailSection } from "./detail-section";
import {
  formatBoolean,
  formatGender,
  formatWorkshop,
  fullName,
} from "./format";

export function PersonalSection({ data }: { data: PreEnrollmentApi }) {
  return (
    <DetailSection title="Información personal" icon="user">
      <DetailField label="Fecha de nacimiento" value={formatMedium(data.birth_date)} />
      <DetailField label="Edad" value={`${data.age} años`} />
      <DetailField label="Sexo" value={formatGender(data.gender)} />
      <DetailField label="Lugar de nacimiento" value={data.place_of_birth} />
    </DetailSection>
  );
}

export function GuardianSection({ data }: { data: PreEnrollmentApi }) {
  return (
    <DetailSection title="Tutor" icon="users">
      <DetailField
        label="Nombre completo"
        value={fullName(
          data.guardian_first_name,
          data.guardian_last_name,
          data.guardian_second_last_name
        )}
        className="sm:col-span-2"
      />
      <DetailField label="CURP" value={data.guardian_curp} mono />
      <DetailField label="Teléfono" value={data.guardian_phone} />
      <DetailField label="Parentesco" value={data.guardian_relationship} />
      <DetailField label="Email de contacto" value={data.contact_email} />
    </DetailSection>
  );
}

export function AcademicSection({ data }: { data: PreEnrollmentApi }) {
  return (
    <DetailSection title="Información académica" icon="book">
      <DetailField
        label="Escuela anterior"
        value={data.previous_school}
        className="sm:col-span-2"
      />
      <DetailField
        label="Promedio actual"
        value={
          <span className="inline-flex items-baseline gap-1">
            <span className="text-base font-bold text-primary">
              {data.current_average}
            </span>
            <span className="text-xs text-fg-muted">/ 10</span>
          </span>
        }
      />
      <DetailField label="Tiene hermanos" value={formatBoolean(data.has_siblings)} />
      {data.has_siblings && data.siblings_details ? (
        <DetailField
          label="Detalles de hermanos"
          value={data.siblings_details}
          className="sm:col-span-2"
        />
      ) : null}
    </DetailSection>
  );
}

export function AddressSection({ data }: { data: PreEnrollmentApi }) {
  const street = [
    data.street_type,
    data.street_name,
    `#${data.house_number}`,
    data.unit_number ? `Unidad ${data.unit_number}` : null,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <DetailSection title="Dirección" icon="globe">
      <DetailField label="Calle" value={street} className="sm:col-span-2" />
      <DetailField
        label="Colonia"
        value={`${data.neighborhood_type} ${data.neighborhood_name}`}
      />
      <DetailField label="Código postal" value={data.postal_code} mono />
      <DetailField label="Ciudad" value={data.city} />
      <DetailField label="Estado" value={data.state} />
    </DetailSection>
  );
}

export function WorkshopsSection({ data }: { data: PreEnrollmentApi }) {
  return (
    <DetailSection title="Talleres" icon="tag" columns={1}>
      <DetailField
        label="Primera opción"
        value={formatWorkshop(data.workshop_first_choice)}
      />
      <DetailField
        label="Segunda opción"
        value={formatWorkshop(data.workshop_second_choice)}
      />
    </DetailSection>
  );
}

export function VoucherSection({ data }: { data: PreEnrollmentApi }) {
  return (
    <DetailSection title="Vales escolares" icon="clipboard">
      <DetailField
        label="Tiene vale escolar"
        value={
          <span
            className={`inline-flex rounded-md px-2 py-0.5 text-xs font-medium ${
              data.has_school_voucher
                ? "bg-success/15 text-success"
                : "bg-surface-muted text-fg-muted"
            }`}
          >
            {formatBoolean(data.has_school_voucher)}
          </span>
        }
      />
      {data.has_school_voucher && data.school_voucher_folio ? (
        <DetailField label="Folio del vale" value={data.school_voucher_folio} mono />
      ) : null}
    </DetailSection>
  );
}
