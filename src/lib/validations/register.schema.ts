import { z } from 'zod';

export const registerUserSchema = z.object({
    name: z.string()
        .min(3, 'El nombre debe tener al menos 3 caracteres')
        .max(255, 'El nombre no puede exceder 255 caracteres'),
    email: z.string()
        .email('Correo electrónico inválido')
        .max(255, 'El correo no puede exceder 255 caracteres'),
    password: z.string()
        .min(8, 'La contraseña debe tener al menos 8 caracteres')
        .regex(/[A-Z]/, 'Debe contener al menos una mayúscula')
        .regex(/[a-z]/, 'Debe contener al menos una minúscula')
        .regex(/[0-9]/, 'Debe contener al menos un número'),
    password_confirmation: z.string()
}).refine((data) => data.password === data.password_confirmation, {
    message: 'Las contraseñas no coinciden',
    path: ['password_confirmation'],
});

export type RegisterUserFormData = z.infer<typeof registerUserSchema>;
