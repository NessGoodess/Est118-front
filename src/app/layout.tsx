import type { Metadata } from "next";
import { Geist, Geist_Mono, Nunito_Sans, Montserrat } from "next/font/google";
import "./globals.css";
import { ScrollProvider } from "@/contexts/ScrollProvider";
import { AuthProvider } from "@/contexts/AuthContext";
import { ConfirmProviderWrapper } from "@/components/ui/confirm/ConfirmProviderWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const nunito = Nunito_Sans({
  subsets: ["latin"],
  weight: ["200", "400", "600", "700", "900"],
  variable: "--font-nunito-sans",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

export const metadata: Metadata = {
  title: "Escuela Secundaria Técnica No. 118 | Oaxaca",
  description:
    "La Escuela Secundaria Técnica No. 118 es una institución pública de Oaxaca que ofrece educación secundaria con formación técnica, fomentando el aprendizaje, la disciplina y el desarrollo integral de los estudiantes.",
};

export default function RootLayout({
  children,
}: Readonly<
  {
    children: React.ReactNode;
  }
>) {
  return (
    <html lang="es">
      <body
        className={`
          ${geistSans.variable} 
          ${geistMono.variable} 
          ${nunito.variable} 
          ${montserrat.variable} 
          antialiased`}
      >
        <AuthProvider>
          <ConfirmProviderWrapper>
            <ScrollProvider>
              {children}
            </ScrollProvider>
          </ConfirmProviderWrapper>
        </AuthProvider>
      </body>
    </html>
  );
}
