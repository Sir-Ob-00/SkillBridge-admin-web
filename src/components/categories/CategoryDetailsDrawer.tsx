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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { StatusBadge } from '@/components/common/StatusBadge'
import { format } from 'date-fns'
import type { Category } from '@/types/category.types'
import { Edit, Trash2 } from 'lucide-react'

interface CategoryDetailsDrawerProps {
  category: Category | null
  isLoading?: boolean
  isOpen: boolean
  onClose: () => void
  onEdit: (category: Category) => void
  onDelete: (id: string) => void
}

export function CategoryDetailsDrawer({
  category,
  isLoading = false,
  isOpen,
  onClose,
  onEdit,
  onDelete,
}: CategoryDetailsDrawerProps) {
  if (isLoading) {
    return (
      <Drawer>
        <DrawerOverlay open={isOpen} onClose={onClose} />
        <DrawerContent open={isOpen}>
          <DrawerHeader>
            <div className="h-6 w-48 bg-muted rounded" />
          </DrawerHeader>
          <DrawerBody>
            <div className="space-y-6">
              <div className="h-20 bg-muted rounded" />
              <div className="h-20 bg-muted rounded" />
            </div>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    )
  }

  if (!category) return null

  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete "${category.name}"? This action cannot be undone.`)) {
      onDelete(category.id)
    }
  }

  return (
    <Drawer>
      <DrawerOverlay open={isOpen} onClose={onClose} />
      <DrawerContent open={isOpen} className="max-w-4xl">
        <DrawerHeader>
          <DrawerTitle>Category Details</DrawerTitle>
        </DrawerHeader>

        <DrawerBody className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Basic Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold">{category.name}</h3>
                  <div className="mt-2 flex items-center gap-2 flex-wrap">
                    <StatusBadge
                      status={category.active ? 'active' : 'inactive'}
                      variant={category.active ? 'success' : 'secondary'}
                    />
                  </div>
                </div>
              </div>
              <div className="grid gap-2 sm:grid-cols-2 text-sm mt-4">
                <div>
                  <span className="text-muted-foreground">Created:</span>
                  <span className="ml-2 font-medium">
                    {format(new Date(category.createdAt), 'MMM dd, yyyy')}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Last Updated:</span>
                  <span className="ml-2 font-medium">
                    {format(new Date(category.updatedAt), 'MMM dd, yyyy')}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Admin Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  onClick={() => onEdit(category)}
                  className="flex-1 sm:flex-none"
                >
                  <Edit className="size-4 mr-2" />
                  Edit Category
                </Button>
                <Button
                  variant="danger"
                  onClick={handleDelete}
                  className="flex-1 sm:flex-none"
                >
                  <Trash2 className="size-4 mr-2" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        </DrawerBody>

        <DrawerFooter>
          <Button variant="ghost" onClick={onClose} className="w-full">
            Close
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
