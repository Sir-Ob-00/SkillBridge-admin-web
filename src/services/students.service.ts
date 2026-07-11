import { API_ENDPOINTS } from '@/constants/api-endpoints'
import { emptyPage, type ApiResponse } from '@/types/api.types'
import type {
  Student,
  StudentFilters,
  PaginatedStudentResponse,
  StudentStatistics,
  StudentDetails,
  StudentBookingSummary,
} from '@/types/student.types'
import apiClient from '@/api/axios'

export async function getStudents(
  params?: StudentFilters,
): Promise<PaginatedStudentResponse> {
  const { data } = await apiClient.get<ApiResponse<PaginatedStudentResponse>>(
    API_ENDPOINTS.STUDENTS.LIST,
    { params },
  )
  return data.data ?? emptyPage<Student>()
}

export async function getStudentStatistics(): Promise<StudentStatistics> {
  const { data } = await apiClient.get<ApiResponse<StudentStatistics>>(
    API_ENDPOINTS.STUDENTS.STATISTICS,
  )
  return data.data
}

export async function exportStudents(): Promise<any> {
  const { data } = await apiClient.get<ApiResponse<any>>(
    API_ENDPOINTS.STUDENTS.EXPORT,
  )
  return data.data
}

export async function updateStudent(
  id: string,
  payload: any,
): Promise<Student> {
  const { data } = await apiClient.patch<ApiResponse<Student>>(
    API_ENDPOINTS.STUDENTS.UPDATE(id),
    payload,
  )
  return data.data
}

export async function suspendStudent(id: string): Promise<Student> {
  const { data } = await apiClient.patch<ApiResponse<Student>>(
    API_ENDPOINTS.STUDENTS.SUSPEND(id),
  )
  return data.data
}

export async function unsuspendStudent(id: string): Promise<Student> {
  const { data } = await apiClient.patch<ApiResponse<Student>>(
    API_ENDPOINTS.STUDENTS.UNSUSPEND(id),
  )
  return data.data
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
