import type { FormData } from "../validations/admissions.schema";

export type {
  AcademicInfo,
  AddressInfo,
  ApplicantInfo,
  EmailInfo,
  FormData,
  Gender,
  GuardianInfo,
  TuitionVoucher,
  WorkshopSelect,
} from "../validations/admissions.schema";

export const defaultFormData: FormData = {
  email: {
    contactEmail: "",
    contactEmailConfirmation: "",
  },
  applicantInfo: {
    firstName: "",
    lastName: "",
    secondLastName: "",
    curp: "",
    birthDate: "",
    age: 0,
    gender: "O",
    phone: "",
    studentEmail: "",
    placeOfBirth: "",
  },
  academicInfo: {
    previousSchool: "",
    currentAverage: "",
    hasSiblings: false,
    siblingsDetails: "",
  },
  addressInfo: {
    streetType: "",
    streetName: "",
    houseNumber: "",
    unitNumber: "",
    neighborhoodType: "",
    neighborhoodName: "",
    postalCode: "",
    city: "",
    state: "",
  },
  guardianInfo: {
    guardianFirstName: "",
    guardianLastName: "",
    guardianSecondLastName: "",
    guardianCurp: "",
    guardianPhone: "",
    guardianRelationship: "",
  },
  workshopSelect: {
    workshopFirstChoice: "",
    workshopSecondChoice: "",
  },
  tuitionVoucher: {
    hasSchoolVoucher: false,
    schoolVoucherFolio: "",
  },
};
