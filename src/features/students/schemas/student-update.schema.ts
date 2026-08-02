import { z } from "zod";
import { normalizeCURP, validateCURP } from "@/lib/utils/curpValidator";

/** Empty string → null for optional API fields */
function emptyToNull(value: string): string | null {
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

export const studentProfileSchema = z.object({
  first_name: z.string().trim().min(1, "El nombre es obligatorio").max(100),
  last_name: z.string().trim().min(1, "El apellido es obligatorio").max(100),
  national_id: z
    .string()
    .trim()
    .min(1, "La CURP es obligatoria")
    .refine((v) => validateCURP(v), "Formato de CURP inválido"),
  birth_date: z.string().max(32),
  gender: z.string().refine((v) => v === "M" || v === "F" || v === "O", {
    message: "Selecciona el sexo",
  }),
  phone_number: z.string().max(30),
  phone_second_number: z.string().max(30),
  email: z
    .string()
    .max(255)
    .refine((v) => v.trim() === "" || z.string().email().safeParse(v.trim()).success, {
      message: "El correo electrónico no es válido",
    }),
});

export const studentAddressSchema = z.object({
  street_type: z.string().max(50),
  street_name: z.string().max(150),
  house_number: z.string().max(30),
  apartament_number: z.string().max(30),
  neighborhood_type: z.string().max(50),
  neighborhood_name: z.string().max(150),
  postal_code: z.string().max(10),
  city: z.string().max(100),
  state: z.string().max(100),
});

export type StudentProfileFormValues = {
  first_name: string;
  last_name: string;
  national_id: string;
  birth_date: string;
  gender: string;
  phone_number: string;
  phone_second_number: string;
  email: string;
};
export type StudentAddressFormValues = z.infer<typeof studentAddressSchema>;

export type StudentProfileUpdatePayload = {
  first_name: string;
  last_name: string;
  national_id: string;
  birth_date: string | null;
  gender: "M" | "F" | "O";
  phone_number: string | null;
  phone_second_number: string | null;
  email: string | null;
};

export type StudentAddressUpdatePayload = {
  [K in keyof StudentAddressFormValues]: string | null;
};

export type UpdateStudentPayload = {
  profile?: StudentProfileUpdatePayload;
  address?: StudentAddressUpdatePayload;
};

export function toProfilePayload(data: StudentProfileFormValues): StudentProfileUpdatePayload {
  return {
    first_name: data.first_name.trim(),
    last_name: data.last_name.trim(),
    national_id: normalizeCURP(data.national_id),
    birth_date: emptyToNull(data.birth_date),
    gender: data.gender as "M" | "F" | "O",
    phone_number: emptyToNull(data.phone_number),
    phone_second_number: emptyToNull(data.phone_second_number),
    email: emptyToNull(data.email),
  };
}

export function toAddressPayload(data: StudentAddressFormValues): StudentAddressUpdatePayload {
  return {
    street_type: emptyToNull(data.street_type),
    street_name: emptyToNull(data.street_name),
    house_number: emptyToNull(data.house_number),
    apartament_number: emptyToNull(data.apartament_number),
    neighborhood_type: emptyToNull(data.neighborhood_type),
    neighborhood_name: emptyToNull(data.neighborhood_name),
    postal_code: emptyToNull(data.postal_code),
    city: emptyToNull(data.city),
    state: emptyToNull(data.state),
  };
}

export const ADDRESS_FIELD_LABELS: Array<{
  key: keyof StudentAddressFormValues;
  label: string;
}> = [
  { key: "street_type", label: "Tipo de vialidad" },
  { key: "street_name", label: "Nombre de calle" },
  { key: "house_number", label: "Número exterior" },
  { key: "apartament_number", label: "Número interior / unidad" },
  { key: "neighborhood_type", label: "Tipo de colonia" },
  { key: "neighborhood_name", label: "Colonia" },
  { key: "postal_code", label: "Código postal" },
  { key: "city", label: "Ciudad" },
  { key: "state", label: "Estado" },
];
