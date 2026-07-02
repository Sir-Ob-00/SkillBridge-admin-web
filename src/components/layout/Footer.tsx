import { env } from '@/config/env'

export function Footer() {
  return (
    <footer className="border-t border-border bg-background px-4 py-4 lg:px-6">
      <div className="flex flex-col items-center justify-between gap-2 text-sm text-muted-foreground sm:flex-row">
        <p>© 2026 SkillBridge. All rights reserved.</p>
        <p>Version {env.appVersion}</p>
      </div>
    </footer>
  )
}
