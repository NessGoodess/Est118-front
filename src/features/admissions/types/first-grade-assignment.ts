export type ScoreSource = "school_average" | "admission_exam" | "combined";

export interface FirstGradeAssignmentItem {
  enrollment_id: number;
  student_id: number;
  student_name: string;
  previous_school: string | null;
  school_average: number | null;
  admission_exam_score: number | null;
  score_used: number;
  fallback_used: boolean;
  current_group_id: number | null;
  suggested_group_id: number | null;
  suggested_group_name: string | null;
  flags: string[];
  manual_override: boolean;
  will_apply?: boolean;
}

export interface FirstGradeGroupLoad {
  class_group_id: number;
  group_name: string | null;
  total: number;
}

export interface FirstGradeAssignmentSummary {
  total_candidates: number;
  with_conflicts: number;
  fallback_scores: number;
  skipped?: number;
  locked_in_groups?: number;
}

export interface FirstGradeAssignmentResult {
  score_source: ScoreSource;
  score_mode?: string;
  dry_run: boolean;
  group_loads: FirstGradeGroupLoad[];
  assignments: FirstGradeAssignmentItem[];
  summary: FirstGradeAssignmentSummary;
}

