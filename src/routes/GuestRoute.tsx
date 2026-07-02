import { Navigate } from 'react-router-dom'
import { APP_ROUTES } from '@/config/routes'
import { useAuthStore } from '@/store/auth.store'

interface GuestRouteProps {
  children: React.ReactNode
}

export function GuestRoute({ children }: GuestRouteProps) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  if (isAuthenticated) {
    return <Navigate to={APP_ROUTES.DASHBOARD} replace />
  }

  return children
}
