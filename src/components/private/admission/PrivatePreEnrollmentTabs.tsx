"use client";

import { useEffect, useState } from "react";
import { useForm, FormProvider, useFormContext } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { formDataSchema, FormData } from "@/lib/validations/admissions/admissions.schema";
import { FloatingInput } from "@/components/ui/FloatingInputs";
import { FloatingSelect } from "@/components/ui/FloatingSelect";
import { createPreEnrollmentByAdmin } from "@/lib/services/admissions.service";
import { globalToast } from '@/lib/toast';
import axios from "axios";

const DRAFT_KEY = "private_new_preenrollment_draft";

export default function PrivatePreEnrollmentTabs() {
    const [activeTab, setActiveTab] = useState(0);
    const [isSaving, setIsSaving] = useState(false);
    const [successResult, setSuccessResult] = useState<{ folio: string, downloadUrl: string, message: string } | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [pdfError, setPdfError] = useState<string | null>(null);

    const methods = useForm<FormData>({
        resolver: zodResolver(formDataSchema),
        mode: "onChange",
        defaultValues: {
            email: { contactEmail: "", contactEmailConfirmation: "" },
            applicantInfo: {
                firstName: "", lastName: "", secondLastName: "", curp: "",
                birthDate: "", age: 0, gender: "O", phone: "", studentEmail: "", placeOfBirth: ""
            },
            academicInfo: { previousSchool: "", currentAverage: "", hasSiblings: false, siblingsDetails: "" },
            addressInfo: {
                streetType: "", streetName: "", houseNumber: "", unitNumber: "",
                neighborhoodType: "", neighborhoodName: "", postalCode: "", city: "", state: ""
            },
            guardianInfo: {
                guardianFirstName: "", guardianLastName: "", guardianSecondLastName: "",
                guardianCurp: "", guardianPhone: "", guardianRelationship: ""
            },
            workshopSelect: { workshopFirstChoice: "", workshopSecondChoice: "" },
            tuitionVoucher: { hasSchoolVoucher: false, schoolVoucherFolio: "" }
        }
    });

    const { handleSubmit, watch, reset, formState: { errors } } = methods;

    // Load draft on mount
    useEffect(() => {
        const draft = localStorage.getItem(DRAFT_KEY);
        if (draft) {
            try {
                const parsedDraft = JSON.parse(draft);
                reset(parsedDraft);
            } catch (e) {
                console.error("Error parsing draft", e);
            }
        }
    }, [reset]);

    const saveDraft = () => {
        setIsSaving(true);
        const currentData = watch();
        localStorage.setItem(DRAFT_KEY, JSON.stringify(currentData));
        setTimeout(() => setIsSaving(false), 800);
    };

    const onSubmit = async (data: FormData) => {
        try {
            setIsSaving(true);
            const result = await createPreEnrollmentByAdmin(data);
            
            // Clear draft on successful submit
            localStorage.removeItem(DRAFT_KEY);
            globalToast.success(result.message || "Preinscripción creada correctamente");
            
            setSuccessResult(result);
            setPreviewUrl(null);
            setPdfError(null);
            
            // Opcional: Limpiar el formulario y regresar a la primera pestaña
            reset();
            setActiveTab(0);
        } catch (error) {
            console.error("Error al enviar el formulario", error);
            globalToast.error("Ocurrió un error al crear la preinscripción");
        } finally {
            setIsSaving(false);
        }
    };

    const tabs = [
        { id: 0, label: "Correo" },
        { id: 1, label: "Aspirante" },
        { id: 2, label: "Educación" },
        { id: 3, label: "Domicilio" },
        { id: 4, label: "Tutor" },
        { id: 5, label: "Taller" },
        { id: 6, label: "Vales" }
    ];

    return (
        <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                
                {/* Save Draft Header / Global Actions */}
                <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm border border-slate-200">
                    <p className="text-sm text-gray-500">
                        {Object.keys(errors).length > 0 && <span className="text-red-500 font-semibold">Existen errores en el formulario. </span>}
                        Revisa las pestañas para corregirlos.
                    </p>
                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={saveDraft}
                            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors border border-gray-300 shadow-sm"
                        >
                            {isSaving ? "Guardando..." : "Guarda formulario para continuar mas tarde"}
                        </button>
                    </div>
                </div>

                {/* Professional Tabs Layout */}
                <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                    <div className="flex overflow-x-auto border-b border-gray-200 hide-scrollbar bg-gray-50">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                type="button"
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-6 py-3 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${
                                    activeTab === tab.id
                                        ? "border-blue-500 text-blue-600 bg-white"
                                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    <div className="p-6 bg-gray-100">
                        {activeTab === 0 && <TabEmail />}
                        {activeTab === 1 && <TabApplicantInfo />}
                        {activeTab === 2 && <TabAcademicInfo />}
                        {activeTab === 3 && <TabAddressInfo />}
                        {activeTab === 4 && <TabGuardianInfo />}
                        {activeTab === 5 && <TabWorkshopSelect />}
                        {activeTab === 6 && <TabTuitionVoucher />}
                    </div>
                </div>

                {/* Main Submit */}
                <div className="flex justify-end">
                    <button type="submit" disabled={isSaving} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                        {isSaving ? "Guardando..." : "Guardar Preinscripción"}
                    </button>
                </div>

                {/* Success Block */}
                {successResult && (
                    <div className="mt-8 bg-blue-50 border-2 border-blue-600 rounded-xl p-6 md:p-8 relative">
                        <button 
                            type="button" 
                            onClick={() => { setSuccessResult(null); setPreviewUrl(null); }} 
                            className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center bg-white rounded-full text-gray-500 hover:text-gray-800 shadow-sm"
                        >
                            ✕
                        </button>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2 font-merriweather text-center">
                            ¡Registro Exitoso!
                        </h3>
                        <p className="text-center text-sm text-gray-600 mb-6">{successResult.message}</p>
                        
                        <div className="bg-white rounded-lg p-4 mb-6 text-center mx-auto max-w-sm shadow-sm border border-blue-100">
                            <p className="text-sm text-gray-500 mb-1">Folio de Preinscripción</p>
                            <p className="text-3xl font-bold text-blue-600 font-mono tracking-wider">{successResult.folio}</p>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button
                                type="button"
                                onClick={async () => {
                                    try {
                                        setPreviewUrl(null);
                                        const res = await axios.get(successResult.downloadUrl, { responseType: 'blob' });
                                        const blob = new Blob([res.data], { type: 'application/pdf' });
                                        const url = URL.createObjectURL(blob);
                                        setPreviewUrl(url);
                                        setPdfError(null);
                                    } catch (e) {
                                        setPdfError('Error al cargar PDF o enlace expirado');
                                    }
                                }}
                                className="px-6 py-3 bg-white border border-gray-300 text-gray-800 rounded-lg hover:bg-gray-100 font-medium transition-colors"
                            >
                                Previsualizar Comprobante
                            </button>
                            <a 
                                href={successResult.downloadUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors text-center shadow-sm"
                            >
                                Descargar PDF Comprobante
                            </a>
                        </div>
                        
                        {pdfError && <p className="text-center text-red-500 font-medium mt-4 bg-red-50 p-2 rounded">{pdfError}</p>}
                        
                        {previewUrl && !pdfError && (
                            <div className="mt-6 bg-white p-2 rounded-lg shadow-sm border border-gray-200 h-[600px] md:h-[800px]">
                                <object data={previewUrl} type="application/pdf" className="w-full h-full rounded">
                                    <div className="flex flex-col items-center justify-center p-8 text-center bg-gray-50 h-full">
                                        <p className="mb-2 text-gray-600 font-medium">Tu navegador no puede previsualizar PDFs incrustados.</p>
                                        <a href={successResult.downloadUrl} target="_blank" rel="noreferrer" className="text-blue-600 hover:text-blue-800 underline font-medium">Descargar el archivo PDF aquí</a>
                                    </div>
                                </object>
                            </div>
                        )}
                    </div>
                )}
            </form>
        </FormProvider>
    );
}

// -------------------------------------------------------------
// Componentes Secundarios: Pestañas de Formulario
// -------------------------------------------------------------

function TabEmail() {
    const { register, formState: { errors } } = useFormContext<FormData>();
    
    return (
        <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-4 text-slate-700">Validación de Correo Electrónico</h3>
            <div className="grid lg:grid-cols-2 gap-4">
                <FloatingInput
                    label="Correo Electrónico a Validar"
                    type="email"
                    {...register("email.contactEmail")}
                    error={errors.email?.contactEmail?.message}
                    placeholder="ejemplo@correo.com"
                    required
                />
                <FloatingInput
                    label="Confirmar Correo Electrónico"
                    type="email"
                    {...register("email.contactEmailConfirmation")}
                    error={errors.email?.contactEmailConfirmation?.message}
                    placeholder="ejemplo@correo.com"
                    required
                />
            </div>
        </div>
    );
}

function TabApplicantInfo() {
    const { register, formState: { errors } } = useFormContext<FormData>();
    
    return (
        <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-4 text-slate-700">Datos del Aspirante</h3>
            <div className="grid lg:grid-cols-3 gap-4 mb-4">
                <FloatingInput
                    label="Apellido Paterno"
                    type="text"
                    {...register("applicantInfo.lastName")}
                    error={errors.applicantInfo?.lastName?.message}
                    placeholder="Paterno"
                    required
                />
                <FloatingInput
                    label="Apellido Materno"
                    type="text"
                    {...register("applicantInfo.secondLastName")}
                    error={errors.applicantInfo?.secondLastName?.message}
                    placeholder="Materno"
                />
                <FloatingInput
                    label="Nombre Completo"
                    type="text"
                    {...register("applicantInfo.firstName")}
                    error={errors.applicantInfo?.firstName?.message}
                    placeholder="Nombre(s)"
                    required
                />
            </div>
            <div className="grid lg:grid-cols-3 gap-4 mb-4">
                <FloatingInput
                    label="CURP"
                    type="text"
                    {...register("applicantInfo.curp")}
                    error={errors.applicantInfo?.curp?.message}
                    placeholder="CURP (18 caracteres)"
                    required
                />
                <FloatingInput
                    label="Fecha de Nacimiento"
                    type="date"
                    {...register("applicantInfo.birthDate")}
                    error={errors.applicantInfo?.birthDate?.message}
                    placeholder="AAAA-MM-DD"
                    required
                />
                <FloatingInput
                    label="Edad"
                    type="number"
                    {...register("applicantInfo.age", { valueAsNumber: true })}
                    error={errors.applicantInfo?.age?.message}
                    placeholder="Edad"
                    required
                />
            </div>
            <div className="grid lg:grid-cols-2 gap-4">
                <FloatingInput
                    label="Correo Electrónico Estudiante"
                    type="email"
                    {...register("applicantInfo.studentEmail")}
                    error={errors.applicantInfo?.studentEmail?.message}
                    placeholder="Correo de contacto"
                    required
                />
                <FloatingInput
                    label="Teléfono"
                    type="text"
                    {...register("applicantInfo.phone")}
                    error={errors.applicantInfo?.phone?.message}
                    placeholder="Teléfono a 10 dígitos"
                    required
                />
                <FloatingInput
                    label="Lugar de Nacimiento"
                    type="text"
                    {...register("applicantInfo.placeOfBirth")}
                    error={errors.applicantInfo?.placeOfBirth?.message}
                    placeholder="Estado o Ciudad"
                    required
                />
                <FloatingSelect
                    label="Género"
                    {...register("applicantInfo.gender")}
                    error={errors.applicantInfo?.gender?.message}
                    placeholder="Género"
                    required
                >
                    <option value="">Seleccione una opción...</option>
                    <option value="M">Masculino</option>
                    <option value="F">Femenino</option>
                    <option value="O">Otro</option>
                </FloatingSelect>
            </div>
        </div>
    );
}

function TabAcademicInfo() {
    const { register, formState: { errors }, watch } = useFormContext<FormData>();
    const hasSiblings = watch("academicInfo.hasSiblings");

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-4 text-slate-700">Información Académica</h3>
            <div className="grid lg:grid-cols-2 gap-4 mb-4">
                <FloatingInput
                    label="Escuela de Procedencia"
                    type="text"
                    {...register("academicInfo.previousSchool")}
                    error={errors.academicInfo?.previousSchool?.message}
                    placeholder="Nombre completo de primaria"
                    required
                />
                <FloatingInput
                    label="Promedio Actual"
                    type="number"
                    step="0.1"
                    {...register("academicInfo.currentAverage")}
                    error={errors.academicInfo?.currentAverage?.message}
                    placeholder="Ej. 8.5"
                    required
                />
            </div>
            <div className="mb-4 flex flex-col gap-2">
                <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-700">
                    <input type="checkbox" {...register("academicInfo.hasSiblings")} className="w-4 h-4 text-blue-600 rounded" />
                    ¿Tiene hermanos inscritos en la escuela?
                </label>
            </div>
            {hasSiblings && (
                <div className="mt-4">
                    <FloatingInput
                        label="Detalles de Hermanos"
                        type="text"
                        {...register("academicInfo.siblingsDetails")}
                        error={errors.academicInfo?.siblingsDetails?.message}
                        placeholder="Nombres y grados de hermanos"
                    />
                </div>
            )}
        </div>
    );
}

function TabAddressInfo() {
    const { register, formState: { errors } } = useFormContext<FormData>();
    return (
        <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-4 text-slate-700">Domicilio</h3>
            <div className="grid lg:grid-cols-3 gap-4 mb-4">
                <FloatingInput
                    label="Código Postal"
                    type="text"
                    {...register("addressInfo.postalCode")}
                    error={errors.addressInfo?.postalCode?.message}
                    placeholder="Ej. 68000"
                    required
                />
                <FloatingInput
                    label="Estado"
                    type="text"
                    {...register("addressInfo.state")}
                    error={errors.addressInfo?.state?.message}
                    placeholder="Estado"
                    required
                />
                <FloatingInput
                    label="Ciudad"
                    type="text"
                    {...register("addressInfo.city")}
                    error={errors.addressInfo?.city?.message}
                    placeholder="Ciudad o Municipio"
                    required
                />
            </div>
            <div className="grid lg:grid-cols-2 gap-4 mb-4">
                <FloatingInput
                    label="Tipo de Asentamiento"
                    type="text"
                    {...register("addressInfo.neighborhoodType")}
                    error={errors.addressInfo?.neighborhoodType?.message}
                    placeholder="Colonia, Fraccionamiento..."
                    required
                />
                <FloatingInput
                    label="Nombre de Asentamiento"
                    type="text"
                    {...register("addressInfo.neighborhoodName")}
                    error={errors.addressInfo?.neighborhoodName?.message}
                    placeholder="Nombre"
                    required
                />
            </div>
            <div className="grid lg:grid-cols-3 gap-4">
                <FloatingInput
                    label="Tipo de Calle"
                    type="text"
                    {...register("addressInfo.streetType")}
                    error={errors.addressInfo?.streetType?.message}
                    placeholder="Avenida, Andador..."
                    required
                />
                <FloatingInput
                    label="Nombre de Calle"
                    type="text"
                    {...register("addressInfo.streetName")}
                    error={errors.addressInfo?.streetName?.message}
                    placeholder="Nombre"
                    required
                />
                <div className="flex gap-2">
                    <FloatingInput
                        label="No. Exterior"
                        type="text"
                        {...register("addressInfo.houseNumber")}
                        error={errors.addressInfo?.houseNumber?.message}
                        placeholder="Ext."
                        required
                    />
                    <FloatingInput
                        label="No. Interior"
                        type="text"
                        {...register("addressInfo.unitNumber")}
                        error={errors.addressInfo?.unitNumber?.message}
                        placeholder="Int."
                    />
                </div>
            </div>
        </div>
    );
}

function TabGuardianInfo() {
    const { register, formState: { errors } } = useFormContext<FormData>();
    return (
        <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-4 text-slate-700">Información del Tutor</h3>
            <div className="grid lg:grid-cols-3 gap-4 mb-4">
                <FloatingInput
                    label="Apellido Paterno Tutor"
                    type="text"
                    {...register("guardianInfo.guardianLastName")}
                    error={errors.guardianInfo?.guardianLastName?.message}
                    placeholder="Paterno"
                    required
                />
                <FloatingInput
                    label="Apellido Materno Tutor"
                    type="text"
                    {...register("guardianInfo.guardianSecondLastName")}
                    error={errors.guardianInfo?.guardianSecondLastName?.message}
                    placeholder="Materno"
                />
                <FloatingInput
                    label="Nombre Tutor"
                    type="text"
                    {...register("guardianInfo.guardianFirstName")}
                    error={errors.guardianInfo?.guardianFirstName?.message}
                    placeholder="Nombre(s)"
                    required
                />
            </div>
            <div className="grid lg:grid-cols-3 gap-4">
                <FloatingInput
                    label="Parentesco"
                    type="text"
                    {...register("guardianInfo.guardianRelationship")}
                    error={errors.guardianInfo?.guardianRelationship?.message}
                    placeholder="Madre, Padre..."
                    required
                />
                <FloatingInput
                    label="Teléfono Tutor"
                    type="text"
                    {...register("guardianInfo.guardianPhone")}
                    error={errors.guardianInfo?.guardianPhone?.message}
                    placeholder="A 10 dígitos"
                    required
                />
                <FloatingInput
                    label="CURP Tutor"
                    type="text"
                    {...register("guardianInfo.guardianCurp")}
                    error={errors.guardianInfo?.guardianCurp?.message}
                    placeholder="Opcional"
                />
            </div>
        </div>
    );
}

function TabWorkshopSelect() {
    const { register, formState: { errors } } = useFormContext<FormData>();
    
    // Suponemos opciones genéricas si no se pasan
    return (
        <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-4 text-slate-700">Selección de Taller</h3>
            <div className="grid lg:grid-cols-2 gap-4">
                <FloatingSelect
                    label="Primera Opción"
                    {...register("workshopSelect.workshopFirstChoice")}
                    error={errors.workshopSelect?.workshopFirstChoice?.message}
                    placeholder="Taller"
                    required
                >
                    <option value="">Seleccione taller...</option>
                    <option value="INFORMATICA">Informática</option>
                    <option value="ELECTRICIDAD">Electricidad</option>
                    <option value="CARPINTERIA">Carpintería</option>
                    <option value="DISEÑO_MECANICO">Diseño Mecánico</option>
                </FloatingSelect>
                <FloatingSelect
                    label="Segunda Opción"
                    {...register("workshopSelect.workshopSecondChoice")}
                    error={errors.workshopSelect?.workshopSecondChoice?.message}
                    placeholder="Taller Alternativo"
                    required
                >
                    <option value="">Seleccione taller...</option>
                    <option value="INFORMATICA">Informática</option>
                    <option value="ELECTRICIDAD">Electricidad</option>
                    <option value="CARPINTERIA">Carpintería</option>
                    <option value="DISEÑO_MECANICO">Diseño Mecánico</option>
                </FloatingSelect>
            </div>
        </div>
    );
}

function TabTuitionVoucher() {
    const { register, formState: { errors }, watch } = useFormContext<FormData>();
    const hasVoucher = watch("tuitionVoucher.hasSchoolVoucher");

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-4 text-slate-700">Vales Escolares</h3>
            <div className="flex flex-col gap-2 mb-4">
                <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-700">
                    <input type="checkbox" {...register("tuitionVoucher.hasSchoolVoucher")} className="w-4 h-4 text-blue-600 rounded" />
                    ¿Cuenta con vale escolar?
                </label>
            </div>
            {hasVoucher && (
                <FloatingInput
                    label="Folio del Vale"
                    type="text"
                    {...register("tuitionVoucher.schoolVoucherFolio")}
                    error={errors.tuitionVoucher?.schoolVoucherFolio?.message}
                    placeholder="Escriba el folio..."
                />
            )}
        </div>
    );
}
