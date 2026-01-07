"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginFormData } from "./auth.schema";

export default function LoginForm() {
    const { register, handleSubmit, formState: { errors, isSubmitting }, } = useForm<LoginFormData>({ resolver: zodResolver(loginSchema), });

    const onSubmit = async (data: LoginFormData) => {
        console.log(data);
        // aquí llamas a tu API
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="w-full max-w-md space-y-5"
        >
            {/* EMAIL */}
            <div>
                <label className="block text-sm font-medium mb-1">
                    Correo electrónico
                </label>
                <input
                    type="text"
                    inputMode="email"
                    {...register("email")}
                    className="w-full rounded-lg border px-4 py-2 focus:ring-2 focus:ring-blue-500"
                />
                {errors.email && (
                    <p className="text-sm text-red-600 mt-1">
                        {errors.email.message}
                    </p>
                )}
            </div>

            {/* PASSWORD */}
            <div>
                <label className="block text-sm font-medium mb-1">
                    Contraseña
                </label>
                <input
                    type="password"
                    {...register("password")}
                    className="w-full rounded-lg border px-4 py-2 focus:ring-2 focus:ring-blue-500"
                />
                {errors.password && (
                    <p className="text-sm text-red-600 mt-1">
                        {errors.password.message}
                    </p>
                )}
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
                Iniciar sesión
            </button>
        </form>
    );
}
