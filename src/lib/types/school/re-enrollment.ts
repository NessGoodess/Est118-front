export type ReEnrollmentPeriodStatus = 'draft' | 'open' | 'closed' | 'finalized';
export type ReEnrollmentProcessStep =
  | 'configuration'
  | 'validation'
  | 'promotion'
  | 'groups'
  | 'completed';
export type ReEnrollmentValidationStatus =
  | 'pending'
  | 'in_review'
  | 'validated'
  | 'rejected';

export interface ReEnrollmentDashboardStats {
  period_id: number;
  period_name: string;
  status: ReEnrollmentPeriodStatus;
  current_step: ReEnrollmentProcessStep;
  keep_current_groups: boolean;
  promotion_executed_at?: string | null;
  can_validate?: boolean;
  can_promote?: boolean;
  can_simulate_promotion?: boolean;
  can_finalize?: boolean;
  total_students: number;
  validated: number;
  pending: number;
  in_review: number;
  rejected: number;
  unresolved?: number;
  with_debts: number;
  ready_for_promotion: number;
  progress_percent: number;
}

export interface ReEnrollmentPeriod {
  id: number;
  name: string;
  from_academic_year_id: number;
  to_academic_year_id: number;
  start_at: string | null;
  end_at: string | null;
  status: ReEnrollmentPeriodStatus;
  current_step: ReEnrollmentProcessStep;
  keep_current_groups: boolean;
  finalized_at: string | null;
  promotion_executed_at?: string | null;
  applications_count?: number;
  from_academic_year?: { id: number; description: string; year_start: string; year_end: string };
  to_academic_year?: { id: number; description: string; year_start: string; year_end: string };
}

export interface ReEnrollmentEventItem {
  id: number;
  action: string;
  user_name: string;
  summary: Record<string, unknown> | null;
  created_at: string | null;
}

export interface ReEnrollmentApplicationRow {
  id: number;
  enrollment_id: number;
  student_id: number;
  student_name: string;
  grade: string | null;
  group: string | null;
  status: ReEnrollmentValidationStatus;
  passed_cycle: boolean | null;
  documents_complete: boolean | null;
  guardian_updated: boolean | null;
  phone_updated: boolean | null;
  address_updated: boolean | null;
  photo_updated: boolean | null;
  no_debts: boolean | null;
  comments: string | null;
  target_class_group_id: number | null;
}
