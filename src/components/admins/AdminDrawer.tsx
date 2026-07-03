import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerOverlay } from '@/components/ui/drawer'
import { AdminForm } from './AdminForm'
import type { AdminRole, AdminStatus } from '@/types/admin.types'

interface AdminDrawerProps {
  open: boolean
  onClose: () => void
  mode: 'create' | 'edit'
  defaultValues?: {
    name: string
    email: string
    role: AdminRole
    status: AdminStatus
  }
  onSubmit: (data: any) => void
  isLoading?: boolean
}

export function AdminDrawer({ open, onClose, mode, defaultValues, onSubmit, isLoading }: AdminDrawerProps) {
  return (
    <Drawer>
      <DrawerOverlay open={open} onClose={onClose} />
      <DrawerContent open={open} className="max-w-md mx-auto">
        <DrawerHeader>
          <DrawerTitle>{mode === 'create' ? 'Create New Admin' : 'Edit Admin'}</DrawerTitle>
        </DrawerHeader>
        <div className="p-6">
          <AdminForm defaultValues={defaultValues} onSubmit={onSubmit} isLoading={isLoading} />
        </div>
      </DrawerContent>
    </Drawer>
  )
}
