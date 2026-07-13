export interface StudentEnrollmentDetail {
  enrollment_id: number | null;
  grade_level?: string | null;
  class_group?: string | null;
  academic_year?: string | null;
  recorded_at?: string | null;
  updated_at?: string | null;
  is_new_admission?: boolean | null;
  is_approved?: boolean | null;
  promotion_result?: string | null;
}

export interface AddressDetail {
  street_type?: string | null;
  street_name?: string | null;
  house_number?: string | null;
  apartament_number?: string | null;
  neighborhood_type?: string | null;
  neighborhood_name?: string | null;
  postal_code?: string | null;
  city?: string | null;
  state?: string | null;
}

export interface StudentPhotos {
  thumbnail_url: string | null;
  profile_url: string | null;
  /** Imagen original subida (máxima resolución disponible en disco) */
  original_url: string | null;
}

export interface GuardianRow {
  name: string | null;
  relationship: string | null;
  phone: string | null;
}

export interface StudentProfileStudentInfo {
  id: number;
  /** students.credential_id — string nullable (UID / credencial NFC) */
  credential_id?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  full_name?: string | null;
  name?: string | null;
  birth_date?: string | null;
  gender?: string | null;
  phone?: string | null;
  national_id?: string | null;
  email?: string | null;
  phone_secondary?: string | null;
  profile_picture_filename?: string | null;
  profile_updated_at?: string | null;
}

export interface StudentDetailPayload {
  student_info: StudentProfileStudentInfo;
  photos?: StudentPhotos | null;
  address_detail?: AddressDetail | null;
  current_enrollment: StudentEnrollmentDetail | null;
  all_enrollments: unknown[];
  subjects: string[];
  guardians: GuardianRow[];
}

export interface StudentDetailResponse {
  success: boolean;
  data: StudentDetailPayload;
}
