export type BookingStatus = 'pending' | 'accepted' | 'rejected' | 'in_progress' | 'completed' | 'cancelled' | 'disputed'

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded' | 'partial_refund'

export interface BookingParticipant {
  id: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  avatar?: string | null
}

export interface BookingLocation {
  address: string
  city: string
  region?: string
  postalCode?: string
  gpsCoordinates?: {
    latitude: number
    longitude: number
  }
}

export interface BookingPayment {
  status: PaymentStatus
  amount: number
  currency: string
  commission: number
  netAmount: number
  paymentMethod?: string
  transactionReference?: string
  paidAt?: string
  refundStatus?: 'none' | 'requested' | 'processing' | 'completed' | 'failed'
  refundAmount?: number
  refundedAt?: string
}

export interface BookingTimeline {
  id: string
  event: 'created' | 'accepted' | 'rejected' | 'started' | 'completed' | 'cancelled' | 'disputed' | 'resolved'
  description: string
  performedBy: string
  performedAt: string
  metadata?: Record<string, unknown>
}

export interface DisputeInfo {
  reason: string
  description?: string
  evidence?: string[]
  reportedBy: string
  reportedAt: string
  status: 'open' | 'in_review' | 'resolved'
  resolution?: string
  resolvedBy?: string
  resolvedAt?: string
  adminNotes?: string
}

export interface Booking {
  id: string
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
  artisanRating?: number
  artisanVerificationStatus?: 'verified' | 'pending' | 'unverified'
  categoryId: string
  categoryName: string
  status: BookingStatus
  payment: BookingPayment
  location: BookingLocation
  scheduledDate: string
  estimatedDuration?: number
  estimatedCost?: number
  finalCost?: number
  createdAt: string
  updatedAt: string
  completedAt?: string
  cancelledAt?: string
  cancelledBy?: string
  cancellationReason?: string
  dispute?: DisputeInfo
  adminNotes?: string
  assignedAdmin?: string
}

export interface BookingFilters {
  search?: string
  status?: BookingStatus
  categoryId?: string
  studentId?: string
  artisanId?: string
  paymentStatus?: PaymentStatus
  dateFrom?: string
  dateTo?: string
  sortBy?: 'newest' | 'oldest' | 'booking_date' | 'scheduled_date' | 'status' | 'amount'
  page?: number
  limit?: number
}

export interface BookingStatistics {
  totalBookings: number
  pending: number
  activeJobs: number
  completed: number
  cancelled: number
  disputed: number
  todayBookings: number
  monthBookings: number
  totalRevenue: number
  pendingRevenue: number
}

export interface PaginatedBookingResponse {
  data: Booking[]
  meta: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

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

export interface ResolveDisputePayload {
  resolution: string
  adminNotes?: string
  decision: 'favor_student' | 'favor_artisan' | 'split'
  refundAmount?: number
}
