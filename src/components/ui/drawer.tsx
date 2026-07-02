import * as React from 'react'
import { cn } from '@/lib/utils'

const Drawer = ({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={cn('relative z-50', className)}
      {...props}
    >
      {children}
    </div>
  )
}

const DrawerContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { open?: boolean }
>(({ className, children, open = false, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        'fixed inset-y-0 right-0 z-50 w-full max-w-md border-l border-border bg-background shadow-lg transition-transform duration-300 ease-in-out',
        open ? 'translate-x-0' : 'translate-x-full',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
})
DrawerContent.displayName = 'DrawerContent'

const DrawerHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={cn('flex flex-col space-y-2 p-6 border-b border-border', className)}
      {...props}
    />
  )
}
DrawerHeader.displayName = 'DrawerHeader'

const DrawerTitle = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) => {
  return (
    <h2
      className={cn('text-lg font-semibold text-foreground', className)}
      {...props}
    />
  )
}
DrawerTitle.displayName = 'DrawerTitle'

const DrawerDescription = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) => {
  return (
    <p
      className={cn('text-sm text-muted-foreground', className)}
      {...props}
    />
  )
}
DrawerDescription.displayName = 'DrawerDescription'

const DrawerBody = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={cn('flex-1 overflow-y-auto p-6', className)}
      {...props}
    />
  )
}
DrawerBody.displayName = 'DrawerBody'

const DrawerFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={cn('flex items-center justify-end gap-2 p-6 border-t border-border', className)}
      {...props}
    />
  )
}
DrawerFooter.displayName = 'DrawerFooter'

const DrawerOverlay = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { open?: boolean; onClose?: () => void }
>(({ className, open = false, onClose, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        'fixed inset-0 z-40 bg-black/50 transition-opacity duration-300',
        open ? 'opacity-100' : 'opacity-0 pointer-events-none',
        className,
      )}
      onClick={onClose}
      {...props}
    />
  )
})
DrawerOverlay.displayName = 'DrawerOverlay'

export { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerBody, DrawerFooter, DrawerOverlay }
