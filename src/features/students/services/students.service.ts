import apiClient, { API_ENDPOINTS } from '@/lib/api';
import { GradesResponse, StudentsByGradeResponse } from '@/features/students/types/students';
import { StudentDetailPayload, StudentDetailResponse } from '@/features/students/types/student-profile';
import type { UpdateStudentPayload } from '@/features/students/schemas/student-update.schema';

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

/**
 * Response for the photo status of a student
 */
export interface StudentPhotoStatusResponse {
    success: boolean;
    data: {
        student_id: number;
        student_name: string;
        has_photo: boolean;
        action_label: string;
        photo_url: string | null;
        grade: string | null;
        group: string | null;
    };
}

/**
 * Fetch the photo status of a student
 */
export async function getStudentPhotoStatus(studentId: number): Promise<StudentPhotoStatusResponse> {
    const response = await apiClient.get<StudentPhotoStatusResponse>(API_ENDPOINTS.STUDENT_PHOTO_STATUS(studentId));
    return response.data;
}

/**
 * Upload a photo for a student
 */
export async function uploadStudentPhoto(studentId: number, file: File): Promise<{ success: boolean; message: string; data: { photo_url: string } }> {
    const formData = new FormData();
    formData.append('photo', file);

    const response = await apiClient.post<{ success: boolean; message: string; data: { photo_url: string } }>(
        API_ENDPOINTS.STUDENT_PHOTO_UPLOAD(studentId),
        formData,
        {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }
    );
    return response.data;
}

/**
 * Fetch the detail of a student
 */
export async function getStudentDetail(studentId: number): Promise<StudentDetailPayload> {
    const response = await apiClient.get<StudentDetailResponse>(`${API_ENDPOINTS.STUDENTS}/${studentId}`);
    return response.data.data;
}

/**
 * Partial update of student profile and/or address
 */
export async function updateStudent(
    studentId: number,
    payload: UpdateStudentPayload
): Promise<StudentDetailPayload> {
    const response = await apiClient.patch<StudentDetailResponse>(
        `${API_ENDPOINTS.STUDENTS}/${studentId}`,
        payload
    );
    return response.data.data;
}
