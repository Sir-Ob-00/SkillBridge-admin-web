export type CategoryStatus = 'active' | 'archived' | 'hidden'

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  icon?: string
  image?: string
  displayOrder: number
  status: CategoryStatus
  isFeatured: boolean
  artisanCount: number
  bookingCount: number
  createdAt: string
  updatedAt: string
}

export interface CategoryStatistics {
  totalArtisans: number
  activeArtisans: number
  bookingsThisMonth: number
  completedBookings: number
  cancelledBookings: number
  averageRating: number
  revenue?: number
}

export interface CategoryForm {
  name: string
  slug: string
  description?: string
  icon?: string
  image?: string
  displayOrder?: number
  isFeatured: boolean
  status: CategoryStatus
}

export interface CategoryFilters {
  search?: string
  status?: CategoryStatus
  isFeatured?: boolean
  sortBy?: 'name' | 'newest' | 'oldest' | 'artisans' | 'bookings' | 'order'
  page?: number
  limit?: number
}

export interface CategoryOrder {
  categoryId: string
  displayOrder: number
}

export interface PaginatedCategoryResponse {
  data: Category[]
  meta: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface CategoryOverviewStatistics {
  totalCategories: number
  activeCategories: number
  featuredCategories: number
  archivedCategories: number
  totalArtisans: number
  totalBookings: number
}
