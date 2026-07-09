import type { ArtisanDocument, ArtisanStatus, VerificationStatus } from '@/types/artisan.types'

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

export function getDocumentStatusVariant(
  status: ArtisanDocument['status'],
): 'success' | 'warning' | 'danger' {
  switch (status) {
    case 'approved':
      return 'success'
    case 'rejected':
      return 'danger'
    case 'pending':
    default:
      return 'warning'
  }
}

export function hasActiveArtisanFilters(filters: any): boolean {
  return Boolean(
    filters.search ||
    filters.status ||
    filters.verificationStatus ||
    filters.category ||
    filters.location ||
    filters.dateFrom ||
    filters.dateTo,
  )
}
