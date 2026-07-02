import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg'
  label?: string
  className?: string
  fullScreen?: boolean
}

const sizeMap = {
  sm: 'size-4',
  md: 'size-8',
  lg: 'size-12',
}

export function Loader({
  size = 'md',
  label = 'Loading',
  className,
  fullScreen = false,
}: LoaderProps) {
  const spinner = (
    <div
      className={cn('flex flex-col items-center justify-center gap-3', className)}
      role="status"
      aria-live="polite"
      aria-label={label}
    >
      <Loader2
        className={cn('animate-spin text-primary', sizeMap[size])}
        aria-hidden="true"
      />
      <span className="sr-only">{label}</span>
    </div>
  )

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
        {spinner}
      </div>
    )
  }

  return spinner
}
