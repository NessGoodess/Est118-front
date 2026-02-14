import Image from "next/image";
import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-dvh flex items-center justify-center bg-transparent px-2 md:px-6">
      <div className="w-full max-w-6xl bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl overflow-hidden shadow-2xl grid grid-cols-1 md:grid-cols-2 h-auto">
        <div className="relative hidden md:block" style={{ clipPath: "polygon(0 0, 100% 0, 90% 100%, 0% 100%)", }} >
          <Image src="/login_est.jpg" alt="Secundaria Técnica Número 118" fill sizes="(min-width: 1024px) 50vw, 100vw" priority className="object-cover" />
          <div className="absolute inset-0 bg-blue-900/60 flex flex-col justify-center px-10 text-white" />
        </div>
        <div className="flex items-center justify-center p-2 md:p-12">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}