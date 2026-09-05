/**
 * Explicit API paths for a single Axios instance (baseURL = API_BASE_URL).
 * Auth / Sanctum / broadcasting live at the server root; the rest under /api.
 */

const api = (path: string) => {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `/api${normalized}`;
};

export const API_ENDPOINTS = {
  AUTH: {
    CSRF_COOKIE: '/sanctum/csrf-cookie',
    LOGIN: '/login',
    LOGOUT: '/logout',
    REGISTER: '/register',
    FORGOT_PASSWORD: '/forgot-password',
    RESET_PASSWORD: '/reset-password',
    VERIFICATION: '/email/verification-notification',
    /** Authenticated user profile (Sanctum SPA) */
    USER: api('/user'),
  },
  BROADCASTING: {
    AUTH: '/broadcasting/auth',
  },
  CURRENT_USER: {
    CHANGE_PASSWORD: api('/current-user/change-password'),
  },
  SCHEDULES: api('/schedules'),
  ATTENDANCE: {
    RECORD: api('/record'),
    CURRENT_STUDENT: api('/attendance/last-attendance'),
    HISTORY: api('/attendance/all-attendances'),
    RECENT_READINGS: api('/attendance/recent-readings'),
    DAILY: api('/attendance/daily'),
    DAILY_STATUSES: api('/attendance/daily-statuses'),
    SETTINGS: api('/attendance/settings'),
  },
  READER: {
    STATUS: api('/reader/status'),
    SLOTS: api('/reader/slots'),
    CONFIG: api('/reader/config'),
    SLOT: (id: number) => api(`/reader/slots/${id}`),
    SLOT_ARM: (id: number) => api(`/reader/slots/${id}/arm`),
    SLOT_START_PAIRING: (id: number) => api(`/reader/slots/${id}/start-pairing`),
    SLOTS_CANCEL_PAIRING: api('/reader/slots/cancel-pairing'),
    SLOTS_ARM_ALL: api('/reader/slots/arm-all'),
  },
  CLASS_STUDENTS: (scheduleId: number, date: string) =>
    api(`/class/${scheduleId}/date/${date}`),
  STUDENTS: api('/students'),
  STUDENT_PHOTO_STATUS: (id: number) => api(`/students/${id}/photo-status`),
  STUDENT_PHOTO_UPLOAD: (id: number) => api(`/students/${id}/photo`),
  ALL_STUDENTS: api('/all-students'),
  GRADES: api('/students/grades'),
  STUDENTS_BY_GRADE: (grade_id: number) => api(`/students/grades/${grade_id}`),
  CREDENTIAL_CLASS_GROUPS: (gradeId: number) =>
    api(`/students/credentials/grades/${gradeId}/class-groups`),
  CREDENTIAL_ROWS: (classGroupId: number) =>
    api(`/students/credentials/class-groups/${classGroupId}/rows`),
  CREDENTIAL_EXPORT: (classGroupId: number) =>
    api(`/students/credentials/class-groups/${classGroupId}/export`),
  CREDENTIAL_PHOTOS_ZIP: (classGroupId: number) =>
    api(`/students/credentials/class-groups/${classGroupId}/photos-zip`),
  CREDENTIAL_TRACKING: (studentId: number) =>
    api(`/students/credentials/${studentId}/tracking`),
  NOTIFICATIONS: {
    LIST: api('/notifications'),
    UNREAD_COUNT: api('/notifications/unread-count'),
    MARK_READ: (id: string) => api(`/notifications/${id}/read`),
    READ_ALL: api('/notifications/read-all'),
  },
  ADMISSION: {
    PRE_ENROLLMENT: api('/admissions/pre-enrollment'),
    CYCLES: api('/admissions/cycles'),
    CYCLE_ACTIVATE: (id: number) => api(`/admissions/cycles/${id}/activate`),
    CYCLE_CLOSE: (id: number) => api(`/admissions/cycles/${id}/close`),
    CYCLE_REOPEN: (id: number) => api(`/admissions/cycles/${id}/reopen`),
    CYCLE_DELETE: (id: number) => api(`/admissions/cycles/${id}`),
    STATUS: api('/admissions/status'),
    PRE_ENROLLMENTS: api('/admissions/pre-enrollments'),
    PRE_ENROLLMENT_EXPORT: api('/admissions/pre-enrollments/export'),
    PRE_ENROLLMENT_INITIAL_REVIEW: (id: number) =>
      api(`/admissions/pre-enrollments/${id}/initial-review`),
    CONVERSION_BATCHES: api('/admissions/conversion-batches'),
    CONVERSION_BATCH: (id: number) => api(`/admissions/conversion-batches/${id}`),
    CONVERSION_BATCH_RETRY_FAILED: (id: number) =>
      api(`/admissions/conversion-batches/${id}/retry-failed`),
    ENROLLMENTS_PENDING_DECISIONS: api('/admissions/enrollments/pending-decisions'),
    ENROLLMENT_PROMOTION_DECISION: (enrollmentId: number) =>
      api(`/admissions/enrollments/${enrollmentId}/promotion-decision`),
    FIRST_GRADE_GROUP_ASSIGNMENT: api(
      '/admissions/enrollments/first-grade-group-assignment'
    ),
    INTAKE_SETTINGS: api('/admissions/intake-settings'),
    FIRST_GRADE_GROUPS: (academicYearId: number) =>
      api(`/admissions/academic-years/${academicYearId}/first-grade-groups`),
  },
  ACADEMIC_YEARS: {
    LIST: api('/academic-years'),
    DETAIL: (id: number) => api(`/academic-years/${id}`),
    ACTIVATE: (id: number) => api(`/academic-years/${id}/activate`),
    GENERATE_GROUPS: (id: number) => api(`/academic-years/${id}/generate-groups`),
    PROMOTE: api('/academic-years/promote'),
  },
  SCHOOL: {
    RE_ENROLLMENT: {
      PERIODS: api('/school/re-enrollment/periods'),
      PERIOD: (id: number) => api(`/school/re-enrollment/periods/${id}`),
      PERIOD_OPEN: (id: number) => api(`/school/re-enrollment/periods/${id}/open`),
      PERIOD_CLOSE: (id: number) => api(`/school/re-enrollment/periods/${id}/close`),
      PERIOD_DASHBOARD: (id: number) =>
        api(`/school/re-enrollment/periods/${id}/dashboard`),
      PERIOD_HISTORY: (id: number) =>
        api(`/school/re-enrollment/periods/${id}/history`),
      PERIOD_ADVANCE: (id: number) =>
        api(`/school/re-enrollment/periods/${id}/advance-step`),
      PERIOD_PROMOTE: (id: number) =>
        api(`/school/re-enrollment/periods/${id}/promote`),
      PERIOD_FINALIZE: (id: number) =>
        api(`/school/re-enrollment/periods/${id}/finalize`),
      APPLICATIONS: (periodId: number) =>
        api(`/school/re-enrollment/periods/${periodId}/applications`),
      APPLICATION: (periodId: number, applicationId: number) =>
        api(
          `/school/re-enrollment/periods/${periodId}/applications/${applicationId}`
        ),
    },
  },
  USERS: {
    LIST: api('/users'),
    DETAIL: (id: number) => api(`/users/${id}`),
    UPDATE: (id: number) => api(`/users/${id}`),
    DELETE: (id: number) => api(`/users/${id}`),
    CHANGE_PASSWORD: (id: number) => api(`/users/${id}/change-password`),
    RESEND_VERIFICATION: (id: number) => api(`/users/${id}/resend-verification`),
  },
  ROLES: api('/roles'),
  PERMISSIONS: api('/permissions'),
  CONTENT: {
    /** Batch image upload shared by announcements, galleries and events */
    MEDIA: api('/content/media'),
  },
  ANNOUNCEMENTS: {
    GET_ALL: api('/announcements'),
    GET_ONE: (id: string | number) => api(`/announcements/${id}`),
    CREATE: api('/announcements'),
    UPDATE: (id: string | number) => api(`/announcements/${id}`),
    DELETE: (id: string | number) => api(`/announcements/${id}`),
  },
  EVENTS: {
    GET_ALL: api('/events'),
    GET_ONE: (id: string | number) => api(`/events/${id}`),
    CREATE: api('/events'),
    UPDATE: (id: string | number) => api(`/events/${id}`),
    DELETE: (id: string | number) => api(`/events/${id}`),
  },
  GALLERIES: {
    GET_ALL: api('/galleries'),
    GET_ONE: (id: string | number) => api(`/galleries/${id}`),
    CREATE: api('/galleries'),
    UPDATE: (id: string | number) => api(`/galleries/${id}`),
    DELETE: (id: string | number) => api(`/galleries/${id}`),
  },
} as const;
