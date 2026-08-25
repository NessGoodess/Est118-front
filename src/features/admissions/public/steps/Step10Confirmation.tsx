"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { useAdmissionsForm } from "../context/AdmissionsFormContext";
import Link from "next/link";
import axios from "axios";
import { IconByName } from "@/components/ui/icons";

export default function Confirmation() {
  const { formData } = useAdmissionsForm();
  const [showModal, setShowModal] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [pdfError, setPdfError] = useState<string | null>(null);

  const [folio] = useState(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('admissions_folio') || 'N/A';
    }
    return 'N/A';
  });

  const [pdf] = useState(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('pdf_link') || 'N/A';
    }
    return 'N/A';
  });

  const handleOpenPdf = async () => {
    try {
      const res = await axios.get(pdf, {
        responseType: 'blob',
      });

      const blob = new Blob([res.data], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);

      setPdfUrl(url);
      setPdfError(null);
      setShowModal(true);
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.status === 403) {
        setPdfError('El comprobante ha expirado o no es válido');
        setShowModal(true);
      } else {
        setPdfError('Ocurrió un error al cargar el comprobante.');
        setShowModal(true);
      }
    }
  };

  const handleCloseModal = () => {
    if (pdfUrl) {
      URL.revokeObjectURL(pdfUrl);
    }
    setPdfUrl(null);
    setShowModal(false);
  };

  return (
    <>
      <div className="md:bg-surface-elevated md:rounded-2xl md:shadow-xl p-6 md:p-12">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} className="text-center">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring", stiffness: 200 }} className="inline-flex items-center justify-center w-24 h-24 bg-success/10 rounded-full mb-6">
            <IconByName name="check" className="w-12 h-12 text-success" />
          </motion.div>

          <h2 className="text-4xl font-bold text-foreground mb-4 font-merriweather">
            ¡Solicitud de preinscripción enviada!
          </h2>
          <p className="mx-auto mb-6 max-w-2xl text-sm text-fg-muted">
            El registro aún no equivale a una inscripción. La escuela verificará
            la información y continuará el proceso cuando la solicitud sea aceptada.
          </p>

          {/* Folio */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-primary-soft border-2 border-primary rounded-xl p-6 mb-6 max-w-md mx-auto">
            <p className="text-sm text-fg-muted mb-2">Folio de solicitud</p>
            <p className="text-3xl font-bold text-primary font-mono">{folio}</p>
          </motion.div>

          {/*  Next steps*/}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="bg-warning/10 border-l-4 border-warning p-6 rounded-lg mb-6 text-left max-w-2xl mx-auto">
            <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
              <IconByName name="info" className="w-5 h-5 text-warning" />
              Próximos Pasos:
            </h3>
            <ol className="list-decimal list-inside space-y-2 text-sm text-foreground">
              <li>Se ha enviado un correo electrónico a <strong>{formData.email.contactEmail}</strong> con su folio de solicitud y las instrucciones completas.</li>
              <li>Asista al área de <strong>Contraloría</strong> en las instalaciones de la escuela con el folio impreso o en su dispositivo móvil.</li>
              <li><strong>Horario de atención:</strong> 7:15 a 9:30 y de 10:00 a 13:30 horas, de lunes a viernes.</li>
              <li>Presente el folio para validar la información y cubra la cuota indicada para continuar el proceso.</li>
            </ol>
          </motion.div>

          {/* Privacy note */}
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className="text-xs text-fg-muted max-w-2xl mx-auto mb-6">
            La información proporcionada es protegida por la Ley Federal de Transparencia y Acceso a la Información Pública Gubernamental, y solamente será utilizada para los fines requeridos por la institución.
          </motion.p>

          {/* Action button */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2 }} className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleOpenPdf} className="px-6 py-3 bg-surface-muted hover:bg-surface-muted text-foreground rounded-full font-semibold transition-all">
              Ver Comprobante
            </motion.button>
            <Link href="/">
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="px-6 py-3 bg-primary hover:bg-primary-hover text-primary-foreground rounded-full font-semibold transition-all">
                Volver al Inicio
              </motion.button>
            </Link>

          </motion.div>
          {showModal && (
            <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center">
              <div className="bg-surface-elevated w-[90%] h-[90%] rounded-xl overflow-hidden relative">
                <button onClick={handleCloseModal} className="absolute top-3 right-3 z-10 bg-surface-elevated px-3 py-1 rounded">✕</button>
                {pdfError ? (
                  <div className="flex items-center justify-center h-full text-center p-6">
                    <p className="text-danger font-semibold">{pdfError}</p>
                  </div>
                ) : (
                  <object data={pdfUrl || undefined} type="application/pdf" className="w-full h-full">
                    <p>
                      Tu navegador no puede mostrar PDFs.
                      <a href={pdfUrl ?? '#'} target="_blank">Abrir PDF</a>
                    </p>
                  </object>
                )}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </>
  );
}
