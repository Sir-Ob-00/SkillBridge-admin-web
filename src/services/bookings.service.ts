import { API_ENDPOINTS } from '@/constants/api-endpoints'
import type { ApiResponse } from '@/types/api.types'
import type {
  Booking,
  BookingFilters,
  PaginatedBookingResponse,
  BookingTimeline,
  BookingStatistics,
  UpdateBookingStatusPayload,
  CancelBookingPayload,
  CompleteBookingPayload,
  ResolveDisputePayload,
} from '@/types/booking.types'
import apiClient from '@/api/axios'

export async function getBookings(
  params?: BookingFilters,
): Promise<PaginatedBookingResponse> {
  const { data } = await apiClient.get<ApiResponse<Booking[]>>(
    API_ENDPOINTS.BOOKINGS.LIST,
    { params },
  )
  
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

export async function getBookingById(id: string): Promise<Booking> {
  const { data } = await apiClient.get<ApiResponse<Booking>>(
    API_ENDPOINTS.BOOKINGS.DETAILS(id),
  )
  return data.data
}

export async function updateBookingStatus(
  id: string,
  payload: UpdateBookingStatusPayload,
): Promise<Booking> {
  const { data } = await apiClient.patch<ApiResponse<Booking>>(
    API_ENDPOINTS.BOOKINGS.UPDATE_STATUS(id),
    payload,
  )
  return data.data
}

export async function cancelBooking(
  id: string,
  payload?: CancelBookingPayload,
): Promise<Booking> {
  const { data } = await apiClient.patch<ApiResponse<Booking>>(
    API_ENDPOINTS.BOOKINGS.CANCEL(id),
    payload,
  )
  return data.data
}

export async function completeBooking(
  id: string,
  payload?: CompleteBookingPayload,
): Promise<Booking> {
  const { data } = await apiClient.patch<ApiResponse<Booking>>(
    API_ENDPOINTS.BOOKINGS.COMPLETE(id),
    payload,
  )
  return data.data
}

export async function resolveDispute(
  id: string,
  payload: ResolveDisputePayload,
): Promise<Booking> {
  const { data } = await apiClient.patch<ApiResponse<Booking>>(
    API_ENDPOINTS.BOOKINGS.RESOLVE_DISPUTE(id),
    payload,
  )
  return data.data
}

export async function getBookingTimeline(
  id: string,
): Promise<BookingTimeline[]> {
  const { data } = await apiClient.get<ApiResponse<BookingTimeline[]>>(
    API_ENDPOINTS.BOOKINGS.TIMELINE(id),
  )
  return data.data
}

export async function getBookingStatistics(): Promise<BookingStatistics> {
  const { data } = await apiClient.get<ApiResponse<BookingStatistics>>(
    API_ENDPOINTS.BOOKINGS.STATISTICS,
  )
  return data.data
}

export async function exportBookings(
  params?: BookingFilters,
): Promise<Blob> {
  const { data } = await apiClient.get<Blob>(
    API_ENDPOINTS.BOOKINGS.EXPORT,
    {
      params,
      responseType: 'blob',
    },
  )
  return data
}
