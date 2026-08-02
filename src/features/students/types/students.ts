/**
 * Grade Type
 */

export interface Grade {
    grade_id: number;
    grade_name: string;
    is_active: boolean;
    total_students: number;
    total_groups: number;
}

export interface Student {
    id: number;
    name: string;
    birth_date: string;
    gender: string;
    phone: string;
    grade_level: string;
    class_group: string;
    photo_url?: string | null;
}

export interface StudentsByGradeResponse {
    success: boolean;
    data: Student[];
}

export interface Totals {
    total_grades: number;
    total_students_all_grades: number;
    total_groups: number;
}

export interface GradesResponse {
    success: boolean;
    data: {
        grades: Grade[];
        totals: Totals;
    };
}