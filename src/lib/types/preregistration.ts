export interface FormData {
    // Paso 1
    email: string;
    emailConfirmacion: string;
    emailVerificado: boolean;
    
    // Paso 2 - Aspirante
    apellidoPaterno: string;
    apellidoMaterno: string;
    nombres: string;
    curpAspirante: string;
    telefonoAspirante: string;
    emailAspirante: string;
    fechaNacimiento: string;
    lugarNacimiento: string;
    age: string;
    genero: string;
    
    // Paso 3 - Educativos
    escuelaProcedencia: string;
    promedio: string;
    tieneHermanos: string;
    hermanosInfo: string;
    
    // Paso 4 - Domicilio
    vialidad: string;
    nombreVialidad: string;
    numeroExterior: string;
    numeroInterior: string;
    asentamiento: string;
    nombreAsentamiento: string;
    municipio: string;
    codigoPostal: string;
    
    // Paso 5 - Tutor
    apellidoPaternoTutor: string;
    apellidoMaternoTutor: string;
    nombresTutor: string;
    curpTutor: string;
    parentesco: string;
    telefonoTutor: string;
    emailTutor: string;
    
    // Paso 6 - Taller
    tallerFavorito: string;
    segundaOpcion: string;
    
    // Paso 7 - Vales
    tieneFolioVales: string;
    folioVales: string;
    
    // Paso 8 - Documentos
    actaNacimiento: File | null;
    curpDocumento: File | null;
    comprobanteDomicilio: File | null;
    constanciaEstudios: File | null;
    fotografiaInfantil: File | null;
    
    // Paso 10 - Confirmación
    folioPreinscripcion?: string;
  }