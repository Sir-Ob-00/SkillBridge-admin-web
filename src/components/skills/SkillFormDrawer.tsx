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
import type { Skill, SkillForm } from '@/types/skill.types'
import type { Category } from '@/types/category.types'

interface SkillFormDrawerProps {
  skill: Skill | null
  categories: Category[]
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: SkillForm) => void
  isLoading?: boolean
}

export function SkillFormDrawer({
  skill,
  categories,
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
}: SkillFormDrawerProps) {
  const [formData, setFormData] = useState<SkillForm>({
    name: '',
    categoryId: '',
    active: true,
  })

  const [hasChanges, setHasChanges] = useState(false)

  useEffect(() => {
    if (skill) {
      setFormData({
        name: skill.name,
        categoryId: skill.categoryId,
        active: skill.active,
      })
    } else {
      setFormData({
        name: '',
        categoryId: categories[0]?.id ?? '',
        active: true,
      })
    }
    setHasChanges(false)
  }, [skill, isOpen, categories])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim()) {
      alert('Skill name is required')
      return
    }
    if (!formData.categoryId) {
      alert('Category is required')
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
          <DrawerTitle>{skill ? 'Edit Skill' : 'Create Skill'}</DrawerTitle>
        </DrawerHeader>

        <DrawerBody>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Skill Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                  setHasChanges(true)
                }}
                placeholder="e.g., Fault Diagnosis"
                required
                minLength={2}
                maxLength={60}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="categoryId">Category *</Label>
              <select
                id="categoryId"
                value={formData.categoryId}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                  setFormData((prev) => ({ ...prev, categoryId: e.target.value }))
                  setHasChanges(true)
                }}
                required
                className="w-full rounded-md border border-border bg-background px-3 py-2"
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="active">Active</Label>
                <p className="text-xs text-muted-foreground">
                  Inactive skills are hidden from the mobile app
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
              {skill ? 'Update Skill' : 'Create Skill'}
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
