import type { Artisan, ArtisanStatus, VerificationStatus } from '@/types/artisan.types'

export function getInitials(firstName: string, lastName: string) {
  return `${firstName[0]}${lastName[0]}`.toUpperCase()
}

export function getStatusVariant(status: ArtisanStatus): 'success' | 'warning' | 'danger' | 'secondary' {
  switch (status) {
    case 'active':
      return 'success'
    case 'suspended':
      return 'warning'
    case 'rejected':
      return 'danger'
    case 'pending':
      return 'secondary'
    default:
      return 'secondary'
  }
}

export function getVerificationVariant(status: VerificationStatus): 'success' | 'warning' | 'danger' | 'secondary' {
  switch (status) {
    case 'verified':
      return 'success'
    case 'pending':
      return 'warning'
    case 'rejected':
      return 'danger'
    case 'unverified':
      return 'secondary'
    default:
      return 'secondary'
  }
}

export function hasActiveArtisanFilters(filters: {
  search?: string
  status?: ArtisanStatus
  verificationStatus?: VerificationStatus
  category?: string
}) {
  return Boolean(filters.search || filters.status || filters.verificationStatus || filters.category)
}

export function isSameArtisan(left: Artisan | null, right: Artisan | null) {
  return Boolean(left && right && left.id === right.id)
}
