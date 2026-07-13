export interface ClassGroupOption {
  id: number;
  name: string;
  grade_level_id: number;
  grade_name: string;
  academic_year_id: number;
  academic_year: string;
  label: string;
  active_students_count: number;
}

export interface CredentialTrackingState {
  credential_printed: boolean;
  nfc_ready: boolean;
  ready_to_deliver: boolean;
  paid: boolean;
  delivered: boolean;
  lost: boolean;
  replacement_count: number;
}

export interface CredentialRow {
  student_id: number;
  credential_id: string | null;
  full_name: string;
  grade: string;
  group: string;
  workshop_names: string;
  curp: string;
  address: string;
  tutor_name: string;
  tutor_relationship?: string | null;
  phone: string;
  photo_filename: string | null;
  has_photo: boolean;
  data_complete: boolean;
  data_missing: string[];
  linea_impresion: string;
  tracking: CredentialTrackingState;
  replacement_label: string;
}

export interface CredentialRowsPayload {
  meta: {
    class_group_id: number;
    grade_name?: string;
    group_name?: string;
    academic_year_id?: number;
    academic_year?: string;
  };
  rows: CredentialRow[];
}

export interface CredentialRowsResponse {
  success: boolean;
  data: CredentialRowsPayload;
}

export interface ClassGroupsResponse {
  success: boolean;
  data: ClassGroupOption[];
}
