// src/lib/address.ts
import raw from "./data/oaxaca.json";
import type { Estados } from "./types/address";

/**
 * Catalog of addresses
 * Typed explicitly as dictionary
 */
const ADDRESS_DATA = raw as Estados;

const ESTADO = "Oaxaca" as const;
type MunicipiosDeOaxaca = Extract<keyof typeof ADDRESS_DATA["Oaxaca"], string>;

/* --------------------------------------------------
 * TYPE GUARDS
 * --------------------------------------------------*/

/**
 * Validates that the municipality exists in Oaxaca
 * and refines the type for TypeScript
 */
export const isValidMunicipio = (
  m: string
): m is MunicipiosDeOaxaca =>
  m in ADDRESS_DATA[ESTADO];

/**
 * Validates that the CP exists within a valid municipality
 */
export const isValidCp = (
  municipio: string,
  cp: string
): boolean =>
  isValidMunicipio(municipio) &&
  cp in ADDRESS_DATA[ESTADO][municipio];

export const getMunicipios = (): string[] =>
  Object.keys(ADDRESS_DATA[ESTADO]);

export const getCpsByMunicipio = (municipio: string): string[] => {
  if (!isValidMunicipio(municipio)) return [];
  return Object.keys(ADDRESS_DATA[ESTADO][municipio]);
};

export const getColonias = (
  municipio: string,
  cp: string
): string[] => {
  if (!isValidMunicipio(municipio)) return [];
  return ADDRESS_DATA[ESTADO][municipio][cp] ?? [];
};

/**
 * Turns a CP into Municipality + Colonias list
 */
export const getInfoByPostalCode = (cp: string): { municipio: string; colonias: string[] } | null => {
  const municipios = getMunicipios();
  for (const municipio of municipios) {
    if (cp in ADDRESS_DATA[ESTADO][municipio]) {
      return {
        municipio,
        colonias: ADDRESS_DATA[ESTADO][municipio][cp]
      };
    }
  }
  return null;
};
