// GET /admin/dashboard/overview — flat counts/summary
export interface DashboardOverview {
  totalUsers: number
  totalStudents: number
  totalArtisans: number
  totalAdmins: number
  totalBookings: number
  pendingVerifications: number
  totalReviews: number
  totalReports: number
  totalCategories: number
  revenue: number
  activeBookings: number
  completedBookings: number
  cancelledBookings: number
  bookingsByStatus?: BookingsByStatus
  reportsByStatus?: ReportsByStatus
}

export interface BookingsByStatus {
  pending: number
  accepted: number
  in_progress: number
  completed: number
  cancelled: number
  rejected: number
}

export interface ReportsByStatus {
  open: number
  resolved: number
  escalated: number
}

// GET /admin/dashboard/statistics — overview + topCategories + ratings
export interface DashboardStatistics extends DashboardOverview {
  topCategories?: TopCategory[]
  ratings?: DashboardRatings
}

export interface TopCategory {
  category: string
  count: number
}

export interface DashboardRatings {
  overallAverage: number
  totalReviews: number
  topRated: TopRatedArtisan[]
}

export interface TopRatedArtisan {
  artisanId: string
  name: string
  rating: number
  reviewCount: number
}

// GET /admin/dashboard/recent-activities — raw audit-log rows
export interface DashboardActivityLog {
  id: string
  adminId: string
  action: string
  resource: string
  resourceId: string | null
  ipAddress: string | null
  oldValue: unknown
  newValue: unknown
  createdAt: string
}

// Display shape consumed by <RecentActivity />
export interface RecentActivityItem {
  id: string
  type: string
  message: string
  createdAt: string
}

// Display shape consumed by <TopCategories />
export interface CategoryUsage {
  name: string
  count: number
}

export interface KpiCardData {
  title: string
  value: number
  description?: string
  trend?: {
    value: string
    positive?: boolean
  }
  variant?: 'success' | 'warning' | 'danger' | 'info'
}

export interface ChartDataPoint {
  name: string
  value: number
  [key: string]: string | number
}
