export interface ApiResponse<T> {
  data: T
  message?: string
  success: boolean
}

export interface ApiErrorResponse {
  message: string
  errors?: Record<string, string[]>
  statusCode?: number
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: PaginationMeta
}

/**
 * Canonical paginated payload returned by the backend inside `data`:
 * `{ items, page, totalPages, totalItems }` (note: there is NO pageSize).
 */
export interface Paginated<T> {
  items: T[]
  page: number
  totalPages: number
  totalItems: number
}

/** Safe fallback for a paginated payload when the API returns nothing. */
export function emptyPage<T>(): Paginated<T> {
  return { items: [], page: 1, totalPages: 1, totalItems: 0 }
}

export interface PaginationMeta {
  page: number
  pageSize: number
  total: number
  totalPages: number
}

export interface PaginationParams {
  page?: number
  pageSize?: number
  search?: string
}
