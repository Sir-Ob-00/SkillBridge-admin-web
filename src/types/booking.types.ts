import type { Paginated } from '@/types/api.types'

export type BookingStatus =
  | 'pending'
  | 'accepted'
  | 'rejected'
  | 'in_progress'
  | 'completed'
  | 'cancelled'

export interface BookingParticipantUser {
  id: string
  name: string
  profileImageUrl?: string | null
}

export interface BookingArtisan {
  user: BookingParticipantUser
}

export interface BookingStudent {
  id: string
  name: string
  profileImageUrl?: string | null
}

export interface Booking {
  id: string
  studentId: string
  artisanId: string
  serviceTitle: string
  price: string
  status: BookingStatus
  scheduledTime: string | null
  notes?: string | null
  createdAt: string
  updatedAt: string
  artisan: BookingArtisan
  student: BookingStudent
}

export interface BookingFilters {
  search?: string
  status?: BookingStatus
  page?: number
  limit?: number
}

export interface BookingStatistics {
  total: number
  revenue: number
  byStatus: Record<string, number>
}

export type PaginatedBookingResponse = Paginated<Booking>

export interface UpdateBookingStatusPayload {
  status: BookingStatus
  note?: string
}

export interface CancelBookingPayload {
  reason?: string
  note?: string
}

export interface CompleteBookingPayload {
  finalCost?: number
  note?: string
}
