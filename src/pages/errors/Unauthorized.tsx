import { Link } from 'react-router-dom'
import { ShieldAlert } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { APP_ROUTES } from '@/config/routes'

export default function Unauthorized() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 text-center">
      <div className="mb-6 rounded-full bg-danger/10 p-6 text-danger">
        <ShieldAlert className="size-12" aria-hidden="true" />
      </div>
      <h1 className="text-2xl font-bold text-foreground">Access Denied</h1>
      <p className="mt-2 max-w-md text-muted-foreground">
        You don&apos;t have permission to access this page. Contact your
        administrator if you believe this is an error.
      </p>
      <Link to={APP_ROUTES.DASHBOARD} className="mt-8">
        <Button variant="outline">Return to Dashboard</Button>
      </Link>
    </div>
  )
}
