export type VerificationStatus = 'pending' | 'approved' | 'rejected' | 'requires_more_info'

export interface VerificationDocument {
  id: string
  type: string
  name: string
  url: string
  thumbnailUrl?: string
  uploadedAt: string
  status: 'pending' | 'approved' | 'rejected'
  reviewedAt?: string
  reviewNote?: string
}

export interface VerificationHistory {
  id: string
  action: 'submitted' | 'opened' | 'reviewed' | 'approved' | 'rejected' | 'requested_info'
  performedBy: string
  performedAt: string
  note?: string
}

export interface AdminNote {
  id: string
  author: string
  content: string
  createdAt: string
  updatedAt?: string
}

export interface VerificationRequest {
  id: string
  artisanId: string
  artisanFirstName: string
  artisanLastName: string
  artisanBusinessName: string
  artisanEmail: string
  artisanPhone?: string
  artisanAvatar?: string | null
  category: string
  location?: string
  status: VerificationStatus
  submittedAt: string
  reviewedAt?: string
  assignedAdmin?: string
  documents: VerificationDocument[]
  portfolio: VerificationDocument[]
  history: VerificationHistory[]
  adminNotes: AdminNote[]
}

export interface VerificationFilters {
  search?: string
  status?: VerificationStatus
  category?: string
  submissionDate?: string
  sortBy?: 'newest' | 'oldest' | 'status' | 'category'
  page?: number
  limit?: number
}

export interface PaginatedVerificationResponse {
  data: VerificationRequest[]
  meta: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface VerificationStatistics {
  pendingReviews: number
  approvedToday: number
  rejectedToday: number
  requiresInformation: number
  totalVerified: number
}

export interface ApproveVerificationPayload {
  note?: string
}

export interface RejectVerificationPayload {
  reason: string
}

export interface RequestMoreInfoPayload {
  message: string
}
