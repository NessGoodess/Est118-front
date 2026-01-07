import { z } from 'zod';
import z4 from 'zod/v4';

export const loginSchema = z.object({
  email: z4
    .email('Formato de correo electrónico inválido'),
  password: z
    .string()
    .min(1, 'La contraseña es requerida')
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  name: z
    .string()
    .min(1, 'El nombre es requerido')
    .min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z
    .string()
    .min(1, 'El correo electrónico es requerido')
    .email('Formato de correo electrónico inválido'),
  password: z
    .string()
    .min(1, 'La contraseña es requerida')
    .min(6, 'La contraseña debe tener al menos 6 caracteres'),
  password_confirmation: z
    .string()
    .min(1, 'La confirmación de contraseña es requerida'),
}).refine((data) => data.password === data.password_confirmation, {
  message: "Las contraseñas no coinciden",
  path: ["password_confirmation"],
});

export type RegisterFormData = z.infer<typeof registerSchema>;