"use client"

import React from 'react';
import { PreEnrollmentApi } from '@/lib/types/admission/preEnrollmentApi';
import { formatLong, formatMedium } from '@/lib/utils/dateFormatter';
import { IconByName, GlobalIcons } from '@/components/ui/icons/global.icons';
import PreEnrollmentProcessPanel from '@/components/private/admission/pre-enrollment-process-panel';

interface PreEnrollmentDetailProps {
  data: PreEnrollmentApi;
  onEdit?: () => void;
  showEditButton?: boolean;
  showResentPdfButton?: boolean;
  onResentPdf?: () => void;
  /** Si se provee, se muestra el panel de proceso (etapa/documentos/pago + inscribir). */
  onProcessSaved?: (updated: PreEnrollmentApi) => void;
}

export default function PreEnrollmentDetail({ data, onEdit, showEditButton, showResentPdfButton, onResentPdf, onProcessSaved }: PreEnrollmentDetailProps) {
  const formatGender = (gender: string) => gender === 'M' ? 'Masculino' : 'Femenino';
  const formatBoolean = (value: boolean) => value ? 'Sí' : 'No';

  const StatusBadge = ({ status }: { status: string }) => {
    const config = {
      pending: {
        label: 'Pendiente',
        className: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        icon: <GlobalIcons.clock className="w-4 h-4" />
      },
      in_review: {
        label: 'En revisión',
        className: 'bg-blue-100 text-blue-800 border-blue-200',
        icon: <GlobalIcons.clock className="w-4 h-4" />
      },
      approved: {
        label: 'Aprobado',
        className: 'bg-green-100 text-green-800 border-green-200',
        icon: <GlobalIcons.checkCircle className="w-4 h-4" />
      },
      rejected: {
        label: 'Rechazado',
        className: 'bg-red-100 text-red-800 border-red-200',
        icon: <GlobalIcons.xCircle className="w-4 h-4" />
      }

    };

    const { label, className, icon } = config[status as keyof typeof config] || config.pending;

    return (
      <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border ${className}`}>
        {icon}
        <span className="text-sm font-medium">{label}</span>
      </div>
    );
  };

  const InfoSection = ({
    title,
    children,
    iconName
  }: {
    title: string;
    children: React.ReactNode;
    iconName?: keyof typeof GlobalIcons;
  }) => (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        {iconName && (
          <div className="p-1.5 bg-gray-100 rounded-lg">
            <IconByName name={iconName} className="w-5 h-5 text-gray-600" />
          </div>
        )}
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );

  const InfoCard = ({
    label,
    value,
    iconName,
    highlight = false
  }: {
    label: string;
    value: string | React.ReactNode;
    iconName?: keyof typeof GlobalIcons;
    highlight?: boolean;
  }) => (
    <div className={`p-4 rounded-lg ${highlight ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'}`}>
      <div className="flex items-start gap-3">
        {iconName && (
          <div className="p-2 bg-white rounded-lg border border-gray-200">
            <IconByName name={iconName} className="w-4 h-4 text-gray-600" />
          </div>
        )}
        <div className="flex-1">
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-1">
            {label}
          </span>
          <span className="text-sm text-gray-900 font-medium block">
            {value}
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="mx-auto space-y-6 max-h-[85dvh] overflow-y-auto">
      {/* Header */}
      <div className="bg-gradient-to-br from-slate-50 to-white rounded-xl border border-slate-200 shadow-sm p-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                Folio {data.folio}
              </span>
              {data.status && (
                <StatusBadge status={data.status} />
              )}
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-2 break-words">
              {data.first_name} {data.last_name} {data.second_last_name}
            </h1>
            <p className="text-sm text-slate-500 mt-1">Registrado el {formatLong(data.created_at)}</p>
          </div>
          {showResentPdfButton && onResentPdf && (
            <button
              type="button"
              onClick={onResentPdf}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors shrink-0"
            >

              Reenviar PDF
            </button>
          )}
          {showEditButton && onEdit && (
            <button
              type="button"
              onClick={onEdit}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors shrink-0"
            >
              <GlobalIcons.edit className="w-4 h-4" />
              Editar
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-200">
          <div className="space-y-1">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">CURP</span>
            <p className="text-sm font-mono text-slate-900 break-all">{data.curp}</p>
          </div>
          <div className="space-y-1">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Teléfono</span>
            <p className="text-sm text-slate-900">{data.phone}</p>
          </div>
          <div className="space-y-1">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Email</span>
            <p className="text-sm text-slate-900 truncate" title={data.student_email}>{data.student_email}</p>
          </div>
        </div>
      </div>

      {onProcessSaved && (
        <PreEnrollmentProcessPanel data={data} onSaved={onProcessSaved} />
      )}

      {/* Grid principal */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Columna izquierda */}
        <div className="space-y-6">
          {/* Información Personal */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <InfoSection title="Información Personal" iconName="user">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InfoCard
                  label="Fecha de Nacimiento"
                  value={formatMedium(data.birth_date)}
                  iconName="calendar"
                />
                <InfoCard
                  label="Edad"
                  value={`${data.age} años`}
                  iconName="calendarDays"
                />
                <InfoCard
                  label="Sexo"
                  value={formatGender(data.gender)}
                  iconName="venusMars"
                />
                <InfoCard
                  label="Lugar de Nacimiento"
                  value={data.place_of_birth}
                  iconName="mapPin"
                />
              </div>
            </InfoSection>
          </div>

          {/* Información del Tutor */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <InfoSection title="Información del Tutor" iconName="users">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InfoCard
                  label="Nombre Completo"
                  value={`${data.guardian_first_name} ${data.guardian_last_name} ${data.guardian_second_last_name}`}
                  iconName="user"
                />
                <InfoCard
                  label="CURP"
                  value={data.guardian_curp}
                  iconName="idCard"
                />
                <InfoCard
                  label="Teléfono"
                  value={data.guardian_phone}
                  iconName="phone"
                />
                <InfoCard
                  label="Parentesco"
                  value={data.guardian_relationship}
                  iconName="heart"
                />
                <InfoCard
                  label="Email de Contacto"
                  value={data.contact_email}
                  iconName="mail"
                />
              </div>
            </InfoSection>
          </div>

          {/* Talleres */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <InfoSection title="Talleres" iconName="palette">
              <div className="space-y-4">
                <InfoCard
                  label="Primera Opción"
                  value={data.workshop_first_choice.replace(/_/g, ' ')}
                  iconName="star"
                />
                <InfoCard
                  label="Segunda Opción"
                  value={data.workshop_second_choice.replace(/_/g, ' ')}
                  iconName="starHalf"
                />
              </div>
            </InfoSection>
          </div>
        </div>

        {/* Columna derecha */}
        <div className="space-y-6">
          {/* Información Académica */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <InfoSection title="Información Académica" iconName="graduationCap">
              <div className="space-y-4">
                <InfoCard
                  label="Escuela Anterior"
                  value={data.previous_school}
                  iconName="school"
                />
                <InfoCard
                  label="Promedio Actual"
                  value={
                    <div className="flex items-baseline gap-1">
                      <span className="text-lg font-bold text-blue-600">{data.current_average}</span>
                      <span className="text-sm text-gray-500">/ 10</span>
                    </div>
                  }
                  iconName="star"
                  highlight
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InfoCard
                    label="Tiene Hermanos"
                    value={formatBoolean(data.has_siblings)}
                    iconName="users"
                  />
                  {data.has_siblings && data.siblings_details && (
                    <div className="sm:col-span-2">
                      <InfoCard
                        label="Detalles de Hermanos"
                        value={data.siblings_details}
                        iconName="info"
                      />
                    </div>
                  )}
                </div>
              </div>
            </InfoSection>
          </div>

          {/* Dirección */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <InfoSection title="Dirección" iconName="mapPin">
              <div className="space-y-4">
                <InfoCard
                  label="Calle"
                  value={`${data.street_type} ${data.street_name} #${data.house_number}${data.unit_number ? `, Unidad ${data.unit_number}` : ''}`}
                  iconName="home"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InfoCard
                    label="Colonia"
                    value={`${data.neighborhood_type} ${data.neighborhood_name}`}
                    iconName="map"
                  />
                  <InfoCard
                    label="Código Postal"
                    value={data.postal_code}
                    iconName="mail"
                  />
                  <InfoCard
                    label="Ciudad"
                    value={data.city}
                    iconName="building"
                  />
                  <InfoCard
                    label="Estado"
                    value={data.state}
                    iconName="globe"
                  />
                </div>
              </div>
            </InfoSection>

          </div>
          {/* Vales Escolares */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <InfoSection title="Vales Escolares" iconName="ticket">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InfoCard
                  label="Tiene Vale Escolar"
                  value={
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${data.has_school_voucher
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                      }`}>
                      {formatBoolean(data.has_school_voucher)}
                    </span>
                  }
                  iconName="checkCircle"
                />
                {data.has_school_voucher && data.school_voucher_folio && (
                  <InfoCard
                    label="Folio del Vale"
                    value={<span className="font-mono">{data.school_voucher_folio}</span>}
                    iconName="hash"
                  />
                )}
              </div>
            </InfoSection>
          </div>
        </div>
      </div>
    </div>

  );
}