import { TextAreaField, SelectField, RadioField } from "@/components/ui";
import { SmartFormField } from "@/components/form/SmartFormField";



export default function PersonalInfo(){
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        // Aquí puedes manejar el envío del formulario
        console.log("Formulario enviado", Object.fromEntries(formData));
    };
    return (
        <>
        
        <h1>este es el primero form </h1>
        <form noValidate onSubmit={handleSubmit} className="space-y-6 sm:space-y-8 max-w-7xl">
                {/* Datos Personales y Académicos */}
                <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
                    {/* Datos Personales */}
                    <article className="bg-white rounded-lg shadow-md p-4 sm:p-6 lg:p-8 lg:flex-1">
                        <fieldset className="border-0 space-y-4 sm:space-y-6">
                            <legend className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 px-2">
                                Datos Personales
                            </legend>

                            {/* Fila 1: 3 campos - Nombres */} 
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                                <SmartFormField
                                    label="Nombre(s)"
                                    name="nombre"
                                    type="text"
                                    autoComplete="given-name"
                                    required
                                />
                                <SmartFormField
                                    label="Apellido Paterno"
                                    name="apellido_paterno"
                                    type="text"
                                    autoComplete="family-name"
                                    required
                                />
                                <SmartFormField
                                    label="Apellido Materno"
                                    name="apellido_materno"
                                    type="text"
                                    autoComplete="family-name"
                                    required
                                />
                            </div>

                            {/* Fila 2: 2 campos - Fecha y CURP */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                                <SmartFormField
                                    label="Fecha de Nacimiento"
                                    name="fecha_nacimiento"
                                    type="date"
                                    autoComplete="bday"
                                    required
                                />
                                <SmartFormField
                                    label="CURP"
                                    name="curp"
                                    type="text"
                                    autoComplete="off"
                                    required
                                />
                            </div>

                            {/* Fila 3: 3 campos - Género, Teléfono, Email */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                                <SelectField
                                    label="Género"
                                    name="genero"
                                    options={[
                                        { value: "masculino", label: "Masculino" },
                                        { value: "femenino", label: "Femenino" },
                                        { value: "otro", label: "Otro" },
                                    ]}
                                    required
                                />
                                <SmartFormField
                                    label="Teléfono"
                                    name="telefono"
                                    type="tel"
                                    autoComplete="tel"
                                />
                                <SmartFormField
                                    label="Correo Electrónico"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                />
                            </div>
                        </fieldset>
                    </article>

                    {/* Datos Académicos */}
                    <article className="bg-white rounded-lg shadow-md p-4 sm:p-6 lg:p-8 lg:flex-1">
                        <fieldset className="border-0 space-y-4 sm:space-y-6">
                            <legend className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 px-2">
                                Datos Académicos
                            </legend>

                            {/* Fila 1: 2 campos - Grado y Grupo */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                                <SmartFormField
                                    label="Grado"
                                    name="grado"
                                    type="text"
                                    autoComplete="off"
                                    required
                                />
                                <SmartFormField
                                    label="Grupo"
                                    name="grupo"
                                    type="text"
                                    autoComplete="off"
                                    required
                                />
                            </div>

                            {/* Fila 2: 2 campos - Número de Control y Turno */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                                <SmartFormField
                                    label="Número de Control"
                                    name="numero_control"
                                    type="text"
                                    autoComplete="off"
                                    required
                                />
                                <SelectField
                                    label="Turno"
                                    name="turno"
                                    options={[
                                        { value: "matutino", label: "Matutino" },
                                        { value: "vespertino", label: "Vespertino" },
                                        { value: "nocturno", label: "Nocturno" },
                                    ]}
                                    required
                                />
                            </div>

                            {/* Fila 3: 1 campo - Año de Ingreso */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                                <SmartFormField
                                    label="Año de Ingreso"
                                    name="ano_ingreso"
                                    type="number"
                                    autoComplete="off"
                                    required
                                />
                            </div>
                        </fieldset>
                    </article>
                </div>

                {/* Datos del Tutor */}
                <article className="bg-white rounded-lg shadow-md p-4 sm:p-6 lg:p-8">
                    <fieldset className="border-0 space-y-4 sm:space-y-6">
                        <legend className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 px-2">
                            Datos del Tutor
                        </legend>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                            <SmartFormField
                                label="Nombre del Tutor"
                                name="tutor_nombre"
                                type="text"
                                placeholder="Ingrese el nombre completo del tutor"
                                autoComplete="name"
                                required
                            />
                            <SelectField
                                label="Parentesco"
                                name="tutor_parentesco"
                                options={[
                                    { value: "padre", label: "Padre" },
                                    { value: "madre", label: "Madre" },
                                    { value: "tutor", label: "Tutor Legal" },
                                    { value: "abuelo", label: "Abuelo(a)" },
                                    { value: "tio", label: "Tío(a)" },
                                    { value: "otro", label: "Otro" },
                                ]}
                                required
                            />
                            <SmartFormField
                                label="Teléfono del Tutor"
                                name="tutor_telefono"
                                type="tel"
                                placeholder="Ingrese el teléfono del tutor"
                                autoComplete="tel"
                                required
                            />
                            <SmartFormField
                                label="Correo del Tutor"
                                name="tutor_email"
                                type="email"
                                placeholder="Ingrese el correo del tutor"
                                autoComplete="email"
                            />
                            <SmartFormField
                                label="Ocupación del Tutor"
                                name="tutor_ocupacion"
                                type="text"
                                placeholder="Ingrese la ocupación del tutor"
                                autoComplete="organization-title"
                            />
                        </div>
                    </fieldset>
                </article>

                {/* Datos de Domicilio */}
                <article className="bg-white rounded-lg shadow-md p-4 sm:p-6 lg:p-8">
                    <fieldset className="border-0 space-y-4 sm:space-y-6">
                        <legend className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 px-2">
                            Datos de Domicilio
                        </legend>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                            <div className="md:col-span-2">
                                <SmartFormField
                                    label="Calle"
                                    name="domicilio_calle"
                                    type="text"
                                    autoComplete="street-address"
                                    required
                                />
                            </div>
                            <SmartFormField
                                label="Número Exterior"
                                name="domicilio_numero_ext"
                                type="text"
                                placeholder="Ingrese el número exterior"
                                autoComplete="off"
                                required
                            />
                            <SmartFormField
                                label="Número Interior"
                                name="domicilio_numero_int"
                                type="text"
                                autoComplete="off"
                            />
                            <SmartFormField
                                label="Colonia"
                                name="domicilio_colonia"
                                type="text"
                                autoComplete="address-level2"
                                required
                            />
                            <SmartFormField
                                label="Código Postal"
                                name="domicilio_cp"
                                type="text"
                                autoComplete="postal-code"
                                required
                            />
                            <SmartFormField
                                label="Municipio"
                                name="domicilio_municipio"
                                type="text"
                                autoComplete="address-level1"
                                required
                            />
                            <SmartFormField
                                label="Estado"
                                name="domicilio_estado"
                                type="text"
                                autoComplete="address-level1"
                                required
                            />
                        </div>
                    </fieldset>
                </article>

                {/* Información Adicional */}
                <article className="bg-white rounded-lg shadow-md p-4 sm:p-6 lg:p-8">
                    <fieldset className="border-0 space-y-4 sm:space-y-6">
                        <legend className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 px-2">
                            Información Adicional
                        </legend>
                        <div className="grid grid-cols-1 gap-4 sm:gap-6">
                            
                        </div>
                    </fieldset>
                </article>

                {/* Footer del Formulario */}
                <footer className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-end pt-6 sm:pt-8 mt-6 sm:mt-8 border-t border-gray-200">
                    <button
                        type="button"
                        className="px-6 py-2.5 sm:py-3 text-sm sm:text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200 shadow-sm hover:shadow-md"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        className="px-6 py-2.5 sm:py-3 text-sm sm:text-base font-medium text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 shadow-lg hover:shadow-xl"
                        style={{ background: THEME.accent }}
                    >
                        Registrar Estudiante
                    </button>
                </footer>
            </form>
        </>
    );
}