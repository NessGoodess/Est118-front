"use client";

import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
//import HeaderCurve from "@/components/ui/Curve";
import { FormField, TextAreaField, SelectField } from "@/components/ui/form-field2";

const THEME = {
  primary: "#0F2C59",
  accent: "#0056B3",
  bgLight: "#F8F9FA",
  border: "#DEE2E6",
  text: "#212529",
};

/* ---------------------- Mini UI Components ---------------------- */
interface CardProps {
  children: React.ReactNode;
  className?: string;
}

function Card({ children, className = "" }: CardProps) {
  return (
    <div className={`bg-white border p-4 rounded-2xl shadow-sm ${className}`} style={{ borderColor: THEME.border }}>
      {children}
    </div>
  );
}

interface CardHeaderProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
}

function CardHeader({ icon, title, subtitle }: CardHeaderProps) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className="text-2xl">{icon}</div>
      <div>
        <div className="text-lg font-semibold" style={{ color: THEME.primary }}>{title}</div>
        {subtitle && <div className="text-sm text-gray-600">{subtitle}</div>}
      </div>
    </div>
  );
}

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "outline";
  className?: string;
  type?: "button" | "submit" | "reset";
}

function Button({ children, onClick, variant = "primary", className = "", type = "button" }: ButtonProps) {
  const base = "px-4 py-2 rounded-lg font-medium inline-flex items-center gap-2";
  if (variant === "primary") {
    return (
      <button type={type} onClick={onClick} className={`${base} ${className}`} style={{ background: THEME.primary, color: "#fff" }}>
        {children}
      </button>
    );
  }
  if (variant === "outline") {
    return (
      <button type={type} onClick={onClick} className={`${base} ${className}`} style={{ border: `1px solid ${THEME.primary}`, color: THEME.primary, background: "transparent" }}>
        {children}
      </button>
    );
  }
  return <button type={type} onClick={onClick} className={`${base} ${className}`}>{children}</button>;
}

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  onConfirm: () => void;
}

function Modal({ open, onClose, title, children, onConfirm }: ModalProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-white rounded-xl p-6 w-full max-w-lg">
        <h3 className="text-xl font-semibold mb-3">{title}</h3>
        <div className="mb-4">{children}</div>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={onConfirm}>Confirmar</Button>
        </div>
      </motion.div>
    </div>
  );
}

interface ProgressBarProps {
  step: number;
  total: number;
}

function ProgressBar({ step, total }: ProgressBarProps) {
  const percent = Math.round((step / total) * 100);
  return (
    <div className="w-full mb-6">
      <div className="text-sm mb-2">Paso {step} de {total}</div>
      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
        <div style={{ width: `${percent}%`, height: 8, background: THEME.accent }} />
      </div>
    </div>
  );
}

/* ---------------------- Hooks ---------------------- */
interface FieldState {
  value: string;
  setValue: (value: string) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onBlur: () => void;
  touched: boolean;
  error: string;
  setError: (error: string) => void;
}

function useField(initial = ""): FieldState {
  const [value, setValue] = useState(initial);
  const [touched, setTouched] = useState(false);
  const [error, setError] = useState("");
  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setValue(e.target.value);
  const onBlur = () => setTouched(true);
  return { value, setValue, onChange, onBlur, touched, error, setError };
}

function useMask() {
  const onlyDigits = (s: string) => s.split("").filter(ch => "0123456789".includes(ch)).join("");
  const maskPhone = (val: string) => onlyDigits(val).slice(0, 10);
  const maskCP = (val: string) => onlyDigits(val).slice(0, 5);
  const maskCURP = (val: string) => val.toUpperCase().split("").filter(ch => "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".includes(ch)).join("").slice(0, 18);
  return { maskPhone, maskCP, maskCURP };
}

/* ---------------------- Validation ---------------------- */
type Validator = (v: string) => true | string;

function useFormValidation() {
  const validators = useMemo<Record<string, Validator>>(() => ({
    required: (v: string) => (v && v.trim() !== "") || "Este campo es obligatorio",
    email: (v: string) => ((v || "").includes("@") && (v || "").includes(".")) || "Formato de correo inválido",
    phone: (v: string) => ((v || "").length === 10 && (v || "").split("").every(ch => "0123456789".includes(ch))) || "Teléfono debe tener 10 dígitos",
    curp: (v: string) => ((v || "").length === 18 && (v || "").split("").every(ch => "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".includes(ch))) || "Formato de CURP incorrecto",
    cp: (v: string) => ((v || "").length === 5 && (v || "").split("").every(ch => "0123456789".includes(ch))) || "Código Postal de 5 dígitos",
  }), []);

  function validateField(fieldName: string, value: string, rules: string[]): true | string {
    for (let r of rules) {
      const validator = validators[r];
      if (validator) {
        const res = validator(value);
        if (res !== true) return res;
      }
    }
    return true;
  }

  function validateAll(specs: Record<string, { value: string; rules: string[] }>): Record<string, string> {
    const errors: Record<string, string> = {};
    for (const key in specs) {
      const { value, rules } = specs[key];
      const res = validateField(key, value, rules || []);
      if (res !== true) errors[key] = res;
    }
    return errors;
  }

  return { validateField, validateAll };
}

/* ---------------------- Helper Data ---------------------- */
const YEARS = [2024, 2025, 2026, 2027, 2028];
const GRADOS = ["1°", "2°", "3°", "4°", "5°", "6°"].map((g) => ({ value: g, label: g }));
const TURNOS = ["Matutino", "Vespertino", "Mixto"].map((t) => ({ value: t, label: t }));
const PARENTESCOS = ["Padre", "Madre", "Tutor Legal", "Otro"].map(p => ({ value: p, label: p }));
const GENEROS = ["Masculino", "Femenino", "Otro"].map(g => ({ value: g, label: g }));
const ESTADOS = ["Ciudad de México", "Jalisco", "Nuevo León", "Puebla", "Veracruz"].map(s => ({ value: s, label: s }));

/* ---------------------- Main Form Component ---------------------- */
export default function FormularioInscripcion() {
  // Campos: Datos Personales
  const nombres = useField("");
  const apellidoP = useField("");
  const apellidoM = useField("");
  const fechaNac = useField("");
  const curp = useField("");
  const genero = useField("");
  const telefono = useField("");
  const correo = useField("");

  // Academicos
  const numControl = useField("");
  const grado = useField("");
  const grupo = useField("");
  const turno = useField("");
  const especialidad = useField("");
  const anioIngreso = useField("");

  // Tutor
  const tutorNombre = useField("");
  const tutorParentesco = useField("");
  const tutorTelefono = useField("");
  const tutorCorreo = useField("");
  const tutorOcupacion = useField("");

  // Domicilio
  const calle = useField("");
  const numExt = useField("");
  const numInt = useField("");
  const colonia = useField("");
  const cp = useField("");
  const municipio = useField("");
  const estado = useField("");

  // Adicional
  const observaciones = useField("");

  const mask = useMask();

  const { validateField, validateAll } = useFormValidation();

  const [step, setStep] = useState(1);
  const TOTAL = 5;
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [folio, setFolio] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  /* onBlur validations specific fields */
  const handleBlur = (name: string, field: FieldState) => {
    // apply masks where relevant
    if (name === "telefono") field.setValue(mask.maskPhone(field.value));
    if (name === "tutorTelefono") field.setValue(mask.maskPhone(field.value));
    if (name === "cp") field.setValue(mask.maskCP(field.value));
    if (name === "curp") field.setValue(mask.maskCURP(field.value));

    // run validators per field
    const specs: Record<string, { value: string; rules: string[] }> = {
      nombres: { value: nombres.value, rules: ["required"] },
      apellidoP: { value: apellidoP.value, rules: ["required"] },
      curp: { value: curp.value, rules: ["required", "curp"] },
      telefono: { value: telefono.value, rules: ["required", "phone"] },
      correo: { value: correo.value, rules: ["required", "email"] },
      cp: { value: cp.value, rules: ["required", "cp"] },
      tutorTelefono: { value: tutorTelefono.value, rules: ["phone"] },
      tutorCorreo: { value: tutorCorreo.value, rules: ["email"] },
    };
    if (specs[name]) {
      const res = validateField(name, specs[name].value, specs[name].rules);
      setErrors((e) => ({ ...e, [name]: res === true ? "" : res }));
    }
  };

  /* Navigation */
  function next() {
    if (step < TOTAL) setStep(step + 1);
  }
  function prev() {
    if (step > 1) setStep(step - 1);
  }

  async function handleSubmitConfirm() {
    // validate all required fields before actually submitting
    const specs: Record<string, { value: string; rules: string[] }> = {
      nombres: { value: nombres.value, rules: ["required"] },
      apellidoP: { value: apellidoP.value, rules: ["required"] },
      curp: { value: curp.value, rules: ["required", "curp"] },
      telefono: { value: telefono.value, rules: ["required", "phone"] },
      correo: { value: correo.value, rules: ["required", "email"] },
      cp: { value: cp.value, rules: ["required", "cp"] },
    };
    const errs = validateAll(specs);
    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      // If there are errors, jump to first section that likely contains it
      setModalOpen(false);
      if (errs.nombres || errs.apellidoP || errs.curp || errs.telefono || errs.correo) setStep(1);
      else if (errs.cp) setStep(4);
      return;
    }

    setSubmitting(true);
    // Simula envío a API - reemplaza con fetch a tu endpoint
    await new Promise((r) => setTimeout(r, 1000));
    const generated = `FOLIO-${Date.now().toString().slice(-6)}`;
    setFolio(generated);
    setSubmitting(false);
    setModalOpen(false);
    setStep(TOTAL);
  }

  function handleFinalSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setModalOpen(true);
  }

  /* Simple per-section render */
  interface SectionPanelProps {
    index: number;
    children: React.ReactNode;
  }

  function SectionPanel({ index, children }: SectionPanelProps) {
    return (
      <div style={{ display: step === index ? "block" : "none" }}>
        {children}
      </div>
    );
  }

  return (
    <section className="m-4 sm:m-6 lg:m-10 max-w-7xl mx-auto">
      <header className="mb-6">
        <div className="flex items-center gap-4 mb-3">
          <div className="w-12 h-12 rounded-lg flex items-center justify-center text-white" style={{ background: THEME.primary }}>
            <strong className="text-lg">Logo</strong>
          </div>
          <div>
            <h1 className="text-2xl font-bold" style={{ color: THEME.primary }}>Formulario de Inscripción</h1>
            <p className="text-sm text-gray-600">Complete la siguiente información con veracidad. Los campos marcados con (*) son obligatorios.</p>
          </div>
        </div>
        <ProgressBar step={step} total={TOTAL} />
      </header>

      <form onSubmit={handleFinalSubmit}>
        {/* Paso 1: Datos Personales */}
        <SectionPanel index={1}>
          <Card className="mb-6">
            <CardHeader icon="👤" title="Datos Personales" subtitle="Información personal básica" />
            <div>
              <FormField
                label="Nombre(s)"
                name="nombres"
                value={nombres.value}
                onChange={nombres.onChange}
                onBlur={() => { nombres.onBlur(); handleBlur('nombres', nombres); }}
                placeholder="Ejemplo: Juan Carlos"
                required
                error={errors.nombres}
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  label="Apellido Paterno"
                  name="apellidoP"
                  value={apellidoP.value}
                  onChange={apellidoP.onChange}
                  onBlur={() => { apellidoP.onBlur(); handleBlur('apellidoP', apellidoP); }}
                  placeholder="Ejemplo: Hernández"
                  required
                  error={errors.apellidoP}
                />

                <FormField
                  label="Apellido Materno"
                  name="apellidoM"
                  value={apellidoM.value}
                  onChange={apellidoM.onChange}
                  onBlur={apellidoM.onBlur}
                  placeholder="Ejemplo: Díaz"
                />

                <FormField
                  label="Fecha de Nacimiento"
                  name="fechaNac"
                  type="date"
                  value={fechaNac.value}
                  onChange={fechaNac.onChange}
                  onBlur={fechaNac.onBlur}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  label="CURP"
                  name="curp"
                  value={curp.value}
                  onChange={(e) => { curp.onChange(e); curp.setValue(mask.maskCURP(e.target.value)); }}
                  onBlur={() => { curp.onBlur(); handleBlur('curp', curp); }}
                  placeholder="Ej: HEGG560427MVZRRL04"
                  required
                  error={errors.curp}
                />

                <SelectField
                  label="Género"
                  name="genero"
                  value={genero.value}
                  onChange={genero.onChange}
                  onBlur={genero.onBlur}
                  options={GENEROS}
                  placeholder="Selecciona género"
                />

                <FormField
                  label="Teléfono"
                  name="telefono"
                  type="tel"
                  value={telefono.value}
                  onChange={(e) => telefono.onChange({ target: { value: mask.maskPhone(e.target.value) } } as React.ChangeEvent<HTMLInputElement>)}
                  onBlur={() => { telefono.onBlur(); handleBlur('telefono', telefono); }}
                  placeholder="5512345678"
                  required
                  error={errors.telefono}
                />
              </div>

              <FormField
                label="Correo Electrónico"
                name="correo"
                type="email"
                value={correo.value}
                onChange={correo.onChange}
                onBlur={() => { correo.onBlur(); handleBlur('correo', correo); }}
                placeholder="ejemplo@dominio.com"
                required
                error={errors.correo}
              />
            </div>
          </Card>
        </SectionPanel>

        {/* Paso 2: Datos Académicos */}
        <SectionPanel index={2}>
          <Card className="mb-6">
            <CardHeader icon="🎓" title="Datos Académicos" subtitle="Información escolar" />
            <div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  label="Número de Control"
                  name="numControl"
                  value={numControl.value}
                  onChange={numControl.onChange}
                  onBlur={numControl.onBlur}
                  placeholder="00012345"
                />

                <SelectField
                  label="Grado"
                  name="grado"
                  value={grado.value}
                  onChange={grado.onChange}
                  onBlur={grado.onBlur}
                  options={GRADOS}
                  placeholder="Selecciona grado"
                />

                <FormField
                  label="Grupo"
                  name="grupo"
                  value={grupo.value}
                  onChange={grupo.onChange}
                  onBlur={grupo.onBlur}
                  placeholder="Ej: A"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <SelectField
                  label="Turno"
                  name="turno"
                  value={turno.value}
                  onChange={turno.onChange}
                  onBlur={turno.onBlur}
                  options={TURNOS}
                />

                <FormField
                  label="Especialidad"
                  name="especialidad"
                  value={especialidad.value}
                  onChange={especialidad.onChange}
                  onBlur={especialidad.onBlur}
                  placeholder="Si aplica"
                />

                <SelectField
                  label="Año de Ingreso"
                  name="anioIngreso"
                  value={anioIngreso.value}
                  onChange={anioIngreso.onChange}
                  onBlur={anioIngreso.onBlur}
                  options={YEARS.map(y=>({value:y.toString(),label:y.toString()}))}
                />
              </div>
            </div>
          </Card>
        </SectionPanel>

        {/* Paso 3: Datos del Tutor */}
        <SectionPanel index={3}>
          <Card className="mb-6">
            <CardHeader icon="👨‍👩‍👧‍👦" title="Datos del Tutor" subtitle="Persona responsable o contacto" />
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  label="Nombre del Tutor"
                  name="tutorNombre"
                  value={tutorNombre.value}
                  onChange={tutorNombre.onChange}
                  onBlur={tutorNombre.onBlur}
                  placeholder="Nombre completo"
                  required
                />

                <SelectField
                  label="Parentesco"
                  name="tutorParentesco"
                  value={tutorParentesco.value}
                  onChange={tutorParentesco.onChange}
                  onBlur={tutorParentesco.onBlur}
                  options={PARENTESCOS}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  label="Teléfono del Tutor"
                  name="tutorTelefono"
                  type="tel"
                  value={tutorTelefono.value}
                  onChange={(e) => tutorTelefono.onChange({ target: { value: mask.maskPhone(e.target.value) } } as React.ChangeEvent<HTMLInputElement>)}
                  onBlur={() => { tutorTelefono.onBlur(); handleBlur('tutorTelefono', tutorTelefono); }}
                  placeholder="5512345678"
                  error={errors.tutorTelefono}
                />

                <FormField
                  label="Correo del Tutor"
                  name="tutorCorreo"
                  type="email"
                  value={tutorCorreo.value}
                  onChange={tutorCorreo.onChange}
                  onBlur={() => { tutorCorreo.onBlur(); handleBlur('tutorCorreo', tutorCorreo); }}
                  placeholder="ejemplo@dominio.com"
                  error={errors.tutorCorreo}
                />
              </div>

              <FormField
                label="Ocupación del Tutor"
                name="tutorOcupacion"
                value={tutorOcupacion.value}
                onChange={tutorOcupacion.onChange}
                onBlur={tutorOcupacion.onBlur}
                placeholder="Ej: Profesor, Empleado, etc."
              />
            </div>
          </Card>
        </SectionPanel>

        {/* Paso 4: Domicilio */}
        <SectionPanel index={4}>
          <Card className="mb-6">
            <CardHeader icon="🏠" title="Datos de Domicilio" subtitle="Dirección completa" />
            <div>
              <FormField
                label="Calle"
                name="calle"
                value={calle.value}
                onChange={calle.onChange}
                onBlur={calle.onBlur}
                placeholder="Ej: Av. Reforma"
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  label="Número Exterior"
                  name="numExt"
                  value={numExt.value}
                  onChange={numExt.onChange}
                  onBlur={numExt.onBlur}
                  placeholder="123"
                />

                <FormField
                  label="Número Interior"
                  name="numInt"
                  value={numInt.value}
                  onChange={numInt.onChange}
                  onBlur={numInt.onBlur}
                  placeholder="Opcional"
                />

                <FormField
                  label="Colonia"
                  name="colonia"
                  value={colonia.value}
                  onChange={colonia.onChange}
                  onBlur={colonia.onBlur}
                  placeholder="Ej: Centro"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  label="Código Postal"
                  name="cp"
                  value={cp.value}
                  onChange={(e) => cp.onChange({ target: { value: mask.maskCP(e.target.value) } } as React.ChangeEvent<HTMLInputElement>)}
                  onBlur={() => { cp.onBlur(); handleBlur('cp', cp); }}
                  placeholder="Ej: 01234"
                  required
                  error={errors.cp}
                />

                <FormField
                  label="Municipio"
                  name="municipio"
                  value={municipio.value}
                  onChange={municipio.onChange}
                  onBlur={municipio.onBlur}
                  placeholder="Ej: Benito Juárez"
                />

                <SelectField
                  label="Estado"
                  name="estado"
                  value={estado.value}
                  onChange={estado.onChange}
                  onBlur={estado.onBlur}
                  options={ESTADOS}
                />
              </div>
            </div>
          </Card>
        </SectionPanel>

        {/* Paso 5: Información Adicional */}
        <SectionPanel index={5}>
          <Card className="mb-6">
            <CardHeader icon="📝" title="Información Adicional" subtitle="Datos extra y observaciones" />
            <TextAreaField
              label="Observaciones"
              name="observaciones"
              value={observaciones.value}
              onChange={observaciones.onChange}
              onBlur={observaciones.onBlur}
              rows={4}
              placeholder="Notas adicionales (alergias, necesidades especiales, etc.)"
            />

            <div className="mt-4">
              <p className="text-sm text-gray-600">Al hacer clic en "Enviar Solicitud" se abrirá un modal de confirmación.</p>
            </div>
          </Card>
        </SectionPanel>

        {/* Navegación */}
        <div className="flex items-center justify-between gap-4 mt-4">
          <div>
            <Button variant="outline" onClick={prev} className={step===1? 'opacity-50 pointer-events-none':''}>Anterior</Button>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={() => { 
              nombres.setValue("");
              apellidoP.setValue("");
              apellidoM.setValue("");
              fechaNac.setValue("");
              curp.setValue("");
              genero.setValue("");
              telefono.setValue("");
              correo.setValue("");
              numControl.setValue("");
              grado.setValue("");
              grupo.setValue("");
              turno.setValue("");
              especialidad.setValue("");
              anioIngreso.setValue("");
              tutorNombre.setValue("");
              tutorParentesco.setValue("");
              tutorTelefono.setValue("");
              tutorCorreo.setValue("");
              tutorOcupacion.setValue("");
              calle.setValue("");
              numExt.setValue("");
              numInt.setValue("");
              colonia.setValue("");
              cp.setValue("");
              municipio.setValue("");
              estado.setValue("");
              observaciones.setValue("");
              setErrors({});
              setFolio(null);
            }}>Limpiar Formulario</Button>

            {step < TOTAL ? (
              <Button onClick={next}>Siguiente</Button>
            ) : (
              <Button type="submit">Enviar Solicitud</Button>
            )}
          </div>
        </div>

      </form>

      {/* Modal Confirmación */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Confirma envío" onConfirm={handleSubmitConfirm}>
        <p>¿Está seguro de que toda la información es correcta? Una vez enviada, la solicitud será revisada por el departamento correspondiente.</p>
        <div className="mt-3 text-sm text-gray-600">Al confirmar, se generará un número de folio y se enviará un correo de confirmación (simulado).</div>
      </Modal>

      {/* Confirmation after submit */}
      {folio && (
        <div className="mt-6 p-4 bg-green-50 border rounded-lg" style={{ borderColor: '#c6f6d5' }}>
          <div className="font-semibold">¡Solicitud Enviada Exitosamente!</div>
          <div className="text-sm">Se ha enviado un correo de confirmación. Su número de folio es: <span className="font-mono">{folio}</span></div>
        </div>
      )}

    </section>
  );
}
