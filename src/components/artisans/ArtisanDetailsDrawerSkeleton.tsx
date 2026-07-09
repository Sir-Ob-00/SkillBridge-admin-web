import { Drawer, DrawerBody, DrawerContent, DrawerHeader, DrawerOverlay } from '@/components/ui/drawer'
import { Skeleton } from '@/components/ui/skeleton'

interface ArtisanDetailsDrawerSkeletonProps {
  isOpen: boolean
  onClose: () => void
}

export function ArtisanDetailsDrawerSkeleton({ isOpen, onClose }: ArtisanDetailsDrawerSkeletonProps) {
  return (
    <Drawer>
      <DrawerOverlay open={isOpen} onClose={onClose} />
      <DrawerContent open={isOpen}>
        <DrawerHeader>
          <Skeleton className="h-6 w-48" />
        </DrawerHeader>
        <DrawerBody>
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <Skeleton className="size-16 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
            <Skeleton className="h-px w-full" />
            <div className="space-y-4">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          </div>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  )
}
