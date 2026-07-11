import type { Paginated } from '@/types/api.types'

export interface ReviewParticipantUser {
  id: string
  name: string
  profileImageUrl?: string | null
  email?: string
}

export interface ReviewArtisan {
  user: ReviewParticipantUser
}

export interface ReviewStudent {
  id: string
  name: string
  profileImageUrl?: string | null
  email?: string
}

export interface Review {
  id: string
  bookingId: string
  studentId: string
  artisanId: string
  rating: number
  comment: string
  isFlagged: boolean
  createdAt: string
  student: ReviewStudent
  artisan: ReviewArtisan
}

export interface ReviewFilters {
  search?: string
  flagged?: boolean
  page?: number
  limit?: number
}

export interface ReviewStatistics {
  total: number
  flagged: number
  averageRating: number
}

export type PaginatedReviewResponse = Paginated<Review>
