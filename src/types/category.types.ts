export interface Category {
  id: string
  name: string
  active: boolean
  createdAt: string
  updatedAt: string
}

export interface CategoryStatistics {
  total: number
  active: number
  inactive: number
}

export interface CategoryForm {
  name: string
  active: boolean
}

export interface CategoryFilters {
  search?: string
  active?: boolean
  page?: number
  limit?: number
}

export type CategoryList = Category[]
