export type StudentStatus = 'active' | 'suspended' | 'deleted'

export interface Student {
  id: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  avatar?: string | null
  status: StudentStatus
  joinedAt: string
  totalBookings: number
  completedBookings: number
  cancelledBookings: number
  lastActiveAt?: string
  location?: string
}

export interface StudentFilters {
  search?: string
  status?: StudentStatus
  page?: number
  limit?: number
}

export interface PaginatedStudentResponse {
  data: Student[]
  meta: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface StudentBookingSummary {
  id: string
  serviceName: string
  artisanName: string
  status: string
  scheduledDate: string
  amount: number
}

export interface StudentDetails extends Student {
  bookings: StudentBookingSummary[]
}
