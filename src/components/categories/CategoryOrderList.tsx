import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { GripVertical, Save, X } from 'lucide-react'
import type { Category } from '@/types/category.types'

interface CategoryOrderListProps {
  categories: Category[]
  onSaveOrder: (orderedCategories: Category[]) => void
  onCancel: () => void
  isLoading?: boolean
}

export function CategoryOrderList({
  categories,
  onSaveOrder,
  onCancel,
  isLoading = false,
}: CategoryOrderListProps) {
  const [orderedCategories, setOrderedCategories] = useState<Category[]>([...categories])

  const handleMoveUp = (index: number) => {
    if (index === 0) return
    const newOrder = [...orderedCategories]
    const [removed] = newOrder.splice(index, 1)
    newOrder.splice(index - 1, 0, removed)
    setOrderedCategories(newOrder)
  }

  const handleMoveDown = (index: number) => {
    if (index === orderedCategories.length - 1) return
    const newOrder = [...orderedCategories]
    const [removed] = newOrder.splice(index, 1)
    newOrder.splice(index + 1, 0, removed)
    setOrderedCategories(newOrder)
  }

  const handleSave = () => {
    onSaveOrder(orderedCategories)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center justify-between">
          <span>Reorder Categories</span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={onCancel} disabled={isLoading}>
              <X className="size-4 mr-2" />
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleSave} disabled={isLoading}>
              <Save className="size-4 mr-2" />
              Save Order
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {orderedCategories.map((category, index) => (
            <div
              key={category.id}
              className="flex items-center gap-3 p-3 border border-border rounded-lg bg-background"
            >
              <GripVertical className="size-5 text-muted-foreground cursor-grab" />
              <div className="flex-1 flex items-center gap-3">
                {category.image && (
                  <img
                    src={category.image}
                    alt={category.name}
                    className="size-10 object-cover rounded"
                  />
                )}
                <div>
                  <p className="font-medium text-sm">{category.name}</p>
                  <p className="text-xs text-muted-foreground">{category.slug}</p>
                </div>
              </div>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8"
                  onClick={() => handleMoveUp(index)}
                  disabled={index === 0}
                >
                  ↑
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8"
                  onClick={() => handleMoveDown(index)}
                  disabled={index === orderedCategories.length - 1}
                >
                  ↓
                </Button>
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-4">
          This order controls how categories appear in the mobile app.
        </p>
      </CardContent>
    </Card>
  )
}
