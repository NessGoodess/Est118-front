export type Gender = "M" | "F" | "O";

export interface EmailInfo {
    contactEmail: string;
    contactEmailConfirmation: string;
}

export interface ApplicantInfo {
    firstName: string;
    lastName: string;
    secondLastName: string;
    curp: string;
    birthDate: string; // ISO string: YYYY-MM-DD
    age: number;
    gender: Gender;
    phone: string;
    studentEmail: string;
    placeOfBirth: string;
}

export interface AcademicInfo {
    previousSchool: string;
    currentAverage: number;
    hasSiblings: boolean;
    siblingsDetails?: string; // opcional si no tiene hermanos
}

export interface AddressInfo {
    streetType: string;
    streetName: string;
    houseNumber: string;
    unitNumber?: string;
    neighborhoodType: string;
    neighborhoodName: string;
    postalCode: string;
    city: string;
    state: string;
}

export interface GuardianInfo {
    guardianFirstName: string;
    guardianLastName: string;
    guardianSecondLastName: string;
    guardianCurp: string;
    guardianPhone: string;
    guardianRelationship: string;
}

export interface WorkshopSelect {
    workshopFirstChoice: string;
    workshopSecondChoice: string;
}

export interface TuitionVoucher {
    hasSchoolVoucher: boolean;
    schoolVoucherFolio?: string;
}

export interface FormData {
    email: EmailInfo;
    applicantInfo: ApplicantInfo;
    academicInfo: AcademicInfo;
    addressInfo: AddressInfo;
    guardianInfo: GuardianInfo;
    workshopSelect: WorkshopSelect;
    tuitionVoucher: TuitionVoucher;
}
