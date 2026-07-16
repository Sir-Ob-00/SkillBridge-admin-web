import {
  BarChart3,
  BookOpen,
  ClipboardList,
  FolderTree,
  LayoutDashboard,
  Settings,
  ShieldCheck,
  Star,
  UserCog,
  Users,
  Wrench,
  ScrollText,
  Flag,
  Zap,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { DASHBOARD_ROUTES } from '@/config/routes'
import { NavItem } from '@/components/navigation/NavItem'
import { cn } from '@/lib/utils'
import { env } from '@/config/env'

const navItems = [
  { label: 'Dashboard', href: DASHBOARD_ROUTES.HOME, icon: LayoutDashboard },
  { label: 'Students', href: DASHBOARD_ROUTES.STUDENTS, icon: Users },
  { label: 'Artisans', href: DASHBOARD_ROUTES.ARTISANS, icon: Wrench },
  { label: 'Categories', href: DASHBOARD_ROUTES.CATEGORIES, icon: FolderTree },
  { label: 'Skills', href: DASHBOARD_ROUTES.SKILLS, icon: Zap },
  { label: 'Artisan Verification', href: DASHBOARD_ROUTES.VERIFICATION, icon: ShieldCheck },
  { label: 'Bookings', href: DASHBOARD_ROUTES.BOOKINGS, icon: BookOpen },
  { label: 'Reviews', href: DASHBOARD_ROUTES.REVIEWS, icon: Star },
  { label: 'Reports', href: DASHBOARD_ROUTES.REPORTS, icon: Flag },
  { label: 'Analytics', href: DASHBOARD_ROUTES.ANALYTICS, icon: BarChart3 },
  { label: 'Settings', href: DASHBOARD_ROUTES.SETTINGS, icon: Settings },
  { label: 'Admins', href: DASHBOARD_ROUTES.ADMINS, icon: UserCog },
  { label: 'Audit Logs', href: DASHBOARD_ROUTES.AUDIT_LOGS, icon: ScrollText },
] as const

interface SidebarProps {
  collapsed: boolean
  mobileOpen: boolean
  onMobileClose: () => void
}

export function Sidebar({ collapsed, mobileOpen, onMobileClose }: SidebarProps) {
  const sidebarContent = (
    <aside
      className={cn(
        'flex h-full flex-col border-r border-primary/20 bg-primary text-primary-foreground',
        collapsed ? 'w-[72px]' : 'w-64',
      )}
      aria-label="Main navigation"
    >
      <div
        className={cn(
          'flex h-16 items-center border-b border-primary/20 px-4',
          collapsed && 'justify-center px-2',
        )}
      >
        <div className="flex items-center gap-2">
          <div className="flex size-9 items-center justify-center rounded-lg bg-primary-foreground text-primary">
            <ClipboardList className="size-5" aria-hidden="true" />
          </div>
          {!collapsed && (
            <div>
              <p className="text-sm font-bold text-primary-foreground">SkillBridge</p>
              <p className="text-xs text-primary-foreground/75">Admin Panel</p>
            </div>
          )}
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {navItems.map((item) => (
          <NavItem
            key={item.href}
            to={item.href}
            label={item.label}
            icon={item.icon}
            collapsed={collapsed}
            onClick={onMobileClose}
          />
        ))}
      </nav>

      {!collapsed && (
        <div className="border-t border-primary/20 p-4">
          <p className="text-xs text-primary-foreground/75">
            {env.appName} v{env.appVersion}
          </p>
        </div>
      )}
    </aside>
  )

  return (
    <>
      <div className="sticky top-0 hidden h-screen self-start lg:block">{sidebarContent}</div>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/50 lg:hidden"
              onClick={onMobileClose}
              aria-hidden="true"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed inset-y-0 left-0 z-50 lg:hidden"
            >
              {sidebarContent}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

export { navItems }
