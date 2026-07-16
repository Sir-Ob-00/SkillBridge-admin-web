export const APP_ROUTES = {
  ROOT: '/',
  LOGIN: '/login',
  FORGOT_PASSWORD: '/forgot-password',
  DASHBOARD: '/dashboard',
  UNAUTHORIZED: '/unauthorized',
  NOT_FOUND: '*',
} as const

export const DASHBOARD_ROUTES = {
  HOME: '/dashboard',
  STUDENTS: '/dashboard/students',
  ARTISANS: '/dashboard/artisans',
  CATEGORIES: '/dashboard/categories',
  SKILLS: '/dashboard/skills',
  VERIFICATION: '/dashboard/verification',
  BOOKINGS: '/dashboard/bookings',
  REVIEWS: '/dashboard/reviews',
  REPORTS: '/dashboard/reports',
  ANALYTICS: '/dashboard/analytics',
  SETTINGS: '/dashboard/settings',
  ADMINS: '/dashboard/admins',
  AUDIT_LOGS: '/dashboard/audit-logs',
} as const

export type AppRoute = (typeof APP_ROUTES)[keyof typeof APP_ROUTES]
export type DashboardRoute =
  (typeof DASHBOARD_ROUTES)[keyof typeof DASHBOARD_ROUTES]
