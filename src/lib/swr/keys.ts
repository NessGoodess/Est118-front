/**
 * SWR cache keys.
 *
 * Array keys are namespaced by their first element so a whole feature can be
 * invalidated with `invalidateKeyPrefix` without listing every variant.
 */

export const SWR_KEYS = {
  /** Current Sanctum user. Deduped across the auth and private layouts. */
  currentUser: "auth:current-user",
} as const;

/** First element of every array key, used for prefix invalidation. */
export const SWR_PREFIX = {
  usersList: "users:list",
  userDetail: "users:detail",
  admissionCycles: "admissions:cycles",
  admissionSettingsCycles: "admissions:settings-cycles",
  preEnrollments: "admissions:pre-enrollments",
  preEnrollmentDetail: "admissions:pre-enrollment",
  intakeSettings: "admissions:intake-settings",
  promotionDecisions: "admissions:promotion-decisions",
  academicYears: "academic-years:list",
  grades: "students:grades",
  studentsByGrade: "students:by-grade",
  schedules: "schedules:list",
  notifications: "notifications:feed",
  reEnrollmentPeriods: "re-enrollment:periods",
  reEnrollmentDashboard: "re-enrollment:dashboard",
} as const;

export type SwrPrefix = (typeof SWR_PREFIX)[keyof typeof SWR_PREFIX];

/** Matcher for `mutate(...)` that targets every key under one prefix. */
export function keyPrefixFilter(prefix: SwrPrefix) {
  return (key: unknown): boolean => Array.isArray(key) && key[0] === prefix;
}
