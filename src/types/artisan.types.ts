export type ArtisanStatus = 'active' | 'suspended' | 'pending' | 'rejected'

export type VerificationStatus = 'unverified' | 'pending' | 'verified' | 'rejected'

export interface Artisan {
  id: string
  firstName: string
  lastName: string
  businessName: string
  email: string
  phone?: string
  avatar?: string | null
  category: string
  location?: string
  status: ArtisanStatus
  verificationStatus: VerificationStatus
  joinedAt: string
  rating: number
  totalReviews: number
  totalBookings: number
  completedBookings: number
  cancelledBookings: number
  lastActiveAt?: string
}

export interface ArtisanFilters {
  search?: string
  status?: ArtisanStatus
  verificationStatus?: VerificationStatus
  category?: string
  page?: number
  limit?: number
}

export interface PaginatedArtisanResponse {
  data: Artisan[]
  meta: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface ArtisanPortfolioItem {
  id: string
  title: string
  description: string
  imageUrl: string
  videoUrl?: string
  createdAt: string
}

export interface ArtisanReview {
  id: string
  studentName: string
  studentAvatar?: string
  rating: number
  comment: string
  createdAt: string
}

export interface ArtisanBookingSummary {
  id: string
  serviceName: string
  studentName: string
  status: string
  scheduledDate: string
  amount: number
}

export interface ArtisanDocument {
  id: string
  type: string
  name: string
  url: string
  status: 'pending' | 'approved' | 'rejected'
  submittedAt: string
  reviewedAt?: string
  reviewNote?: string
}

export interface ArtisanDetails extends Artisan {
  portfolio: ArtisanPortfolioItem[]
  reviews: ArtisanReview[]
  bookings: ArtisanBookingSummary[]
  documents: ArtisanDocument[]
}

export interface VerifyArtisanPayload {
  status: 'verified' | 'rejected'
  note?: string
}
