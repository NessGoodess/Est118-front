export type Gender = "M" | "F";

export interface PreEnrollmentApi {
  id: number;
  folio: string;
  status: string;

  contact_email: string;

  first_name: string;
  last_name: string;
  second_last_name: string;
  curp: string;
  birth_date: string;
  age: number;
  gender: Gender;
  phone: string;
  student_email: string;
  place_of_birth: string;

  previous_school: string;
  current_average: number;
  has_siblings: boolean;
  siblings_details?: string;

  street_type: string;
  street_name: string;
  house_number: string;
  unit_number?: string;
  neighborhood_type: string;
  neighborhood_name: string;
  postal_code: string;
  city: string;
  state: string;

  guardian_first_name: string;
  guardian_last_name: string;
  guardian_second_last_name: string;
  guardian_curp: string;
  guardian_phone: string;
  guardian_relationship: string;

  workshop_first_choice: string;
  workshop_second_choice: string;

  has_school_voucher: boolean;
  school_voucher_folio?: string;

  created_at: string;
}


export interface PreEnrollmentListItem {
  id: number;
  folio: string;
  status: string;
  full_name: string;
  curp: string;
  gender: Gender;
  age: number;

  guardian_name: string;
  contact_email: string;
  guardian_phone: string;

  created_at: string;
}
