import { z } from "zod";

export const registerUserSchema = z
  .object({
    name: z
      .string()
      .min(3, "El nombre debe tener al menos 3 caracteres")
      .max(255, "El nombre no puede exceder 255 caracteres"),
    email: z
      .string()
      .email("Correo electrónico inválido")
      .max(255, "El correo no puede exceder 255 caracteres"),
    password: z
      .string()
      .min(8, "La contraseña debe tener al menos 8 caracteres")
      .regex(/[A-Z]/, "Debe contener al menos una mayúscula")
      .regex(/[a-z]/, "Debe contener al menos una minúscula")
      .regex(/[0-9]/, "Debe contener al menos un número"),
    password_confirmation: z.string(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Las contraseñas no coinciden",
    path: ["password_confirmation"],
  });

export type RegisterUserFormData = z.infer<typeof registerUserSchema>;

export const editUserSchema = z.object({
  name: z
    .string()
    .min(1, "El nombre es requerido")
    .max(255, "El nombre es demasiado largo"),
  email: z
    .string()
    .email("El correo electrónico no es válido")
    .max(255, "El correo es demasiado largo"),
});

export type EditUserFormData = z.infer<typeof editUserSchema>;

export const changePasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "La contraseña debe tener al menos 8 caracteres")
      .regex(/[A-Z]/, "Debe contener al menos una letra mayúscula")
      .regex(/[a-z]/, "Debe contener al menos una letra minúscula")
      .regex(/[0-9]/, "Debe contener al menos un número"),
    password_confirmation: z.string(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Las contraseñas no coinciden",
    path: ["password_confirmation"],
  });

export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
