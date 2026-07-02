import { Outlet } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ClipboardList } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { env } from '@/config/env'

export function AuthLayout() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background p-4">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--color-primary)_0%,_transparent_50%)] opacity-10"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-32 -top-32 size-96 rounded-full bg-secondary/20 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-32 -left-32 size-96 rounded-full bg-primary/10 blur-3xl"
        aria-hidden="true"
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg">
            <ClipboardList className="size-7" aria-hidden="true" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">{env.appName}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Welcome back! Sign in to manage your platform.
          </p>
        </div>

        <Card className="shadow-xl">
          <CardHeader className="sr-only">
            <CardTitle>Authentication</CardTitle>
            <CardDescription>Sign in to your admin account</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <Outlet />
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
