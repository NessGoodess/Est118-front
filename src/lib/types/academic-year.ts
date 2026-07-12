export interface AcademicYearListItem {
  id: number;
  year_start: string;
  year_end: string;
  description: string;
  is_active: boolean;
  class_groups_count?: number;
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
