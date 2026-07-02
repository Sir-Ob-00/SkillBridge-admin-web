import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Permission } from '@/constants/permissions'
import type { Role } from '@/constants/roles'
import type { Admin } from '@/types/auth.types'

interface AuthState {
  accessToken: string | null
  admin: Admin | null
  permissions: Permission[]
  roles: Role[]
  isAuthenticated: boolean
  setAuth: (token: string, admin: Admin) => void
  setAdmin: (admin: Admin) => void
  logout: () => void
  hasPermission: (permission: Permission) => boolean
  hasRole: (role: Role) => boolean
}

const initialState = {
  accessToken: null as string | null,
  admin: null as Admin | null,
  permissions: [] as Permission[],
  roles: [] as Role[],
  isAuthenticated: false,
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      ...initialState,

      setAuth: (token, admin) => {
        set({
          accessToken: token,
          admin,
          permissions: admin.permissions ?? [],
          roles: admin.roles ?? [],
          isAuthenticated: true,
        })
      },

      setAdmin: (admin) => {
        set({
          admin,
          permissions: admin.permissions ?? [],
          roles: admin.roles ?? [],
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
        admin: state.admin,
        permissions: state.permissions,
        roles: state.roles,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
)
