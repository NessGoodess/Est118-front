'use client';

import { Geist, Geist_Mono, Nunito_Sans, Montserrat, Merriweather } from "next/font/google";
import "./globals.css";
import { ScrollProvider } from "@/contexts/ScrollProvider";
import { ConfirmProviderWrapper } from "@/components/ui/confirm/ConfirmProviderWrapper";
import { AuthProvider } from "@/contexts/AuthContext";

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


const merriweather = Merriweather({
  subsets: ['latin'],
  weight: ['300', '400', '700', '900'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-Merriweather',
});

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
          ${merriweather.variable} 
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
