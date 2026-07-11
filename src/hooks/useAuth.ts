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
      // Network / HTTP errors (e.g. 401) throw here — these are the only
      // failures that represent bad credentials or an unreachable API.
      const response = await loginApi(credentials)

      // Debug: Log the full login response
      console.log('[AUTH DEBUG] Login response:', JSON.stringify(response, null, 2))

      if (!response?.accessToken || !response?.user) {
        console.error('[AUTH ERROR] Malformed login response:', response)
        throw new Error('Malformed login response: missing token or user')
      }

      // Persist tokens + user and flip auth state. These are local operations
      // and must never be surfaced to the user as a credentials error.
      try {
        setAuth(response.accessToken, response.refreshToken ?? null, response.user)
        console.log('[AUTH DEBUG] Auth state set successfully')
        console.log('[AUTH DEBUG] Access token (first 20 chars):', response.accessToken.substring(0, 20) + '...')
        
        // Wait for Zustand persist to complete before navigating
        // This prevents race conditions where dashboard loads before token is persisted
        await new Promise(resolve => setTimeout(resolve, 100))
        
        console.log('[AUTH DEBUG] Delay complete, navigating to dashboard')
      } catch (stateError) {
        console.error('[AUTH ERROR] Failed to persist auth state after login', stateError)
        throw new Error('Failed to persist authentication state')
      }

      // Navigate to dashboard AFTER auth state is persisted
      navigate(APP_ROUTES.DASHBOARD)

      try {
        const profile = await getCurrentAdmin()
        setAdmin(profile)
        console.log('[AUTH DEBUG] Profile fetched successfully')
      } catch (error) {
        console.warn('[AUTH WARN] Profile fetch failed; login token is still valid', error)
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
