export type AdminRole = 'super_admin' | 'admin' | 'support_staff'

export type AdminStatus = 'active' | 'inactive'

export interface AdminPermissions {
  canCreateAdmins: boolean
  canDeleteAdmins: boolean
  canChangeRoles: boolean
  canViewAdmins: boolean
  canManageSettings: boolean
}

export interface Admin {
  id: string
  name: string
  email: string
  role: AdminRole
  status: AdminStatus
  permissions: AdminPermissions
  lastLogin: string | null
  createdAt: string
  updatedAt: string
}

export interface AdminFilters {
  search?: string
  role?: AdminRole
  status?: AdminStatus
}

export interface CreateAdminPayload {
  name: string
  email: string
  role: AdminRole
  status: AdminStatus
}

export interface UpdateAdminPayload {
  name?: string
  email?: string
  role?: AdminRole
  status?: AdminStatus
}

export interface UpdateAdminStatusPayload {
  status: AdminStatus
}

export interface PaginatedAdminResponse {
  data: Admin[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface AdminStatistics {
  totalAdmins: number
  activeAdmins: number
  inactiveAdmins: number
  superAdmins: number
}
