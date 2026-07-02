import { useEffect } from 'react'
import { applyTheme, useUiStore } from '@/store/ui.store'
import type { ThemeMode } from '@/types/common.types'

export function useTheme() {
  const { theme, setTheme } = useUiStore()

  useEffect(() => {
    applyTheme(theme)

    if (theme !== 'system') return

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = () => applyTheme('system')
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [theme])

  const cycleTheme = () => {
    const order: ThemeMode[] = ['light', 'dark', 'system']
    const currentIndex = order.indexOf(theme)
    const next = order[(currentIndex + 1) % order.length] ?? 'system'
    setTheme(next)
  }

  return { theme, setTheme, cycleTheme }
}
