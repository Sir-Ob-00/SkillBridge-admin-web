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
        console.log('[AUTH STORE DEBUG] setAuth called')
        console.log('[AUTH STORE DEBUG] Access token (first 20 chars):', accessToken ? accessToken.substring(0, 20) + '...' : 'null')
        console.log('[AUTH STORE DEBUG] Refresh token exists:', !!refreshToken)
        console.log('[AUTH STORE DEBUG] Admin:', admin)
        
        set({
          accessToken,
          refreshToken,
          admin: admin ?? null,
          permissions: [],
          roles: rolesFromAdmin(admin),
          isAuthenticated: true,
        })
        
        console.log('[AUTH STORE DEBUG] Auth state set, isAuthenticated:', true)
        
        // Verify the state was actually set
        setTimeout(() => {
          const state = get()
          console.log('[AUTH STORE DEBUG] State verification after set:')
          console.log('[AUTH STORE DEBUG] - accessToken exists:', !!state.accessToken)
          console.log('[AUTH STORE DEBUG] - isAuthenticated:', state.isAuthenticated)
          console.log('[AUTH STORE DEBUG] - admin:', state.admin)
        }, 100)
      },

      setAdmin: (admin) => {
        set({
          admin,
          permissions: [],
          roles: rolesFromAdmin(admin),
        })
      },

      logout: () => {
        console.log('[AUTH STORE DEBUG] logout called, clearing state')
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
      onRehydrateStorage: () => (state) => {
        console.log('[AUTH STORE DEBUG] Storage rehydrated')
        console.log('[AUTH STORE DEBUG] Rehydrated state:', state)
        if (state) {
          console.log('[AUTH STORE DEBUG] - accessToken exists:', !!state.accessToken)
          console.log('[AUTH STORE DEBUG] - isAuthenticated:', state.isAuthenticated)
        }
      },
    },
  ),
)
