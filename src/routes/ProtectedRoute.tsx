import { Navigate, useLocation } from 'react-router-dom'
import { APP_ROUTES } from '@/config/routes'
import { useAuthStore } from '@/store/auth.store'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const accessToken = useAuthStore((state) => state.accessToken)
  const location = useLocation()

  console.log('[PROTECTED ROUTE DEBUG] isAuthenticated:', isAuthenticated)
  console.log('[PROTECTED ROUTE DEBUG] accessToken exists:', !!accessToken)
  console.log('[PROTECTED ROUTE DEBUG] accessToken (first 20 chars):', accessToken ? accessToken.substring(0, 20) + '...' : 'null')
  console.log('[PROTECTED ROUTE DEBUG] Current path:', location.pathname)

  if (!isAuthenticated) {
    console.warn('[PROTECTED ROUTE WARN] Not authenticated, redirecting to login')
    return (
      <Navigate to={APP_ROUTES.LOGIN} state={{ from: location }} replace />
    )
  }

  console.log('[PROTECTED ROUTE DEBUG] Authentication verified, rendering children')
  return children
}
