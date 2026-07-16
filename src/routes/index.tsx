import { lazy, Suspense } from 'react'
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from 'react-router-dom'
import { APP_ROUTES, DASHBOARD_ROUTES } from '@/config/routes'
import { Loader } from '@/components/common/Loader'
import { ProtectedRoute } from '@/routes/ProtectedRoute'
import { AuthLayout } from '@/layouts/AuthLayout'
import { DashboardLayout } from '@/layouts/DashboardLayout'

const Login = lazy(() => import('@/pages/auth/Login'))
const ForgotPassword = lazy(() => import('@/pages/auth/ForgotPassword'))
const Dashboard = lazy(() => import('@/pages/dashboard/Dashboard'))
const Students = lazy(() => import('@/pages/students/Students'))
const Artisans = lazy(() => import('@/pages/artisans/Artisans'))
const Skills = lazy(() => import('@/pages/skills/Skills'))
const Verifications = lazy(() => import('@/pages/verifications/Verifications'))
const Categories = lazy(() => import('@/pages/categories/Categories'))
const Bookings = lazy(() => import('@/pages/bookings/Bookings'))
const Reviews = lazy(() => import('@/pages/reviews/Reviews'))
const Reports = lazy(() => import('@/pages/reports/Reports'))
const Analytics = lazy(() => import('@/pages/analytics/Analytics'))
const Settings = lazy(() => import('@/pages/settings/Settings'))
const Admins = lazy(() => import('@/pages/admins/Admins'))
const AuditLogs = lazy(() => import('@/pages/audit-logs/AuditLogs'))
const NotFound = lazy(() => import('@/pages/errors/NotFound'))
const Unauthorized = lazy(() => import('@/pages/errors/Unauthorized'))

function LazyPage({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<Loader fullScreen label="Loading page" />}>
      {children}
    </Suspense>
  )
}

const router = createBrowserRouter([
  {
    path: APP_ROUTES.ROOT,
    element: <Navigate to={APP_ROUTES.LOGIN} replace />,
  },
  {
    element: <AuthLayout />,
    children: [
      {
        path: APP_ROUTES.LOGIN,
        element: (
          <LazyPage>
            <Login />
          </LazyPage>
        ),
      },
      {
        path: APP_ROUTES.FORGOT_PASSWORD,
        element: (
          <LazyPage>
            <ForgotPassword />
          </LazyPage>
        ),
      },
    ],
  },
  {
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: DASHBOARD_ROUTES.HOME,
        element: (
          <LazyPage>
            <Dashboard />
          </LazyPage>
        ),
      },
      {
        path: DASHBOARD_ROUTES.STUDENTS,
        element: (
          <LazyPage>
            <Students />
          </LazyPage>
        ),
      },
      {
        path: DASHBOARD_ROUTES.ARTISANS,
        element: (
          <LazyPage>
            <Artisans />
          </LazyPage>
        ),
      },
      {
        path: DASHBOARD_ROUTES.CATEGORIES,
        element: (
          <LazyPage>
            <Categories />
          </LazyPage>
        ),
      },
      {
        path: DASHBOARD_ROUTES.SKILLS,
        element: (
          <LazyPage>
            <Skills />
          </LazyPage>
        ),
      },
      {
        path: DASHBOARD_ROUTES.VERIFICATION,
        element: (
          <LazyPage>
            <Verifications />
          </LazyPage>
        ),
      },
      {
        path: DASHBOARD_ROUTES.BOOKINGS,
        element: (
          <LazyPage>
            <Bookings />
          </LazyPage>
        ),
      },
      {
        path: DASHBOARD_ROUTES.REVIEWS,
        element: (
          <LazyPage>
            <Reviews />
          </LazyPage>
        ),
      },
      {
        path: DASHBOARD_ROUTES.REPORTS,
        element: (
          <LazyPage>
            <Reports />
          </LazyPage>
        ),
      },
      {
        path: DASHBOARD_ROUTES.ANALYTICS,
        element: (
          <LazyPage>
            <Analytics />
          </LazyPage>
        ),
      },
      {
        path: DASHBOARD_ROUTES.SETTINGS,
        element: (
          <LazyPage>
            <Settings />
          </LazyPage>
        ),
      },
      {
        path: DASHBOARD_ROUTES.ADMINS,
        element: (
          <LazyPage>
            <Admins />
          </LazyPage>
        ),
      },
      {
        path: DASHBOARD_ROUTES.AUDIT_LOGS,
        element: (
          <LazyPage>
            <AuditLogs />
          </LazyPage>
        ),
      },
    ],
  },
  {
    path: APP_ROUTES.UNAUTHORIZED,
    element: (
      <LazyPage>
        <Unauthorized />
      </LazyPage>
    ),
  },
  {
    path: APP_ROUTES.NOT_FOUND,
    element: (
      <LazyPage>
        <NotFound />
      </LazyPage>
    ),
  },
])

export function AppRouter() {
  return <RouterProvider router={router} />
}

