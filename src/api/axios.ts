import axios, {
  type AxiosError,
  type InternalAxiosRequestConfig,
} from 'axios'
import { env } from '@/config/env'
import { APP_ROUTES } from '@/config/routes'
import { useAuthStore } from '@/store/auth.store'

export const apiClient = axios.create({
  baseURL: env.apiBaseUrl,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 30000,
})

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = useAuthStore.getState().accessToken
    console.log('[AXIOS DEBUG] Request interceptor called')
    console.log('[AXIOS DEBUG] Token exists:', !!token)
    console.log('[AXIOS DEBUG] Token (first 20 chars):', token ? token.substring(0, 20) + '...' : 'null')
    console.log('[AXIOS DEBUG] Request URL:', config.url)
    console.log('[AXIOS DEBUG] Request method:', config.method?.toUpperCase())
    
    // Don't send Authorization header for login endpoint
    const isLoginRequest = config.url?.includes('/admin/auth/login')
    
    if (token && !isLoginRequest) {
      config.headers.Authorization = `Bearer ${token}`
      console.log('[AXIOS DEBUG] Authorization header set:', config.headers.Authorization?.substring(0, 30) + '...')
    } else if (isLoginRequest) {
      console.log('[AXIOS DEBUG] Login request - skipping Authorization header')
    } else {
      console.warn('[AXIOS WARN] No token available, Authorization header not set')
    }
    
    return config
  },
  (error: AxiosError) => {
    console.error('[AXIOS ERROR] Request interceptor error:', error)
    return Promise.reject(error)
  },
)

apiClient.interceptors.response.use(
  (response) => {
    console.log('[AXIOS DEBUG] Response success:', response.config.url, response.status)
    return response
  },
  (error: AxiosError) => {
    console.error('[AXIOS ERROR] Response error:', error.config?.url, error.response?.status)
    console.error('[AXIOS ERROR] Response data:', error.response?.data)
    
    if (error.response?.status === 401) {
      console.error('[AXIOS ERROR] 401 Unauthorized - logging out')
      const { logout } = useAuthStore.getState()
      logout()

      if (window.location.pathname !== APP_ROUTES.LOGIN) {
        window.location.href = APP_ROUTES.LOGIN
      }
    }
    return Promise.reject(error)
  },
)

export default apiClient
