export type Gender = "M" | "F" | "O";

export interface PreEnrollmentApi {
  id: number;
  folio: string;
  status: string;
  documents_status?: string;
  payment_status?: string;
  converted_student_id?: number | null;

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
  current_average: string;
  admission_exam_score?: string | null;
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

  reviewed_by?: number | null;
  reviewed_at?: string | null;
  review_notes?: string | null;
  converted_by?: number | null;
  converted_at?: string | null;
  created_at: string;
  updated_at?: string;
}


export interface PreEnrollmentListItem {
  id: number;
  folio: string;
  status: string;
  documents_status?: string;
  payment_status?: string;
  converted_student_id?: number | null;
  full_name: string;
  curp: string;
  gender: Gender;
  age: number;

  guardian_name: string;
  contact_email: string;
  guardian_phone: string;

  created_at: string;
}

export enum AdmissionCycleStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  CLOSED = 'closed',
}

export interface AdmissionCycle {
  id: number;
  name: string;
  start_at: string;
  end_at: string;
  status: AdmissionCycleStatus;
  last_folio_number: number;
  created_by: number;
  closed_at: string | null;
  created_at: string;
  updated_at: string;
  preenrollments_count: number;
}
