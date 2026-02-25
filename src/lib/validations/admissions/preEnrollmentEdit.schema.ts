import { z } from 'zod';

const curpRegex = /^[A-Z]{4}\d{6}[HM][A-Z]{5}[A-Z0-9]\d$/;

export const preEnrollmentEditSchema = z.object({
  contact_email: z.string().email('Correo inválido').max(100),
  first_name: z.string().min(1, 'Nombre es requerido').max(100),
  last_name: z.string().min(1, 'Apellido es requerido').max(100),
  second_last_name: z.string().max(100).optional().nullable(),
  curp: z.string().length(18, '18 caracteres').regex(curpRegex, 'CURP inválida'),
  birth_date: z.string().min(1, ' Requerida'),
  age: z.number().min(10).max(18),
  gender: z.enum(['M', 'F', 'O']),
  phone: z.string().min(1, 'Requerido').max(15),
  student_email: z.string().email('Correo inválido').max(100),
  place_of_birth: z.string().min(1, 'Requerido').max(100),
  previous_school: z.string().min(1, 'Requerido').max(100),
  current_average: z.string().max(10),
  has_siblings: z.boolean(),
  siblings_details: z.string().max(255).optional().nullable(),
  street_type: z.string().min(1, 'Requerido').max(100),
  street_name: z.string().min(1, 'Requerido').max(100),
  house_number: z.string().min(1, 'Requerido').max(100),
  unit_number: z.string().max(100).optional().nullable(),
  neighborhood_type: z.string().min(1, 'Requerido').max(100),
  neighborhood_name: z.string().min(1, 'Requerido').max(100),
  postal_code: z.string().length(5, '5 dígitos'),
  city: z.string().min(1, 'Requerido').max(100),
  state: z.string().min(1, 'Requerido').max(100),
  guardian_first_name: z.string().min(1, 'Requerido').max(100),
  guardian_last_name: z.string().min(1, 'Requerido').max(100),
  guardian_second_last_name: z.string().max(100).optional().nullable(),
  guardian_curp: z.string().length(18, '18 caracteres').regex(curpRegex, 'CURP inválida'),
  guardian_phone: z.string().min(1, 'Requerido').max(15),
  guardian_relationship: z.string().min(1, 'Requerido').max(100),
  workshop_first_choice: z.string().min(1, 'Requerido').max(100),
  workshop_second_choice: z.string().min(1, 'Requerido').max(100),
  has_school_voucher: z.boolean(),
  school_voucher_folio: z.string().max(100).optional().nullable(),
}).refine((data) => {
  if (data.has_siblings && (!data.siblings_details || data.siblings_details.trim().length === 0)) {
    return false;
  }
  return true;
}, { message: 'Detalles de hermanos requeridos', path: ['siblings_details'] })
.refine((data) => {
  if (data.has_school_voucher && (!data.school_voucher_folio || data.school_voucher_folio.trim().length === 0)) {
    return false;
  }
  return true;
}, { message: 'Folio del vale requerido', path: ['school_voucher_folio'] });

export type PreEnrollmentEditFormData = z.infer<typeof preEnrollmentEditSchema>;
