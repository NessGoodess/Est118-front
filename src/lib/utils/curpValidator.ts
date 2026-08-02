/**
 * Shared CURP helpers (public admissions + private forms).
 * Format: 18 chars — AAAA + YYMMDD + H|M + state + consonants + homoclave + check digit
 */
export const CURP_REGEX = /^[A-Z]{4}[0-9]{6}[HM][A-Z]{5}[0-9A-Z][0-9]$/;

export const CURP_LENGTH = 18;

export interface CURPData {
  birthDate: string; // YYYY-MM-DD
  age: number;
  gender: string; // 'MASCULINO' | 'FEMENINO'
  placeOfBirth: string;
}

export function normalizeCURP(curp: string): string {
  return curp.trim().toUpperCase();
}

export function validateCURP(curp: string): boolean {
  return CURP_REGEX.test(normalizeCURP(curp));
}

export function extractDataFromCURP(curp: string): CURPData | null {
  if (!validateCURP(curp)) {
    return null;
  }

  const curpUpper = normalizeCURP(curp);

  const year = curpUpper.substring(4, 6);
  const month = curpUpper.substring(6, 8);
  const day = curpUpper.substring(8, 10);

  const currentYear = new Date().getFullYear();
  const currentYearLastTwo = currentYear % 100;
  const yearNum = parseInt(year, 10);

  const year2000 = 2000 + yearNum;
  const year1900 = 1900 + yearNum;
  const age2000 = currentYear - year2000;
  const age1900 = currentYear - year1900;

  let fullYear: number;
  if (age2000 >= 4 && age2000 <= 100) {
    fullYear = year2000;
  } else if (age1900 >= 4 && age1900 <= 100) {
    fullYear = year1900;
  } else {
    fullYear = yearNum > currentYearLastTwo ? year1900 : year2000;
  }

  const genderChar = curpUpper.charAt(10);
  const gender = genderChar === "H" ? "MASCULINO" : "FEMENINO";
  const placeOfBirth = getStateFromCode(curpUpper.substring(11, 13));

  const birthDate = new Date(fullYear, parseInt(month, 10) - 1, parseInt(day, 10));
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  const birthDateStr = `${fullYear}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;

  return {
    birthDate: birthDateStr,
    age,
    gender,
    placeOfBirth,
  };
}

function getStateFromCode(code: string): string {
  const states: Record<string, string> = {
    AS: "Aguascalientes",
    BC: "Baja California",
    BS: "Baja California Sur",
    CC: "Campeche",
    CL: "Coahuila",
    CM: "Colima",
    CS: "Chiapas",
    CH: "Chihuahua",
    DF: "Ciudad de México",
    DG: "Durango",
    GT: "Guanajuato",
    GR: "Guerrero",
    HG: "Hidalgo",
    JC: "Jalisco",
    MC: "México",
    MN: "Michoacán",
    MS: "Morelos",
    NT: "Nayarit",
    NL: "Nuevo León",
    OC: "Oaxaca",
    PL: "Puebla",
    QT: "Querétaro",
    QR: "Quintana Roo",
    SP: "San Luis Potosí",
    SL: "San Luis Potosí",
    TC: "Tabasco",
    TS: "Tamaulipas",
    TL: "Tlaxcala",
    VZ: "Veracruz",
    YN: "Yucatán",
    ZS: "Zacatecas",
    NE: "Nacido en el extranjero",
  };

  return states[code] || "Desconocido";
}
