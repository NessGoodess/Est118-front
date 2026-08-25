"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import type { PrivatePreEnrollmentSuccessResult } from "@/features/admissions/hooks/use-private-pre-enrollment-form";

type PrivatePreEnrollmentSuccessPanelProps = {
  result: PrivatePreEnrollmentSuccessResult;
  previewUrl: string | null;
  pdfError: string | null;
  isPreviewLoading: boolean;
  onPreview: () => void;
  onDismiss: () => void;
};

export default function PrivatePreEnrollmentSuccessPanel({
  result,
  previewUrl,
  pdfError,
  isPreviewLoading,
  onPreview,
  onDismiss,
}: PrivatePreEnrollmentSuccessPanelProps) {
  return (
    <div className="mt-8 bg-surface-elevated border-2 border-primary rounded-xl p-6 md:p-8 relative">
      <button
        type="button"
        onClick={onDismiss}
        className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center bg-surface-elevated rounded-full text-fg-muted hover:text-foreground shadow-sm"
      >
        ✕
      </button>
      <h3 className="text-2xl font-bold text-foreground mb-2 font-merriweather text-center">
        ¡Preinscripción Completada!
      </h3>
      <p className="text-center text-sm text-fg-muted mb-6">{result.message}</p>

      <div className="bg-surface-elevated rounded-lg p-4 mb-6 text-center mx-auto max-w-sm shadow-sm border border-border">
        <p className="text-sm text-fg-muted mb-1">Folio de Preinscripción</p>
        <p className="text-3xl font-bold text-primary font-mono tracking-wider">
          {result.folio}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button
          variant="secondary"
          loading={isPreviewLoading}
          loadingText="Cargando PDF..."
          onClick={onPreview}
        >
          Previsualizar Comprobante
        </Button>
        <Link
          href={result.downloadUrl}
          target="_blank"
          rel="noreferrer"
          className="px-6 py-2 bg-primary text-primary-foreground text-sm rounded-lg hover:bg-primary-hover font-medium transition-colors text-center shadow-sm cursor-pointer active:bg-brand-950"
        >
          Descargar PDF Comprobante
        </Link>
      </div>

      {pdfError && (
        <p className="text-center text-danger font-medium mt-4 bg-danger/10 p-2 rounded">
          {pdfError}
        </p>
      )}

      {previewUrl && !pdfError && (
        <div className="mt-6 bg-surface-elevated p-2 rounded-lg shadow-sm border border-border h-[600px] md:h-[800px]">
          <object
            data={previewUrl}
            type="application/pdf"
            className="w-full h-full rounded"
          >
            <div className="flex flex-col items-center justify-center p-8 text-center bg-surface-muted h-full">
              <p className="mb-2 text-fg-muted font-medium">
                Tu navegador no puede previsualizar PDFs incrustados.
              </p>
              <a
                href={result.downloadUrl}
                target="_blank"
                rel="noreferrer"
                className="text-primary hover:text-primary-hover underline font-medium"
              >
                Descargar el archivo PDF aquí
              </a>
            </div>
          </object>
        </div>
      )}
    </div>
  );
}
