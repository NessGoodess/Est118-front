export type ScoreMode = "exam" | "school_average" | "combined";
export type SeparationMode = "off" | "soft" | "hard";
export type SiblingDetection = "linked_only" | "guardian_curp" | "lastname_warn";

export type AdmissionIntakeSettings = {
  score_mode: ScoreMode;
  exam_weight: number;
  average_weight: number;
  balance_load: boolean;
  balance_scores: boolean;
  separate_same_school: SeparationMode;
  separate_siblings: SeparationMode;
  sibling_detection: SiblingDetection;
  allow_convert_without_complete_docs: boolean;
  allow_convert_without_complete_data: boolean;
  allow_convert_without_payment: boolean;
  require_exam_before_convert: boolean;
  require_score_before_placement: boolean;
  allow_manual_group_change: boolean;
  late_intake_enabled: boolean;
  late_requires_manual_group: boolean;
  late_suggest_group: boolean;
  late_lock_batch_rebalance: boolean;
  updated_at?: string | null;
};

export type AdmissionIntakeSettingsPayload = Partial<AdmissionIntakeSettings>;

export type ConvertStudentPayload = {
  academic_year_id?: number;
  class_group_id?: number;
  channel?: "campaign" | "late";
  force_incomplete_docs?: boolean;
  force_incomplete_data?: boolean;
  force_without_payment?: boolean;
};
