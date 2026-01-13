// Validación y extracción de datos de CURP
export interface CURPData {
  fechaNacimiento: string; // formato YYYY-MM-DD
  edad: number;
  genero: string; // 'M' o 'F'
  lugarNacimiento: string;
}

export function validateCURP(curp: string): boolean {
  // Formato básico de CURP: 18 caracteres alfanuméricos
  const curpRegex = /^[A-Z]{4}[0-9]{6}[HM][A-Z]{5}[0-9A-Z][0-9]$/;
  return curpRegex.test(curp.toUpperCase());
}

export function extractDataFromCURP(curp: string): CURPData | null {
  if (!validateCURP(curp)) {
    return null;
  }

  const curpUpper = curp.toUpperCase();
  
  // Extraer año (posición 4-5)
  const year = curpUpper.substring(4, 6);
  // Extraer mes (posición 6-7)
  const month = curpUpper.substring(6, 8);
  // Extraer día (posición 8-9)
  const day = curpUpper.substring(8, 10);
  
  // Determinar siglo (posición 16)
  const centuryChar = curpUpper.charAt(16);
  const fullYear = centuryChar >= '0' && centuryChar <= '9' 
    ? '20' + year 
    : '19' + year;
  
  // Extraer género (posición 10)
  const gender = curpUpper.charAt(10);
  const genero = gender === 'H' ? 'MASCULINO' : 'FEMENINO';
  
  // Extraer lugar de nacimiento (posición 11-12) - simplificado
  const estadoCode = curpUpper.substring(11, 13);
  const lugarNacimiento = getEstadoFromCode(estadoCode);
  
  // Calcular edad
  const fechaNac = new Date(parseInt(fullYear), parseInt(month) - 1, parseInt(day));
  const hoy = new Date();
  let edad = hoy.getFullYear() - fechaNac.getFullYear();
  const mesDiff = hoy.getMonth() - fechaNac.getMonth();
  if (mesDiff < 0 || (mesDiff === 0 && hoy.getDate() < fechaNac.getDate())) {
    edad--;
  }
  
  // Formatear fecha como YYYY-MM-DD
  const fechaNacimiento = `${fullYear}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  
  return {
    fechaNacimiento,
    edad,
    genero,
    lugarNacimiento
  };
}

function getEstadoFromCode(code: string): string {
  // Mapeo simplificado de códigos de estado en CURP
  const estados: { [key: string]: string } = {
    'AS': 'AGUASCALIENTES',
    'BS': 'BAJA CALIFORNIA SUR',
    'CL': 'COAHUILA',
    'CS': 'CHIAPAS',
    'DF': 'CIUDAD DE MÉXICO',
    'GT': 'GUANAJUATO',
    'HG': 'HIDALGO',
    'MC': 'MÉXICO',
    'NL': 'NUEVO LEÓN',
    'PL': 'PUEBLA',
    'QR': 'QUINTANA ROO',
    'SL': 'SAN LUIS POTOSÍ',
    'TC': 'TABASCO',
    'TL': 'TLAXCALA',
    'YN': 'YUCATÁN',
    'NE': 'NACIDO EN EL EXTRANJERO',
    'OC': 'OAXACA', // Código común para Oaxaca
  };
  
  return estados[code] || 'OAXACA'; // Por defecto Oaxaca si no se encuentra
}

