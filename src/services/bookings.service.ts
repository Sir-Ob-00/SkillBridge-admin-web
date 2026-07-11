import { API_ENDPOINTS } from '@/constants/api-endpoints'
import { emptyPage, type ApiResponse } from '@/types/api.types'
import type {
  Booking,
  BookingFilters,
  PaginatedBookingResponse,
  BookingStatistics,
} from '@/types/booking.types'
import apiClient from '@/api/axios'

export async function getBookings(
  params?: BookingFilters,
): Promise<PaginatedBookingResponse> {
  const { data } = await apiClient.get<ApiResponse<PaginatedBookingResponse>>(
    API_ENDPOINTS.BOOKINGS.LIST,
    { params },
  )
  return data.data ?? emptyPage<Booking>()
}

export async function getBookingById(id: string): Promise<Booking> {
  const { data } = await apiClient.get<ApiResponse<Booking>>(
    API_ENDPOINTS.BOOKINGS.DETAILS(id),
  )
  return data.data
}

export async function updateBookingStatus(
  id: string,
  payload: { status: string; note?: string },
): Promise<Booking> {
  const { data } = await apiClient.patch<ApiResponse<Booking>>(
    API_ENDPOINTS.BOOKINGS.UPDATE_STATUS(id),
    payload,
  )
  return data.data
}

export async function cancelBooking(
  id: string,
  payload?: { reason?: string; note?: string },
): Promise<Booking> {
  const { data } = await apiClient.patch<ApiResponse<Booking>>(
    API_ENDPOINTS.BOOKINGS.CANCEL(id),
    payload,
  )
  return data.data
}

export async function completeBooking(
  id: string,
  payload?: { finalCost?: number; note?: string },
): Promise<Booking> {
  const { data } = await apiClient.patch<ApiResponse<Booking>>(
    API_ENDPOINTS.BOOKINGS.COMPLETE(id),
    payload,
  )
  return data.data
}

export async function getBookingStatistics(): Promise<BookingStatistics> {
  const { data } = await apiClient.get<ApiResponse<BookingStatistics>>(
    API_ENDPOINTS.BOOKINGS.STATISTICS,
  )
  return data.data
}
