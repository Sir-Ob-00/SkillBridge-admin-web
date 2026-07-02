import { API_ENDPOINTS } from '@/constants/api-endpoints'
import type { ApiResponse } from '@/types/api.types'
import type {
  Student,
  StudentFilters,
  PaginatedStudentResponse,
  StudentDetails,
  StudentBookingSummary,
} from '@/types/student.types'
import apiClient from '@/api/axios'

export async function getStudents(
  params?: StudentFilters,
): Promise<PaginatedStudentResponse> {
  const { data } = await apiClient.get<ApiResponse<Student[]>>(
    API_ENDPOINTS.STUDENTS.LIST,
    { params },
  )
  
  // Transform response to match expected format
  return {
    data: data.data,
    meta: {
      page: params?.page || 1,
      limit: params?.limit || 10,
      total: data.data.length,
      totalPages: Math.ceil(data.data.length / (params?.limit || 10)),
    },
  }
}

export async function getStudentById(id: string): Promise<StudentDetails> {
  const { data } = await apiClient.get<ApiResponse<StudentDetails>>(
    API_ENDPOINTS.STUDENTS.DETAILS(id),
  )
  return data.data
}

export async function updateStudentStatus(
  id: string,
  status: 'active' | 'suspended',
): Promise<Student> {
  const { data } = await apiClient.patch<ApiResponse<Student>>(
    API_ENDPOINTS.STUDENTS.UPDATE_STATUS(id),
    { status },
  )
  return data.data
}

export async function deleteStudent(id: string): Promise<void> {
  await apiClient.delete(API_ENDPOINTS.STUDENTS.DELETE(id))
}

export async function getStudentBookings(
  id: string,
): Promise<StudentBookingSummary[]> {
  const { data } = await apiClient.get<ApiResponse<StudentBookingSummary[]>>(
    API_ENDPOINTS.STUDENTS.BOOKINGS(id),
  )
  return data.data
}
