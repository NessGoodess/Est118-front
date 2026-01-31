import { FormData } from "./admission";
import { PreEnrollmentApi } from "./preEnrollmentApi";
import { PreEnrollmentListItem } from "./preEnrollmentApi";

export function apiToFormData(api: PreEnrollmentApi): FormData {
  return {
    email: {
      contactEmail: api.contact_email,
      contactEmailConfirmation: api.contact_email,
    },
    applicantInfo: {
      firstName: api.first_name,
      lastName: api.last_name,
      secondLastName: api.second_last_name,
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
      currentAverage: Number(api.current_average),
      hasSiblings: api.has_siblings,
      siblingsDetails: api.siblings_details,
    },
    addressInfo: {
      streetType: api.street_type,
      streetName: api.street_name,
      houseNumber: api.house_number,
      unitNumber: api.unit_number,
      neighborhoodType: api.neighborhood_type,
      neighborhoodName: api.neighborhood_name,
      postalCode: api.postal_code,
      city: api.city,
      state: api.state,
    },
    guardianInfo: {
      guardianFirstName: api.guardian_first_name,
      guardianLastName: api.guardian_last_name,
      guardianSecondLastName: api.guardian_second_last_name,
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
      schoolVoucherFolio: api.school_voucher_folio,
    },
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
