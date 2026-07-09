import { Outlet, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import { Sidebar } from '@/components/layout/Sidebar'
import { useIsMobile } from '@/hooks/useMediaQuery'
import { useUiStore } from '@/store/ui.store'
import { useAdminNotifications } from '@/hooks/useAdminNotifications'

export function DashboardLayout() {
  const location = useLocation()
  const isMobile = useIsMobile()
  const {
    sidebarCollapsed,
    sidebarMobileOpen,
    toggleSidebar,
    setSidebarMobileOpen,
  } = useUiStore()

  useAdminNotifications()

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar
        collapsed={!isMobile && sidebarCollapsed}
        mobileOpen={sidebarMobileOpen}
        onMobileClose={() => setSidebarMobileOpen(false)}
      />

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <Header
          sidebarCollapsed={sidebarCollapsed}
          onToggleSidebar={toggleSidebar}
          onMobileMenuOpen={() => setSidebarMobileOpen(true)}
        />

        <main className="min-h-0 flex-1 overflow-y-auto">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="page-transition min-h-full"
          >
            <Outlet />
          </motion.div>
        </main>

        <Footer />
      </div>
    </div>
  )
}
