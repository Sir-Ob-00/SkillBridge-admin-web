import type { Paginated } from '@/types/api.types'

export type StudentStatus = 'active' | 'suspended'

export interface Student {
  id: string
  name: string
  email: string
  role: string
  phone?: string | null
  profileImageUrl?: string | null
  isSuspended: boolean
  createdAt: string
  updatedAt?: string
}

export interface StudentFilters {
  search?: string
  status?: StudentStatus
  page?: number
  limit?: number
}

// GET /admin/students/statistics
export interface StudentStatistics {
  total: number
  active: number
  suspended: number
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
  bookings?: StudentBookingSummary[]
  totalBookings?: number
  completedBookings?: number
  cancelledBookings?: number
  location?: string | null
}

export type PaginatedStudentResponse = Paginated<Student>

/** Derives the display status from the backend `isSuspended` flag. */
export function studentStatus(student: {
  isSuspended?: boolean
}): StudentStatus {
  return student.isSuspended ? 'suspended' : 'active'
}
