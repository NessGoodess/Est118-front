import apiClient, { API_ENDPOINTS } from '@/lib/config/api';
import { GradesResponse, StudentsByGradeResponse } from '@/lib/types/students';

/**
 * Fetch al Grades
 */
export async function getGrades(): Promise<GradesResponse> {

    const response = await apiClient.get<GradesResponse>(API_ENDPOINTS.GRADES);
    return response.data;
}

/**
 * Fetch all students by grade
 */
export async function getStudentsByGrade(grade_id: number): Promise<StudentsByGradeResponse> {
    const response = await apiClient.get<StudentsByGradeResponse>(API_ENDPOINTS.STUDENTS_BY_GRADE(grade_id));
    return response.data;
}
