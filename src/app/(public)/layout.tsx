import Header from "@/components/public/header/header";
import Footer from "@/components/public/footer/Footer";
import { AdmissionPublicStatusProvider } from "@/features/admissions/context/admission-public-status-context";
import { getAdmissionStatus } from "@/features/admissions/lib/get-admission-status";

export const dynamic = "force-dynamic";

export default async function PublicLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  const admissionStatus = await getAdmissionStatus();

  return (
    <AdmissionPublicStatusProvider status={admissionStatus}>
      <Header />
      <main className="bg-public-background">{children}</main>
      <Footer />
      {modal}
    </AdmissionPublicStatusProvider>
  );
}
