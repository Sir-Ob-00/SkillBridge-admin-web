import { useTheme } from '@/hooks/useTheme'

interface ThemeProviderProps {
  children: React.ReactNode
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  // Applies the current theme and keeps it in sync with the system preference.
  useTheme()

  return children
}
