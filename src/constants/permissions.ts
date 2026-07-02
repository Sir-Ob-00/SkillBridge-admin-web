export const PERMISSIONS = {
  DASHBOARD_VIEW: 'dashboard:view',
  STUDENTS_VIEW: 'students:view',
  STUDENTS_MANAGE: 'students:manage',
  ARTISANS_VIEW: 'artisans:view',
  ARTISANS_MANAGE: 'artisans:manage',
  BOOKINGS_VIEW: 'bookings:view',
  BOOKINGS_MANAGE: 'bookings:manage',
  REPORTS_VIEW: 'reports:view',
  SETTINGS_MANAGE: 'settings:manage',
  ADMINS_MANAGE: 'admins:manage',
  AUDIT_LOGS_VIEW: 'audit_logs:view',
} as const

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS]
