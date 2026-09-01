import { Geist, Geist_Mono, Nunito_Sans, Montserrat, Merriweather } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { ScrollProvider } from "@/contexts/ScrollProvider";
import { ConfirmProviderWrapper } from "@/components/ui/confirm/ConfirmProviderWrapper";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { SWRProvider } from "@/lib/swr";
import { themeInitScript } from "@/lib/theme";
import { Metadata } from "next";

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

export const metadata: Metadata = {
  title: {
    default: "EST 118 | Escuela Secundaria Técnica No. 118",
    template: "%s | EST 118",
  },
  description:
    "Escuela Secundaria Técnica No. 118. Formación académica y técnica para el futuro de nuestros estudiantes.",
};


export default function RootLayout({
  children,
}: Readonly<
  {
    children: React.ReactNode;
  }
>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`
          ${geistSans.variable} 
          ${geistMono.variable} 
          ${nunito.variable} 
          ${montserrat.variable} 
          ${merriweather.variable} 
          antialiased`}
      >
        <Script id="est118-theme" strategy="beforeInteractive">
          {themeInitScript}
        </Script>
        <SWRProvider>
          <ThemeProvider>
            <ConfirmProviderWrapper>
              <ScrollProvider>
                {children}
              </ScrollProvider>
            </ConfirmProviderWrapper>
          </ThemeProvider>
        </SWRProvider>
      </body>
    </html>
  );
}
