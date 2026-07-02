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
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { StatusBadge } from '@/components/common/StatusBadge'
import { CategoryStatistics } from './CategoryStatistics'
import { format } from 'date-fns'
import type { Category, CategoryStatus } from '@/types/category.types'
import { Users, BookOpen, Archive, RotateCcw, Trash2, Edit, Star, TrendingUp } from 'lucide-react'

interface CategoryDetailsDrawerProps {
  category: Category | null
  statistics?: any
  isLoading?: boolean
  isOpen: boolean
  onClose: () => void
  onEdit: (category: Category) => void
  onArchive: (id: string) => void
  onRestore: (id: string) => void
  onDelete: (id: string) => void
}

function getStatusVariant(status: CategoryStatus): 'success' | 'warning' | 'danger' | 'secondary' {
  switch (status) {
    case 'active':
      return 'success'
    case 'archived':
      return 'warning'
    case 'hidden':
      return 'danger'
    default:
      return 'secondary'
  }
}

export function CategoryDetailsDrawer({
  category,
  statistics,
  isLoading = false,
  isOpen,
  onClose,
  onEdit,
  onArchive,
  onRestore,
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

  const handleArchive = () => {
    if (confirm(`Are you sure you want to archive "${category.name}"? This will hide it from new artisan registrations.`)) {
      onArchive(category.id)
    }
  }

  const handleRestore = () => {
    if (confirm(`Are you sure you want to restore "${category.name}"?`)) {
      onRestore(category.id)
    }
  }

  const handleDelete = () => {
    if (category.artisanCount > 0) {
      alert('Cannot delete category with assigned artisans. Please archive instead.')
      return
    }
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
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Basic Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  {category.image && (
                    <img
                      src={category.image}
                      alt={category.name}
                      className="size-20 object-cover rounded-lg"
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold">{category.name}</h3>
                    <p className="text-sm text-muted-foreground">{category.slug}</p>
                    <div className="mt-2 flex items-center gap-2 flex-wrap">
                      <StatusBadge
                        status={category.status}
                        variant={getStatusVariant(category.status)}
                      />
                      {category.isFeatured && (
                        <Badge variant="secondary">
                          <Star className="size-3 mr-1" />
                          Featured
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                {category.description && (
                  <p className="text-sm text-muted-foreground">{category.description}</p>
                )}
                <div className="grid gap-2 sm:grid-cols-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Display Order:</span>
                    <span className="ml-2 font-medium">{category.displayOrder}</span>
                  </div>
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
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUp className="size-4" />
                Quick Statistics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="text-center">
                  <Users className="size-6 mx-auto mb-2 text-primary" />
                  <p className="text-2xl font-bold">{category.artisanCount}</p>
                  <p className="text-xs text-muted-foreground">Total Artisans</p>
                </div>
                <div className="text-center">
                  <BookOpen className="size-6 mx-auto mb-2 text-success" />
                  <p className="text-2xl font-bold">{category.bookingCount}</p>
                  <p className="text-xs text-muted-foreground">Total Bookings</p>
                </div>
                <div className="text-center">
                  <Star className="size-6 mx-auto mb-2 text-warning" />
                  <p className="text-2xl font-bold">4.5</p>
                  <p className="text-xs text-muted-foreground">Avg Rating</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Detailed Statistics */}
          {statistics && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Detailed Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <CategoryStatistics statistics={statistics} />
              </CardContent>
            </Card>
          )}

          {/* Admin Actions */}
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
                {category.status === 'active' ? (
                  <Button
                    variant="outline"
                    onClick={handleArchive}
                    className="flex-1 sm:flex-none"
                  >
                    <Archive className="size-4 mr-2" />
                    Archive
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    onClick={handleRestore}
                    className="flex-1 sm:flex-none"
                  >
                    <RotateCcw className="size-4 mr-2" />
                    Restore
                  </Button>
                )}
                <Button
                  variant="danger"
                  onClick={handleDelete}
                  disabled={category.artisanCount > 0}
                  className="flex-1 sm:flex-none"
                >
                  <Trash2 className="size-4 mr-2" />
                  Delete
                </Button>
              </div>
              {category.artisanCount > 0 && (
                <p className="text-xs text-muted-foreground mt-2">
                  Cannot delete category with {category.artisanCount} assigned artisans
                </p>
              )}
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
