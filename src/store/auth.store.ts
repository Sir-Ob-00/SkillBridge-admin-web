import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Permission } from '@/constants/permissions'
import type { Role } from '@/constants/roles'
import type { Admin } from '@/types/auth.types'

// The backend models each account with a single `role` string and no explicit
// permissions list, so we derive the RBAC arrays the app expects from it.
function rolesFromAdmin(admin: Admin | null): Role[] {
  return admin?.role ? ([admin.role] as Role[]) : []
}

interface AuthState {
  accessToken: string | null
  refreshToken: string | null
  admin: Admin | null
  permissions: Permission[]
  roles: Role[]
  isAuthenticated: boolean
  setAuth: (accessToken: string, refreshToken: string | null, admin: Admin) => void
  setAdmin: (admin: Admin) => void
  logout: () => void
  hasPermission: (permission: Permission) => boolean
  hasRole: (role: Role) => boolean
}

const initialState = {
  accessToken: null as string | null,
  refreshToken: null as string | null,
  admin: null as Admin | null,
  permissions: [] as Permission[],
  roles: [] as Role[],
  isAuthenticated: false,
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      ...initialState,

      setAuth: (accessToken, refreshToken, admin) => {
        set({
          accessToken,
          refreshToken,
          admin: admin ?? null,
          permissions: [],
          roles: rolesFromAdmin(admin),
          isAuthenticated: true,
        })
      },

      setAdmin: (admin) => {
        set({
          admin,
          permissions: [],
          roles: rolesFromAdmin(admin),
        })
      },

      logout: () => {
        set({ ...initialState })
      },

      hasPermission: (permission) => {
        return get().permissions.includes(permission)
      },

      hasRole: (role) => {
        return get().roles.includes(role)
      },
    }),
    {
      name: 'skillbridge-auth',
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        admin: state.admin,
        permissions: state.permissions,
        roles: state.roles,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
)
