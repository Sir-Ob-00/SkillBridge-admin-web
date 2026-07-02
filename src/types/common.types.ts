export type ThemeMode = 'light' | 'dark' | 'system'

export type StatusVariant =
  | 'default'
  | 'success'
  | 'warning'
  | 'danger'
  | 'secondary'
  | 'outline'

export interface NavItem {
  label: string
  href: string
  icon: string
  badge?: string | number
}

export interface BreadcrumbItem {
  label: string
  href?: string
}

export interface SelectOption<T extends string = string> {
  label: string
  value: T
}
