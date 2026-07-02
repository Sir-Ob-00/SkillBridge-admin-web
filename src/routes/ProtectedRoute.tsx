import { Navigate, useLocation } from 'react-router-dom'
import { APP_ROUTES } from '@/config/routes'
import { useAuthStore } from '@/store/auth.store'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const location = useLocation()

  if (!isAuthenticated) {
    return (
      <Navigate to={APP_ROUTES.LOGIN} state={{ from: location }} replace />
    )
  }

  return children
}
