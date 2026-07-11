import { useState, useEffect } from 'react'
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerBody,
  DrawerFooter,
  DrawerOverlay,
} from '@/components/ui/drawer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { Category, CategoryForm } from '@/types/category.types'

interface CategoryFormDrawerProps {
  category: Category | null
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: CategoryForm) => void
  isLoading?: boolean
}

export function CategoryFormDrawer({
  category,
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
}: CategoryFormDrawerProps) {
  const [formData, setFormData] = useState<CategoryForm>({
    name: '',
    active: true,
  })

  const [hasChanges, setHasChanges] = useState(false)

  useEffect(() => {
    if (category) {
      setFormData({ name: category.name, active: category.active })
    } else {
      setFormData({ name: '', active: true })
    }
    setHasChanges(false)
  }, [category, isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim()) {
      alert('Category name is required')
      return
    }
    onSubmit(formData)
  }

  const handleClose = () => {
    if (hasChanges && !confirm('You have unsaved changes. Are you sure you want to close?')) {
      return
    }
    onClose()
  }

  return (
    <Drawer>
      <DrawerOverlay open={isOpen} onClose={handleClose} />
      <DrawerContent open={isOpen}>
        <DrawerHeader>
          <DrawerTitle>{category ? 'Edit Category' : 'Create Category'}</DrawerTitle>
        </DrawerHeader>

        <DrawerBody>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Category Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                  setHasChanges(true)
                }}
                placeholder="e.g., Electrician"
                required
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="active">Active</Label>
                <p className="text-xs text-muted-foreground">
                  Inactive categories are hidden from the mobile app
                </p>
              </div>
              <input
                id="active"
                type="checkbox"
                checked={formData.active}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setFormData((prev) => ({ ...prev, active: e.target.checked }))
                  setHasChanges(true)
                }}
                className="w-4 h-4"
              />
            </div>
          </form>
        </DrawerBody>

        <DrawerFooter className="flex-col gap-3">
          <div className="flex gap-2 w-full">
            <Button
              variant="primary"
              onClick={handleSubmit}
              disabled={isLoading}
              className="flex-1"
            >
              {category ? 'Update Category' : 'Create Category'}
            </Button>
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
