// schemas/formSchemas.ts
import { z } from 'zod';

export const genderEnum = z.enum(["M", "F", "O"]);
export type Gender = z.infer<typeof genderEnum>;

const contactEmailSchema = z.string()
  .email("Correo electrónico inválido")
  .nonempty("Correo electrónico requerido");

// Canonical email data. Confirmation is only required by the create flow.
export const admissionEmailSchema = z.object({
  contactEmail: contactEmailSchema,
});

export const emailSchema = admissionEmailSchema.extend({
  contactEmailConfirmation: contactEmailSchema,
}).refine((data) => data.contactEmail === data.contactEmailConfirmation, {
  message: "Los correos electrónicos no coinciden",
  path: ["contactEmailConfirmation"]
});

// Applicant Info Schema
export const applicantInfoSchema = z.object({
  
  firstName: z.string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(50, "El nombre es demasiado largo")
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, "Solo se permiten letras"),
  
  lastName: z.string()
    .min(2, "El apellido paterno debe tener al menos 2 caracteres")
    .max(50, "El apellido paterno es demasiado largo")
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, "Solo se permiten letras"),
  
  secondLastName: z.string()
    .min(2, "El apellido materno debe tener al menos 2 caracteres")
    .max(50, "El apellido materno es demasiado largo")
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, "Solo se permiten letras")
    .optional()
    .or(z.literal("")),
  
  curp: z.string()
    .length(18, "La CURP debe tener 18 caracteres")
    .regex(/^[A-Z]{4}[0-9]{6}[HM][A-Z]{5}[A-Z0-9]{2}$/, "Formato de CURP inválido"),
  
  birthDate: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Formato de fecha inválido (YYYY-MM-DD)")
    .refine((date) => {
      const birthDate = new Date(date);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      return age >= 10 && age <= 18;
    }, "La edad debe estar entre 10 y 18 años"),
  
  age: z
  .number()
  .min(10, "La edad debe ser mínimo 10 años")
  .max(18, "La edad debe ser máximo 18 años"),
  
  gender: genderEnum,
  
  phone: z.string()
    .regex(/^\d{10}$/, "El teléfono debe tener 10 dígitos"),
  
  studentEmail: z.string()
    .email("Correo electrónico inválido")
    .nonempty("Correo electrónico requerido"),
  
  placeOfBirth: z.string()
    .min(2, "Lugar de nacimiento requerido")
    .max(100, "Máximo 100 caracteres")
});

// Academic Info Schema
export const academicInfoSchema = z.object({
  previousSchool: z.string()
    .min(2, "Nombre de la escuela anterior requerido")
    .max(200, "Máximo 200 caracteres"),
  
  currentAverage: z
  .string()
  .refine(val => parseFloat(val) >= 6 && parseFloat(val) <= 10, {
    message: "Seleccione un promedio válido",
  }),

  hasSiblings: z.boolean(),
  
  siblingsDetails: z.string()
    .max(500, "Máximo 500 caracteres")
    .optional()
    .or(z.literal(""))
}).refine((data) => {
  if (data.hasSiblings && (!data.siblingsDetails || data.siblingsDetails.trim().length === 0)) {
    return false;
  }
  return true;
}, {
  message: "Debe proporcionar detalles de los hermanos",
  path: ["siblingsDetails"]
});

// Address Info Schema
export const addressInfoSchema = z.object({
  streetType: z.string()
    .min(1, "Tipo de calle requerido"),
  
  streetName: z.string()
    .min(2, "Nombre de calle requerido")
    .max(100, "Máximo 100 caracteres"),
  
  houseNumber: z.string()
    .min(1, "Número exterior requerido")
    .max(10, "Máximo 10 caracteres"),
  
  unitNumber: z.string()
    .max(10, "Máximo 10 caracteres")
    .optional()
    .or(z.literal("")),
  
  neighborhoodType: z.string()
    .min(1, "Tipo de colonia requerido"),
  
  neighborhoodName: z.string()
    .min(2, "Nombre de colonia requerido")
    .max(100, "Máximo 100 caracteres"),
  
  postalCode: z.string()
    .regex(/^\d{5}$/, "El código postal debe tener 5 dígitos"),
  
  city: z.string()
    .min(2, "Ciudad requerida")
    .max(100, "Máximo 100 caracteres"),
  
  state: z.string()
    .min(2, "Estado requerido")
    .max(100, "Máximo 100 caracteres")
});

// Guardian Info Schema
export const guardianInfoSchema = z.object({
  guardianFirstName: z.string()
    .min(2, "Nombre del tutor requerido")
    .max(50, "Máximo 50 caracteres")
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, "Solo se permiten letras"),
  
  guardianLastName: z.string()
    .min(2, "Apellido paterno del tutor requerido")
    .max(50, "Máximo 50 caracteres")
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, "Solo se permiten letras"),
  
  guardianSecondLastName: z.string()
    .min(2, "Apellido materno del tutor requerido")
    .max(50, "Máximo 50 caracteres")
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, "Solo se permiten letras")
    .optional()
    .or(z.literal("")),
  
  guardianCurp: z.string()
    .length(18, "La CURP debe tener 18 caracteres")
    .regex(/^[A-Z]{4}[0-9]{6}[HM][A-Z]{5}[A-Z0-9]{2}$/, "Formato de CURP inválido")
    .optional()
    .or(z.literal("")),
  
  guardianPhone: z.string()
    .regex(/^\d{10}$/, "El teléfono debe tener 10 dígitos"),
  
  guardianRelationship: z.string()
    .min(2, "Parentesco requerido")
    .max(50, "Máximo 50 caracteres")
});

// Workshop Selection Schema
export const workshopSelectSchema = z.object({
  workshopFirstChoice: z.string()
    .min(1, "Debe seleccionar un primer taller"),
  
  workshopSecondChoice: z.string()
    .min(1, "Debe seleccionar un segundo taller")
}).refine((data) => data.workshopFirstChoice !== data.workshopSecondChoice, {
  message: "Los talleres deben ser diferentes",
  path: ["workshopSecondChoice"]
});

// Tuition Voucher Schema
export const tuitionVoucherSchema = z.object({
  hasSchoolVoucher: z.boolean(),
  
  schoolVoucherFolio: z.string()
    .max(50, "Máximo 50 caracteres")
    .optional()
    .or(z.literal(""))
}).refine((data) => {
  if (data.hasSchoolVoucher && (!data.schoolVoucherFolio || data.schoolVoucherFolio.trim().length === 0)) {
    return false;
  }
  return true;
}, {
  message: "Debe proporcionar el folio del vale",
  path: ["schoolVoucherFolio"]
});

// Canonical admission data shared by create and edit.
export const admissionFormDataSchema = z.object({
  email: admissionEmailSchema,
  applicantInfo: applicantInfoSchema,
  academicInfo: academicInfoSchema,
  addressInfo: addressInfoSchema,
  guardianInfo: guardianInfoSchema,
  workshopSelect: workshopSelectSchema,
  tuitionVoucher: tuitionVoucherSchema
});

// Create additionally asks the user to confirm the contact email.
export const formDataSchema = admissionFormDataSchema.extend({
  email: emailSchema,
});

// Tipos inferidos de los schemas
export type EmailInfo = z.infer<typeof emailSchema>;
export type ApplicantInfo = z.infer<typeof applicantInfoSchema>;
export type AcademicInfo = z.infer<typeof academicInfoSchema>;
export type AddressInfo = z.infer<typeof addressInfoSchema>;
export type GuardianInfo = z.infer<typeof guardianInfoSchema>;
export type WorkshopSelect = z.infer<typeof workshopSelectSchema>;
export type TuitionVoucher = z.infer<typeof tuitionVoucherSchema>;
export type AdmissionFormData = z.infer<typeof admissionFormDataSchema>;
export type FormData = z.infer<typeof formDataSchema>;