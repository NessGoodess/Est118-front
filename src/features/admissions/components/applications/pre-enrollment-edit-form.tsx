"use client";

import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { PreEnrollmentApi } from "@/features/admissions/types/pre-enrollment-api";
import { formDataSchema, type FormData, } from "@/features/admissions/validations/admissions.schema";
import { admissionFormDataToApiPayload, apiToFormData, } from "@/features/admissions/types/api-to-form-data";
import { updatePreEnrollment } from "@/features/admissions/services/admissions.service";
import { IconByName } from "@/components/ui/icons";
import { globalToast } from "@/lib/toast";
import { Button } from "@/components/ui/Button";
import { TabAcademicInfo, TabAddressInfo, TabApplicantInfo, TabEmail, TabGuardianInfo, TabTuitionVoucher, TabWorkshopSelect, } from "./add/tabs";

interface PreEnrollmentEditFormProps {
  data: PreEnrollmentApi;
  onSuccess?: (updated: PreEnrollmentApi) => void;
  onCancel?: () => void;
}

export default function PreEnrollmentEditForm({
  data,
  onSuccess,
  onCancel,
}: PreEnrollmentEditFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const methods = useForm<FormData>({
    resolver: zodResolver(formDataSchema),
    defaultValues: apiToFormData(data),
  });

  const { handleSubmit, watch, setValue } = methods;
  const hasSiblings = watch("academicInfo.hasSiblings");
  const hasSchoolVoucher = watch("tuitionVoucher.hasSchoolVoucher");

  useEffect(() => {
    if (!hasSiblings) {
      setValue("academicInfo.siblingsDetails", "");
    }
  }, [hasSiblings, setValue]);

  useEffect(() => {
    if (!hasSchoolVoucher) {
      setValue("tuitionVoucher.schoolVoucherFolio", "");
    }
  }, [hasSchoolVoucher, setValue]);

  const onSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    try {
      const updated = await updatePreEnrollment(
        data.id,
        admissionFormDataToApiPayload(formData)
      );
      globalToast.success("Pre-inscripción actualizada correctamente");
      onSuccess?.(updated);
    } catch {
      globalToast.error("Error al actualizar la pre-inscripción");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-foreground" noValidate>
        <TabEmail />
        <TabApplicantInfo />
        <TabAcademicInfo />
        <TabAddressInfo />
        <TabGuardianInfo />

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          <TabWorkshopSelect />
          <TabTuitionVoucher />
        </div>

        <div className="sticky bottom-0 z-10 flex justify-end gap-3 rounded-lg border-t border-border bg-surface-app/20 p-4 backdrop-blur">
          {onCancel ? (
            <Button
              variant="ghost"
              onClick={onCancel}
              disabled={isSubmitting}
              leftIcon={<IconByName name="x" />}
            >
              Cancelar
            </Button>
          ) : null}
          <div className="w-48">
            <Button
              variant="primary"
              disabled={isSubmitting}
              leftIcon={<IconByName name="check" />}
            >
              Guardar cambios
            </Button>
          </div>
        </div>
      </form>
    </FormProvider>
  );
}
