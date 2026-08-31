import type { Metadata } from "next";
import FormatsSection from "@/components/public/sections/FormatsSection";

export const metadata: Metadata = {
  title: "Formatos y Documentos",
  description:
    "Descarga formatos y documentos oficiales de la Escuela Secundaria Técnica No. 118.",
};

export default function FormatsPage() {
  return <FormatsSection />;
}
