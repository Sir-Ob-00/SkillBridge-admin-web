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
import { CategoryIconPicker } from './CategoryIconPicker'
import { CategoryImageUpload } from './CategoryImageUpload'
import type { Category, CategoryForm, CategoryStatus } from '@/types/category.types'

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
    slug: '',
    description: '',
    icon: '',
    image: '',
    displayOrder: 0,
    isFeatured: false,
    status: 'active',
  })

  const [hasChanges, setHasChanges] = useState(false)

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name,
        slug: category.slug,
        description: category.description || '',
        icon: category.icon || '',
        image: category.image || '',
        displayOrder: category.displayOrder,
        isFeatured: category.isFeatured,
        status: category.status,
      })
    } else {
      setFormData({
        name: '',
        slug: '',
        description: '',
        icon: '',
        image: '',
        displayOrder: 0,
        isFeatured: false,
        status: 'active',
      })
    }
    setHasChanges(false)
  }, [category, isOpen])

  const handleNameChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      name: value,
      slug: value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
    }))
    setHasChanges(true)
  }

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
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleNameChange(e.target.value)}
                placeholder="e.g., Electrician"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setFormData((prev) => ({ ...prev, slug: e.target.value }))
                  setHasChanges(true)
                }}
                placeholder="e.g., electrician"
              />
              <p className="text-xs text-muted-foreground">
                Auto-generated from name. Can be manually edited.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setFormData((prev) => ({ ...prev, description: e.target.value }))
                  setHasChanges(true)
                }}
                placeholder="Brief description of the category"
              />
            </div>

            <CategoryIconPicker
              selectedIcon={formData.icon}
              onSelect={(icon) => {
                setFormData((prev) => ({ ...prev, icon }))
                setHasChanges(true)
              }}
            />

            <CategoryImageUpload
              currentImage={formData.image}
              onImageChange={(image) => {
                setFormData((prev) => ({ ...prev, image }))
                setHasChanges(true)
              }}
              onImageRemove={() => {
                setFormData((prev) => ({ ...prev, image: '' }))
                setHasChanges(true)
              }}
            />

            <div className="space-y-2">
              <Label htmlFor="displayOrder">Display Order</Label>
              <Input
                id="displayOrder"
                type="number"
                value={formData.displayOrder}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setFormData((prev) => ({ ...prev, displayOrder: parseInt(e.target.value) || 0 }))
                  setHasChanges(true)
                }}
                min="0"
              />
              <p className="text-xs text-muted-foreground">
                Lower numbers appear first in the mobile app.
              </p>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="featured">Featured Category</Label>
                <p className="text-xs text-muted-foreground">
                  Featured categories may appear on the mobile home screen
                </p>
              </div>
              <input
                id="featured"
                type="checkbox"
                checked={formData.isFeatured}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setFormData((prev) => ({ ...prev, isFeatured: e.target.checked }))
                  setHasChanges(true)
                }}
                className="w-4 h-4"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                value={formData.status}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                  setFormData((prev) => ({ ...prev, status: e.target.value as CategoryStatus }))
                  setHasChanges(true)
                }}
                className="w-full px-3 py-2 border border-border rounded-md bg-background"
              >
                <option value="active">Active</option>
                <option value="archived">Archived</option>
                <option value="hidden">Hidden</option>
              </select>
              <p className="text-xs text-muted-foreground">
                Active: Visible in mobile app | Archived: Hidden from new registrations | Hidden: Completely removed from browsing
              </p>
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
