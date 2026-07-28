"use client";

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { PreEnrollmentApi } from '@/lib/types/admission/preEnrollmentApi';
import { preEnrollmentEditSchema, PreEnrollmentEditFormData } from '@/lib/validations/admissions/preEnrollmentEdit.schema';
import { updatePreEnrollment } from '@/lib/services/admissions.service';
import { FloatingInput, FloatingTextarea } from '@/components/ui/FloatingInputs';
import { SubmitButton } from '@/components/ui/SubmitButton';
import { IconByName, GlobalIcons } from '@/components/ui/icons/global.icons';
import { globalToast } from '@/lib/toast';
import { FloatingSelect } from '@/components/ui/FloatingSelect';

const TALLERES = [
  'Confección del vestido e industria Textil',
  'Máquinas, herramientas y sistemas de control',
  'Diseño Industrial',
  'Informática',
];

function preEnrollmentToFormData(data: PreEnrollmentApi): PreEnrollmentEditFormData {
  return {
    contact_email: data.contact_email,
    first_name: data.first_name,
    last_name: data.last_name,
    second_last_name: data.second_last_name ?? '',
    curp: data.curp,
    birth_date: data.birth_date,
    age: data.age,
    gender: data.gender,
    phone: data.phone,
    student_email: data.student_email,
    place_of_birth: data.place_of_birth,
    previous_school: data.previous_school,
    current_average: data.current_average,
    has_siblings: data.has_siblings,
    siblings_details: data.siblings_details ?? '',
    street_type: data.street_type,
    street_name: data.street_name,
    house_number: data.house_number,
    unit_number: data.unit_number ?? '',
    neighborhood_type: data.neighborhood_type,
    neighborhood_name: data.neighborhood_name,
    postal_code: data.postal_code,
    city: data.city,
    state: data.state,
    guardian_first_name: data.guardian_first_name,
    guardian_last_name: data.guardian_last_name,
    guardian_second_last_name: data.guardian_second_last_name ?? '',
    guardian_curp: data.guardian_curp,
    guardian_phone: data.guardian_phone,
    guardian_relationship: data.guardian_relationship,
    workshop_first_choice: data.workshop_first_choice,
    workshop_second_choice: data.workshop_second_choice,
    has_school_voucher: data.has_school_voucher,
    school_voucher_folio: data.school_voucher_folio ?? '',
  };
}

interface PreEnrollmentEditFormProps {
  data: PreEnrollmentApi;
  onSuccess?: (updated: PreEnrollmentApi) => void;
  onCancel?: () => void;
}

const FormSection = ({ title, iconName, children }: { title: string; iconName?: keyof typeof GlobalIcons; children: React.ReactNode }) => (
  <div className="space-y-6  bg-surface-elevated rounded-xl shadow-xl p-5 lg:p-10">
    <div className="flex items-center gap-2 pb-2 border-b border-border">
      {iconName && (
        <div className="p-1.5 bg-surface-muted rounded-lg">
          <IconByName name={iconName} className="w-4 h-4 text-fg-muted" />
        </div>
      )}
      <h3 className="text-sm font-semibold text-fg-muted">{title}</h3>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
      {children}
    </div>
  </div>
);

export default function PreEnrollmentEditForm({ data, onSuccess, onCancel }: PreEnrollmentEditFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm<PreEnrollmentEditFormData>({
    resolver: zodResolver(preEnrollmentEditSchema),
    defaultValues: preEnrollmentToFormData(data),
  });

  const hasSiblings = watch('has_siblings');
  const hasSchoolVoucher = watch('has_school_voucher');

  useEffect(() => {
    setValue('siblings_details', hasSiblings ? (watch('siblings_details') ?? '') : '');
  }, [hasSiblings, setValue, watch]);

  const onSubmit = async (formData: PreEnrollmentEditFormData) => {
    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        second_last_name: formData.second_last_name || undefined,
        unit_number: formData.unit_number || undefined,
        guardian_second_last_name: formData.guardian_second_last_name || undefined,
        siblings_details: formData.has_siblings ? (formData.siblings_details || undefined) : undefined,
        school_voucher_folio: formData.has_school_voucher ? (formData.school_voucher_folio || undefined) : undefined,
      };
      const updated = await updatePreEnrollment(data.id, payload);
      globalToast.success('Pre-inscripción actualizada correctamente');
      onSuccess?.(updated);
    } catch {
      globalToast.error('Error al actualizar la pre-inscripción');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 text-black">
      <FormSection title="Datos personales" iconName="user">
        <FloatingInput label="Nombre" {...register('first_name')} error={errors.first_name?.message} icon={<GlobalIcons.user />} />
        <FloatingInput label="Apellido paterno" {...register('last_name')} error={errors.last_name?.message} />
        <FloatingInput label="Apellido materno" {...register('second_last_name')} error={errors.second_last_name?.message} />
        <FloatingInput label="CURP" {...register('curp')} error={errors.curp?.message} className="" />
        <FloatingInput label="Email estudiante" type="email" {...register('student_email')} error={errors.student_email?.message} icon={<GlobalIcons.atSign />} />
        <FloatingInput label="Fecha de nacimiento" type="date" {...register('birth_date')} error={errors.birth_date?.message} icon={<GlobalIcons.calendar />} />
        <FloatingSelect label="Género" {...register('gender', { required: 'Selecciona un Genero' })} error={errors.gender?.message} required icon={<IconByName name="user" />} >
          <option disabled>Selecciona...</option>
          <option value="M">Masculino</option>
          <option value="F">Femenino</option>
          <option value="O">Otro</option>
        </FloatingSelect>
        <FloatingInput label="Edad" type="number" {...register('age', { valueAsNumber: true })} error={errors.age?.message} />
        <FloatingInput label="Lugar de nacimiento" {...register('place_of_birth')} error={errors.place_of_birth?.message} icon={<GlobalIcons.mapPin />} />
        <FloatingInput label="Teléfono" {...register('phone')} error={errors.phone?.message} icon={<GlobalIcons.phone />} />
        <FloatingInput label="Email contacto" type="email" {...register('contact_email')} error={errors.contact_email?.message} icon={<GlobalIcons.mail />} className='md:col-span-2' />
      </FormSection>

      <FormSection title="Información académica" iconName="graduationCap">
        <FloatingInput label="Escuela anterior" {...register('previous_school')} error={errors.previous_school?.message} className="sm:col-span-2" icon={<GlobalIcons.school />} />
        <FloatingInput label="Promedio" {...register('current_average')} error={errors.current_average?.message} icon={<GlobalIcons.star />} />
        <div className="flex items-center gap-2">
          <input type="checkbox" id="has_siblings" {...register('has_siblings')} className="w-4 h-4 rounded border-border text-primary" />
          <label htmlFor="has_siblings" className="text-sm text-foreground">Tiene hermanos</label>
        </div>
        {hasSiblings && (
          <FloatingTextarea label="Detalles de hermanos" {...register('siblings_details')} error={errors.siblings_details?.message} className='md:col-span-2' />
        )}
      </FormSection>

      <FormSection title="Dirección" iconName="mapPin">
        <FloatingInput label="Tipo calle" {...register('street_type')} error={errors.street_type?.message} />
        <FloatingInput label="Nombre calle" {...register('street_name')} error={errors.street_name?.message} />
        <FloatingInput label="Número exterior" {...register('house_number')} error={errors.house_number?.message} />
        <FloatingInput label="Número interior" {...register('unit_number')} error={errors.unit_number?.message} />
        <FloatingInput label="Tipo colonia" {...register('neighborhood_type')} error={errors.neighborhood_type?.message} />
        <FloatingInput label="Nombre colonia" {...register('neighborhood_name')} error={errors.neighborhood_name?.message} />
        <FloatingInput label="Código postal" {...register('postal_code')} error={errors.postal_code?.message} />
        <FloatingInput label="Ciudad" {...register('city')} error={errors.city?.message} icon={<GlobalIcons.building />} />
        <FloatingInput label="Estado" {...register('state')} error={errors.state?.message} />
      </FormSection>

      <FormSection title="Tutor" iconName="users">
        <FloatingInput label="Nombre" {...register('guardian_first_name')} error={errors.guardian_first_name?.message} />
        <FloatingInput label="Apellido paterno" {...register('guardian_last_name')} error={errors.guardian_last_name?.message} />
        <FloatingInput label="Apellido materno" {...register('guardian_second_last_name')} error={errors.guardian_second_last_name?.message} />
        <FloatingInput label="CURP tutor" {...register('guardian_curp')} error={errors.guardian_curp?.message} />
        <FloatingInput label="Teléfono" {...register('guardian_phone')} error={errors.guardian_phone?.message} icon={<GlobalIcons.phone />} />
        <FloatingInput label="Parentesco" {...register('guardian_relationship')} error={errors.guardian_relationship?.message} />
      </FormSection>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-3">

        <FormSection title="Talleres" iconName="palette">
          <FloatingSelect label="Primera opción" {...register('workshop_first_choice')} error={errors.workshop_first_choice?.message} icon={<IconByName name="palette" />} className="md:col-span-3">
            <option disabled>Selecciona...</option>
            {TALLERES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </FloatingSelect>
          <FloatingSelect label="Segunda opción" {...register('workshop_second_choice')} error={errors.workshop_second_choice?.message} icon={<IconByName name="palette" />} className="md:col-span-3">
            <option disabled>Selecciona...</option>
            {TALLERES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </FloatingSelect>
        </FormSection>

        <FormSection title="Vales escolares" iconName="ticket">
          <div className="flex items-center gap-2 md:col-span-2 p-5">
            <input type="checkbox" id="has_school_voucher" {...register('has_school_voucher')} className="w-4 h-4 rounded border-border text-primary" />
            <label htmlFor="has_school_voucher" className="text-sm text-foreground">Tiene vale escolar</label>
          </div>
          {hasSchoolVoucher && (
            <>
              <FloatingInput label="Folio del vale" {...register('school_voucher_folio')} error={errors.school_voucher_folio?.message} className="md:col-span-3" />
            </>
          )}
        </FormSection>
      </div>

      <div className="flex gap-3 justify-end pt-4 border-t border-border">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="px-4 py-2.5 text-sm font-medium text-foreground bg-surface-muted hover:bg-surface-muted rounded-lg transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
        )}
        <div className="w-48">
          <SubmitButton pending={isSubmitting} loadingText="Guardando...">
            Guardar cambios
          </SubmitButton>
        </div>
      </div>
    </form>
  );
}
