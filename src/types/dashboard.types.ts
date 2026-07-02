export interface DashboardResponse {
  users: UsersStats
  bookings: BookingsStats
  revenue: RevenueStats
  verification: VerificationStats
  ratings: RatingsStats
  recentActivity: RecentActivityItem[]
  topCategories: TopCategory[]
  topArtisans: TopArtisan[]
}

export interface UsersStats {
  students: number
  artisans: number
  admins: number
}

export interface BookingsStats {
  total: number
  pending: number
  completed: number
  cancelled: number
}

export interface RevenueStats {
  today: number
  monthly: number
  total: number
}

export interface VerificationStats {
  pending: number
  approved: number
  rejected: number
}

export interface RatingsStats {
  average: number
  totalReviews: number
}

export interface RecentActivityItem {
  id: string
  type: string
  message: string
  createdAt: string
}

export interface TopCategory {
  name: string
  count: number
}

export interface TopArtisan {
  id: string
  name: string
  rating: number
  bookings: number
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
