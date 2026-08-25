import type {
  AdmissionFormData,
  FormData,
} from "../validations/admissions.schema";
import type { PreEnrollmentApi, PreEnrollmentListItem } from "./pre-enrollment-api";

export function apiToAdmissionFormData(api: PreEnrollmentApi): AdmissionFormData {
  return {
    email: {
      contactEmail: api.contact_email,
    },
    applicantInfo: {
      firstName: api.first_name,
      lastName: api.last_name,
      secondLastName: api.second_last_name ?? "",
      curp: api.curp,
      birthDate: api.birth_date,
      age: api.age,
      gender: api.gender,
      phone: api.phone,
      studentEmail: api.student_email,
      placeOfBirth: api.place_of_birth,
    },
    academicInfo: {
      previousSchool: api.previous_school,
      currentAverage: api.current_average,
      hasSiblings: api.has_siblings,
      siblingsDetails: api.siblings_details ?? "",
    },
    addressInfo: {
      streetType: api.street_type,
      streetName: api.street_name,
      houseNumber: api.house_number,
      unitNumber: api.unit_number ?? "",
      neighborhoodType: api.neighborhood_type,
      neighborhoodName: api.neighborhood_name,
      postalCode: api.postal_code,
      city: api.city,
      state: api.state,
    },
    guardianInfo: {
      guardianFirstName: api.guardian_first_name,
      guardianLastName: api.guardian_last_name,
      guardianSecondLastName: api.guardian_second_last_name ?? "",
      guardianCurp: api.guardian_curp,
      guardianPhone: api.guardian_phone,
      guardianRelationship: api.guardian_relationship,
    },
    workshopSelect: {
      workshopFirstChoice: api.workshop_first_choice,
      workshopSecondChoice: api.workshop_second_choice,
    },
    tuitionVoucher: {
      hasSchoolVoucher: api.has_school_voucher,
      schoolVoucherFolio: api.school_voucher_folio ?? "",
    },
  };
}

export function apiToFormData(api: PreEnrollmentApi): FormData {
  const data = apiToAdmissionFormData(api);
  return {
    ...data,
    email: {
      ...data.email,
      contactEmailConfirmation: data.email.contactEmail,
    },
  };
}

export function admissionFormDataToApiPayload(
  data: AdmissionFormData
): Partial<PreEnrollmentApi> {
  return {
    contact_email: data.email.contactEmail,
    first_name: data.applicantInfo.firstName,
    last_name: data.applicantInfo.lastName,
    second_last_name: data.applicantInfo.secondLastName || undefined,
    curp: data.applicantInfo.curp,
    birth_date: data.applicantInfo.birthDate,
    age: data.applicantInfo.age,
    gender: data.applicantInfo.gender,
    phone: data.applicantInfo.phone,
    student_email: data.applicantInfo.studentEmail,
    place_of_birth: data.applicantInfo.placeOfBirth,
    previous_school: data.academicInfo.previousSchool,
    current_average: data.academicInfo.currentAverage,
    has_siblings: data.academicInfo.hasSiblings,
    siblings_details: data.academicInfo.hasSiblings
      ? data.academicInfo.siblingsDetails || undefined
      : undefined,
    street_type: data.addressInfo.streetType,
    street_name: data.addressInfo.streetName,
    house_number: data.addressInfo.houseNumber,
    unit_number: data.addressInfo.unitNumber || undefined,
    neighborhood_type: data.addressInfo.neighborhoodType,
    neighborhood_name: data.addressInfo.neighborhoodName,
    postal_code: data.addressInfo.postalCode,
    city: data.addressInfo.city,
    state: data.addressInfo.state,
    guardian_first_name: data.guardianInfo.guardianFirstName,
    guardian_last_name: data.guardianInfo.guardianLastName,
    guardian_second_last_name:
      data.guardianInfo.guardianSecondLastName || undefined,
    guardian_curp: data.guardianInfo.guardianCurp,
    guardian_phone: data.guardianInfo.guardianPhone,
    guardian_relationship: data.guardianInfo.guardianRelationship,
    workshop_first_choice: data.workshopSelect.workshopFirstChoice,
    workshop_second_choice: data.workshopSelect.workshopSecondChoice,
    has_school_voucher: data.tuitionVoucher.hasSchoolVoucher,
    school_voucher_folio: data.tuitionVoucher.hasSchoolVoucher
      ? data.tuitionVoucher.schoolVoucherFolio || undefined
      : undefined,
  };
}

export function apiToListItem(api: PreEnrollmentApi): PreEnrollmentListItem {
  return {
    
    id: api.id,
    folio: api.folio,
    status: api.status,
    full_name: `${api.first_name} ${api.last_name} ${api.second_last_name}`,
    curp: api.curp,
    gender: api.gender,
    age: api.age,
    guardian_name: `${api.guardian_first_name} ${api.guardian_last_name} ${api.guardian_second_last_name}`,
    guardian_phone: api.guardian_phone,
    contact_email: api.contact_email,
    created_at: api.created_at
  };
}
