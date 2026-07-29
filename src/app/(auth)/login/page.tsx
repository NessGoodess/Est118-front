import Image from "next/image";
import { Suspense } from "react";
import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <div className="w-full max-w-5xl 2xl:max-w-6xl bg-transparent md:bg-surface-panel rounded-2xl overflow-hidden md:shadow-2xl grid grid-cols-1 md:grid-cols-2 h-auto">
      <div className="relative hidden md:block" style={{ clipPath: "polygon(0 0, 100% 0, 90% 100%, 0% 100%)", }} >
        <Image src="/login_est.jpg" alt="EST118 Logo" fill sizes="(min-width: 1024px) 50vw, 100vw" priority className="object-cover" />
        <div className="absolute inset-0 bg-brand-900/60 flex flex-col justify-center px-10" />
      </div>
      <div className="flex items-center justify-center 2xl:p-10">
        <Suspense fallback={<div className="text-fg-muted text-sm">Cargando...</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}