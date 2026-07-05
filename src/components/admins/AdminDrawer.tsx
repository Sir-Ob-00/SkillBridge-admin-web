import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerOverlay } from '@/components/ui/drawer'
import { AdminForm } from './AdminForm'
import type { AdminFormValues } from '@/types/admin.types'

interface AdminDrawerProps {
  open: boolean
  onClose: () => void
  mode: 'create' | 'edit' | 'view'
  defaultValues?: AdminFormValues
  onSubmit?: (data: AdminFormValues) => void
  isLoading?: boolean
}

export function AdminDrawer({ open, onClose, mode, defaultValues, onSubmit, isLoading }: AdminDrawerProps) {
  const readOnly = mode === 'view'

  return (
    <Drawer>
      <DrawerOverlay open={open} onClose={onClose} />
      <DrawerContent open={open} className="mx-auto max-w-md">
        <DrawerHeader>
          <DrawerTitle>
            {mode === 'create' ? 'Create New Admin' : mode === 'edit' ? 'Edit Admin' : 'View Admin'}
          </DrawerTitle>
        </DrawerHeader>
        <div className="p-6">
          <AdminForm
            defaultValues={defaultValues}
            onSubmit={(data) => onSubmit?.(data)}
            isLoading={isLoading}
            readOnly={readOnly}
          />
        </div>
      </DrawerContent>
    </Drawer>
  )
}
