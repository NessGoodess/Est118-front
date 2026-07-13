export interface PendingPromotionDecisionItem {
  enrollment_id: number;
  student_id: number;
  student_name: string;
  academic_year_id: number;
  grade: string | null;
  group: string | null;
}

export interface PromotionDecisionApiResponse {
  success: boolean;
  message: string;
  data: {
    enrollment_id: number;
    is_approved: boolean;
  };
}
