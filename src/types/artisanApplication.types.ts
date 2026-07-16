export type ApplicationStatus =
  | 'PENDING_REVIEW'
  | 'UNDER_REVIEW'
  | 'ACTIVE'
  | 'REJECTED'
  | 'CHANGES_REQUESTED'

export type ApplicationAction = 'approve' | 'reject' | 'request_changes'

export interface PersonalInformation {
  firstName: string
  lastName: string
  email: string
  phone: string
  dateOfBirth: string
  address: string
  city: string
  state: string
  country: string
  profilePhoto?: string
}

export interface BusinessInformation {
  businessName: string
  businessType: string
  businessDescription: string
  yearsOfExperience: number
  taxId?: string
  registrationNumber?: string
}

export interface Skill {
  id: string
  name: string
  category: string
  proficiency: 'beginner' | 'intermediate' | 'advanced' | 'expert'
}

export interface Category {
  id: string
  name: string
  slug: string
}

export interface Pricing {
  hourlyRate: number
  currency: string
  minimumBookingHours: number
  availableForTravel: boolean
  travelRadius?: number
}

export interface Availability {
  monday: { available: boolean; startTime?: string; endTime?: string }
  tuesday: { available: boolean; startTime?: string; endTime?: string }
  wednesday: { available: boolean; startTime?: string; endTime?: string }
  thursday: { available: boolean; startTime?: string; endTime?: string }
  friday: { available: boolean; startTime?: string; endTime?: string }
  saturday: { available: boolean; startTime?: string; endTime?: string }
  sunday: { available: boolean; startTime?: string; endTime?: string }
}

export interface PortfolioItem {
  id: string
  title: string
  description: string
  images: string[]
  category: string
  completedDate: string
}

export interface StudentVerification {
  studentId: string
  institution: string
  institutionType: string
  program: string
  enrollmentYear: string
  expectedGraduation: string
  verificationImage: string
  verificationStatus: 'pending' | 'verified' | 'rejected'
}

export interface StatusHistoryItem {
  id: string
  status: ApplicationStatus
  changedBy: string
  changedAt: string
  notes?: string
}

export interface ArtisanApplication {
  id: string
  applicantId: string
  personalInformation: PersonalInformation
  businessInformation: BusinessInformation
  skills: Skill[]
  categories: Category[]
  pricing: Pricing
  availability: Availability
  portfolio: PortfolioItem[]
  studentVerification: StudentVerification
  status: ApplicationStatus
  statusHistory: StatusHistoryItem[]
  submittedAt: string
  updatedAt: string
  reviewedBy?: string
  reviewedAt?: string
  rejectionReason?: string
  changeRequests?: string[]
}

export interface ApplicationFilters {
  status?: ApplicationStatus
  search?: string
  category?: string
  dateFrom?: string
  dateTo?: string
  page?: number
  limit?: number
  sortBy?: 'submittedAt' | 'updatedAt' | 'businessName'
  sortOrder?: 'asc' | 'desc'
}

export interface PaginatedApplicationResponse {
  data: ArtisanApplication[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface ApplicationStatistics {
  pending: number
  underReview: number
  approved: number
  rejected: number
  changesRequested: number
  total: number
}

export interface ApproveApplicationPayload {
  notes?: string
}

export interface RejectApplicationPayload {
  reason: string
  notes?: string
}

export interface RequestChangesPayload {
  notes: string
  requestedChanges: string[]
}
