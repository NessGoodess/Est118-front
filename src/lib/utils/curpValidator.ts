// CURP validation and data extraction
export interface CURPData {
  birthDate: string; // format YYYY-MM-DD
  age: number;
  gender: string; // 'MASCULINO' or 'FEMENINO'
  placeOfBirth: string;
}

export function validateCURP(curp: string): boolean {
  // Basic CURP format: 18 alphanumeric characters
  const curpRegex = /^[A-Z]{4}[0-9]{6}[HM][A-Z]{5}[0-9A-Z][0-9]$/;
  return curpRegex.test(curp.toUpperCase());
}

export function extractDataFromCURP(curp: string): CURPData | null {
  if (!validateCURP(curp)) {
    return null;
  }

  const curpUpper = curp.toUpperCase();
  
  // Extract year (positions 4-5)
  const year = curpUpper.substring(4, 6);
  // Extract month (positions 6-7)
  const month = curpUpper.substring(6, 8);
  // Extract day (positions 8-9)
  const day = curpUpper.substring(8, 10);
  
  // Determine century based on realistic age range
  // If year is greater than current year's last 2 digits, it's from previous century
  const currentYear = new Date().getFullYear();
  const currentYearLastTwo = currentYear % 100;
  const yearNum = parseInt(year);
  
  // Determine century: if year > current year's last 2 digits, it's 1900s, otherwise 2000s
  // But also validate that the resulting age is realistic (between 4 and 100 years)
  let fullYear: number;
  const year2000 = 2000 + yearNum;
  const year1900 = 1900 + yearNum;
  
  // Calculate ages for both possibilities
  const age2000 = currentYear - year2000;
  const age1900 = currentYear - year1900;
  
  // Choose the century that results in a realistic age (between 4 and 100 years)
  if (age2000 >= 4 && age2000 <= 100) {
    fullYear = year2000;
  } else if (age1900 >= 4 && age1900 <= 100) {
    fullYear = year1900;
  } else {
    // Default: if year > current year's last 2 digits, use 1900s, otherwise 2000s
    fullYear = yearNum > currentYearLastTwo ? year1900 : year2000;
  }
  
  // Extract gender (position 10)
  const genderChar = curpUpper.charAt(10);
  const gender = genderChar === 'H' ? 'MASCULINO' : 'FEMENINO';
  
  // Extract place of birth (positions 11-12)
  const stateCode = curpUpper.substring(11, 13);
  const placeOfBirth = getStateFromCode(stateCode);
  
  // Calculate age
  const birthDate = new Date(fullYear, parseInt(month) - 1, parseInt(day));
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  // Format date as YYYY-MM-DD
  const birthDateStr = `${fullYear}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  
  return {
    birthDate: birthDateStr,
    age,
    gender,
    placeOfBirth
  };
}

function getStateFromCode(code: string): string {
  // Simplified mapping of state codes in CURP
  const states: { [key: string]: string } = {
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
    'OC': 'OAXACA', // Common code for Oaxaca
  };
  
  return states[code] || 'OAXACA'; // Default to Oaxaca if not found
}

