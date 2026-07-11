import {
  Bell,
  ChevronDown,
  LogOut,
  Menu,
  Moon,
  PanelLeftClose,
  PanelLeftOpen,
  Sun,
  Monitor,
  User,
} from 'lucide-react'
import { useLocation } from 'react-router-dom'
import { SearchInput } from '@/components/forms/SearchInput'
import { Breadcrumb } from '@/components/navigation/Breadcrumb'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { TooltipProvider } from '@/components/ui/tooltip'
import { useAuth } from '@/hooks/useAuth'
import { useTheme } from '@/hooks/useTheme'
import { navItems } from '@/components/layout/Sidebar'
import type { ThemeMode } from '@/types/common.types'

interface HeaderProps {
  sidebarCollapsed: boolean
  onToggleSidebar: () => void
  onMobileMenuOpen: () => void
}

const themeIcons: Record<ThemeMode, typeof Sun> = {
  light: Sun,
  dark: Moon,
  system: Monitor,
}

export function Header({
  sidebarCollapsed,
  onToggleSidebar,
  onMobileMenuOpen,
}: HeaderProps) {
  const { admin, logout } = useAuth()
  const { theme, setTheme } = useTheme()
  const location = useLocation()

  const currentNav = navItems.find((item) => item.href === location.pathname)
  const breadcrumbItems = currentNav
    ? [{ label: currentNav.label }]
    : [{ label: 'Dashboard' }]

  const displayName = admin?.name?.trim() || 'Admin'
  const initials =
    displayName
      .split(/\s+/)
      .map((part) => part.charAt(0))
      .filter(Boolean)
      .slice(0, 2)
      .join('')
      .toUpperCase() || 'AD'

  const ThemeIcon = themeIcons[theme]

  return (
    <TooltipProvider>
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 lg:px-6">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={onMobileMenuOpen}
          aria-label="Open navigation menu"
        >
          <Menu className="size-5" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="hidden lg:flex"
          onClick={onToggleSidebar}
          aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {sidebarCollapsed ? (
            <PanelLeftOpen className="size-5" />
          ) : (
            <PanelLeftClose className="size-5" />
          )}
        </Button>

        <div className="hidden flex-1 md:block">
          <Breadcrumb items={breadcrumbItems} />
        </div>

        <div className="flex flex-1 items-center justify-end gap-2 md:flex-none">
          <SearchInput
            placeholder="Search..."
            className="hidden w-64 sm:block"
            aria-label="Global search"
          />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Theme settings">
                <ThemeIcon className="size-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Theme</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {(['light', 'dark', 'system'] as ThemeMode[]).map((mode) => {
                const Icon = themeIcons[mode]
                return (
                  <DropdownMenuItem
                    key={mode}
                    onClick={() => setTheme(mode)}
                    className={theme === mode ? 'bg-accent' : ''}
                  >
                    <Icon className="size-4" />
                    <span className="capitalize">{mode}</span>
                  </DropdownMenuItem>
                )
              })}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="ghost" size="icon" aria-label="Notifications">
            <Bell className="size-5" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center gap-2 px-2"
                aria-label="Account menu"
              >
                <Avatar className="size-8">
                  {admin?.profileImageUrl && (
                    <AvatarImage src={admin.profileImageUrl} alt={displayName} />
                  )}
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
                <span className="hidden text-sm font-medium md:inline">
                  {displayName}
                </span>
                <ChevronDown className="size-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col">
                  <span>{admin?.email ?? 'admin@skillbridge.com'}</span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="size-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => void logout()}>
                <LogOut className="size-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
    </TooltipProvider>
  )
}
