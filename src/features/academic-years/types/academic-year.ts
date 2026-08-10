export interface AcademicYearListItem {
  id: number;
  year_start: string;
  year_end: string;
  starts_on: string;
  ends_on: string;
  description: string;
  is_active: boolean;
  class_groups_count?: number;
}

export interface CreateAcademicYearPayload {
  starts_on: string;
  ends_on: string;
  year_start?: string;
  year_end?: string;
  description?: string;
  generate_class_groups?: boolean;
}

export interface PromoteAcademicYearSummary {
  from_academic_year_id: number;
  to_academic_year_id: number;
  processed: number;
  promoted: number;
  retained: number;
  graduated: number;
  errors: Array<{
    enrollment_id: number;
    student_id: number;
    message: string;
  }>;
}
