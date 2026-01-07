export interface Schedule {
  id: number;
  day: string;
  start_time: string;
  end_time: string;
  subject: string;
  group: string;
  grade_level: string;
  class_group_id: number;
}

export interface Student {
  student_id: number;
  last_name: string;
  name: string;
  current_attendance?: {
    status: AttendanceStatus;
    notes?: string;
    recorded_at: string;
  };
}

export interface AttendanceRecord {
  student_id: number;
  schedule_id: number;
  date: string;
  status: AttendanceStatus;
  notes?: string;
}

export interface ClassAttendanceResponse {
  success: boolean;
  schedule_info: {
    schedule_id: number;
    subject: string;
    class_group: string;
    day: string;
    time: string;
    classroom: string;
    attendance_date: string;
  };
  markedDates: MarkedDates;
  students: Student[];
}

export interface AttendanceStats {
  total: number;
  present: number;
  absent: number;
  late: number;
  excused: number;
}

export interface MarkedDates {
  completedDates: string[];
  incompleteDates: string[];
}

export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused';