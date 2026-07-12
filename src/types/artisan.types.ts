import type { Paginated } from '@/types/api.types'

export type VerificationStatus = 'unverified' | 'verified' | 'rejected'

export interface ArtisanUser {
  id: string
  name: string
  email: string
  phone?: string | null
  profileImageUrl?: string | null
  isSuspended: boolean
}

export interface ArtisanPortfolioItem {
  id: string
  imageUrl: string
  caption?: string | null
  createdAt: string
}

export interface ArtisanSkill {
  skill: { id: string; name: string }
}

export interface ArtisanCategoryRef {
  category: { id: string; name: string }
}

export interface ArtisanService {
  id: string
  title: string
  description?: string | null
  price: string
  durationMinutes?: number
  categoryId?: string
  isActive?: boolean
  createdAt: string
  updatedAt: string
  category?: { id: string; name: string }
}

export interface ArtisanAvailability {
  id: string
  day: string
  startTime: string
  endTime: string
}

export interface Artisan {
  id: string
  userId: string
  businessName: string | null
  bio?: string | null
  pricingFrom?: string | null
  location?: string | null
  rating?: string | null
  reviewCount?: number
  applicationStatus: string
  isSuspended: boolean
  rejectionReason?: string | null
  reviewNotes?: string | null
  reviewedByAdminId?: string | null
  reviewedAt?: string | null
  submittedAt?: string | null
  createdAt: string
  updatedAt: string
  verification: VerificationStatus | string
  user: ArtisanUser
  portfolio?: ArtisanPortfolioItem[]
  skills?: ArtisanSkill[]
  categories?: ArtisanCategoryRef[]
  services?: ArtisanService[]
  availability?: ArtisanAvailability[]
  verificationDoc?: unknown | null
}

export type ArtisanStatus = 'active' | 'suspended'

export interface ArtisanFilters {
  status?: string
  search?: string
  page?: number
  limit?: number
}

export interface ArtisanStatistics {
  total: number
  active: number
  pending: number
  rejected: number
  suspended: number
}

export type PaginatedArtisanResponse = Paginated<Artisan>

export interface ArtisanDetails extends Artisan {}

/** Derives the display status from the backend `isSuspended` flag. */
export function artisanStatus(artisan: { isSuspended?: boolean }): ArtisanStatus {
  return artisan.isSuspended ? 'suspended' : 'active'
}

export function artisanVerificationVariant(
  status: string,
): 'success' | 'warning' | 'danger' | 'secondary' {
  switch (status) {
    case 'verified':
      return 'success'
    case 'rejected':
      return 'danger'
    case 'unverified':
      return 'secondary'
    default:
      return 'secondary'
  }
}

export function artisanStatusVariant(
  status: ArtisanStatus,
): 'success' | 'warning' {
  return status === 'active' ? 'success' : 'warning'
}
