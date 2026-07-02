export type ReviewStatus = 'visible' | 'hidden' | 'flagged' | 'removed'

export interface Review {
  id: string
  bookingId: string
  studentId: string
  studentFirstName: string
  studentLastName: string
  studentEmail: string
  studentPhone?: string
  studentAvatar?: string | null
  artisanId: string
  artisanFirstName: string
  artisanLastName: string
  artisanBusinessName?: string
  artisanEmail: string
  artisanPhone?: string
  artisanAvatar?: string | null
  artisanAverageRating?: number
  categoryId: string
  categoryName: string
  rating: number
  comment: string
  status: ReviewStatus
  createdAt: string
  updatedAt: string
  hiddenAt?: string
  hiddenBy?: string
  hiddenReason?: string
  flaggedAt?: string
  flaggedBy?: string
  flagReason?: string
  removedAt?: string
  removedBy?: string
  removalReason?: string
  restoredAt?: string
  restoredBy?: string
  adminNotes?: string
}

export interface ReviewHistory {
  id: string
  reviewId: string
  action: 'submitted' | 'hidden' | 'restored' | 'flagged' | 'removed' | 'note_added'
  performedBy: string
  performedAt: string
  notes?: string
  metadata?: Record<string, unknown>
}

export interface ReviewFilters {
  search?: string
  rating?: number
  status?: ReviewStatus
  categoryId?: string
  artisanId?: string
  studentId?: string
  dateFrom?: string
  dateTo?: string
  sortBy?: 'newest' | 'oldest' | 'highest_rating' | 'lowest_rating' | 'recently_updated'
  page?: number
  limit?: number
}

export interface ReviewStatistics {
  totalReviews: number
  averageRating: number
  hiddenReviews: number
  flaggedReviews: number
  removedReviews: number
  todayReviews: number
  monthReviews: number
  ratingDistribution: {
    1: number
    2: number
    3: number
    4: number
    5: number
  }
}

export interface PaginatedReviewResponse {
  data: Review[]
  meta: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface UpdateReviewStatusPayload {
  status: ReviewStatus
  note?: string
}

export interface HideReviewPayload {
  reason?: string
  note?: string
}

export interface RestoreReviewPayload {
  note?: string
}

export interface FlagReviewPayload {
  reason: string
  note?: string
}

export interface DeleteReviewPayload {
  reason: string
}
