import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCurrentAdmin, login as loginApi, logout as logoutApi } from '@/services/auth.service'
import { APP_ROUTES } from '@/config/routes'
import { useAuthStore } from '@/store/auth.store'
import type { LoginCredentials } from '@/types/auth.types'

export function useAuth() {
  const navigate = useNavigate()
  const {
    accessToken,
    admin,
    permissions,
    roles,
    isAuthenticated,
    setAuth,
    setAdmin,
    logout: clearAuth,
    hasPermission,
    hasRole,
  } = useAuthStore()

  const login = useCallback(
    async (credentials: LoginCredentials) => {
      const response = await loginApi(credentials)
      setAuth(response.accessToken, response.admin)
      navigate(APP_ROUTES.DASHBOARD)

      try {
        const profile = await getCurrentAdmin()
        setAdmin(profile)
      } catch {
        // Profile fetch failed; login token is still valid
      }
    },
    [navigate, setAuth, setAdmin],
  )

  const logout = useCallback(async () => {
    try {
      await logoutApi()
    } catch {
      // Proceed with local logout even if API fails
    } finally {
      clearAuth()
      navigate(APP_ROUTES.LOGIN)
    }
  }, [clearAuth, navigate])

  const refreshProfile = useCallback(async () => {
    const profile = await getCurrentAdmin()
    setAdmin(profile)
    return profile
  }, [setAdmin])

  return {
    accessToken,
    admin,
    permissions,
    roles,
    isAuthenticated,
    login,
    logout,
    refreshProfile,
    hasPermission,
    hasRole,
  }
}
