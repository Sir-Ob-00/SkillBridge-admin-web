export type DateRange = '7d' | '30d' | '90d' | 'custom'

export interface CategoryUsage {
  category: string
  count: number
}

export interface TopRatedArtisan {
  artisanId: string
  name: string
  rating: number
  reviewCount: number
}

export interface DashboardRatings {
  overallAverage: number
  totalReviews: number
  topRated: TopRatedArtisan[]
}

export interface DashboardAnalytics {
  totalUsers: number
  totalStudents: number
  totalArtisans: number
  totalAdmins: number
  pendingVerifications: number
  totalBookings: number
  bookingsByStatus: Record<string, number>
  averageRating: number
  totalReviews: number
  totalRevenue: number
  topCategories: CategoryUsage[]
  ratings: DashboardRatings
  revenue?: number
}
