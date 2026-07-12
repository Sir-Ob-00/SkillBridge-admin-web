import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { PageContainer } from '@/components/layout/PageContainer'
import { PageHeader } from '@/components/feedback/PageHeader'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/common/Table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { ErrorState } from '@/components/common/ErrorState'
import { EmptyState } from '@/components/common/EmptyState'
import { StatusBadge } from '@/components/common/StatusBadge'
import { CategoryFormDrawer } from '@/components/categories/CategoryFormDrawer'
import { CategoryDetailsDrawer } from '@/components/categories/CategoryDetailsDrawer'
import { Card, CardContent } from '@/components/ui/card'
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryStatistics,
} from '@/services/categories.service'
import type { Category, CategoryFilters, CategoryForm } from '@/types/category.types'
import { format } from 'date-fns'
import { Search, MoreVertical, Eye, Edit, Trash2, Layers, Plus } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import toast from 'react-hot-toast'

export default function Categories() {
  const queryClient = useQueryClient()
  const [filters, setFilters] = useState<CategoryFilters>({
    search: undefined,
    activeOnly: undefined,
  })
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [isFormDrawerOpen, setIsFormDrawerOpen] = useState(false)
  const [isDetailsDrawerOpen, setIsDetailsDrawerOpen] = useState(false)

  const {
    data: categoriesData,
    isLoading: isLoadingCategories,
    error: categoriesError,
    refetch: refetchCategories,
  } = useQuery({
    queryKey: ['categories', filters],
    queryFn: () => getCategories(filters),
  })

  const { data: overviewStats, isLoading: isLoadingStats } = useQuery({
    queryKey: ['category-overview-statistics'],
    queryFn: getCategoryStatistics,
  })

  const createMutation = useMutation({
    mutationFn: (data: CategoryForm) => createCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      queryClient.invalidateQueries({ queryKey: ['category-overview-statistics'] })
      toast.success('Category created successfully')
      setIsFormDrawerOpen(false)
    },
    onError: () => {
      toast.error('Failed to create category')
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: CategoryForm }) => updateCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      toast.success('Category updated successfully')
      setIsFormDrawerOpen(false)
    },
    onError: () => {
      toast.error('Failed to update category')
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      queryClient.invalidateQueries({ queryKey: ['category-overview-statistics'] })
      toast.success('Category deleted successfully')
      setIsDetailsDrawerOpen(false)
    },
    onError: () => {
      toast.error('Failed to delete category')
    },
  })

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim()
    setFilters((prev) => ({ ...prev, search: value ? value : undefined }))
  }

  const handleStatusFilterChange = (activeOnly: boolean | undefined) => {
    setFilters((prev) => ({ ...prev, activeOnly }))
  }

  const handleCreate = () => {
    setSelectedCategory(null)
    setIsFormDrawerOpen(true)
  }

  const handleEdit = (category: Category) => {
    setSelectedCategory(category)
    setIsFormDrawerOpen(true)
  }

  const handleViewDetails = (category: Category) => {
    setSelectedCategory(category)
    setIsDetailsDrawerOpen(true)
  }

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id)
  }

  const handleFormSubmit = (data: CategoryForm) => {
    if (selectedCategory) {
      updateMutation.mutate({ id: selectedCategory.id, data })
    } else {
      createMutation.mutate(data)
    }
  }

  const handleResetFilters = () => {
    setFilters({ search: undefined, activeOnly: undefined })
  }

  if (categoriesError) {
    return (
      <PageContainer>
        <PageHeader
          title="Categories"
          description="Manage artisan service categories across the SkillBridge platform"
          actions={
            <Button onClick={handleCreate}>
              <Plus className="size-4 mr-2" />
              Add Category
            </Button>
          }
        />
        <ErrorState
          title="Failed to load categories"
          description="There was an error fetching the categories. Please try again."
          onRetry={() => refetchCategories()}
        />
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <PageHeader
        title="Categories"
        description="Manage artisan service categories across the SkillBridge platform"
        actions={
          <Button onClick={handleCreate}>
            <Plus className="size-4 mr-2" />
            Add Category
          </Button>
        }
      />

      {/* Statistics Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-6">
        {isLoadingStats ? (
          [1, 2, 3].map((i) => <Skeleton key={i} className="h-24" />)
        ) : overviewStats ? (
          <>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Categories</p>
                    <p className="text-2xl font-bold">{overviewStats.total}</p>
                  </div>
                  <Layers className="size-8 text-primary" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Active Categories</p>
                    <p className="text-2xl font-bold text-success">{overviewStats.active}</p>
                  </div>
                  <Layers className="size-8 text-success" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Inactive Categories</p>
                    <p className="text-2xl font-bold text-secondary">{overviewStats.inactive}</p>
                  </div>
                  <Layers className="size-8 text-secondary" />
                </div>
              </CardContent>
            </Card>
          </>
        ) : null}
      </div>

      {/* Filter Toolbar */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center gap-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by name..."
              className="pl-9"
              value={filters.search}
              onChange={handleSearchChange}
            />
          </div>
          <Button
            variant="outline"
            onClick={handleResetFilters}
            disabled={!filters.search && filters.activeOnly === undefined}
          >
            Reset
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={filters.activeOnly === undefined ? 'primary' : 'outline'}
            size="sm"
            onClick={() => handleStatusFilterChange(undefined)}
          >
            All
          </Button>
          <Button
            variant={filters.activeOnly === true ? 'primary' : 'outline'}
            size="sm"
            onClick={() => handleStatusFilterChange(true)}
          >
            Active
          </Button>
          <Button
            variant={filters.activeOnly === false ? 'primary' : 'outline'}
            size="sm"
            onClick={() => handleStatusFilterChange(false)}
          >
            Inactive
          </Button>
        </div>
      </div>

      {/* Table */}
      {isLoadingCategories ? (
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-4 p-4 border border-border rounded-lg">
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-3 w-32" />
              </div>
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="size-8" />
            </div>
          ))}
        </div>
      ) : categoriesData && categoriesData.length > 0 ? (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categoriesData.map((category) => (
                <TableRow key={category.id}>
                  <TableCell>
                    <span className="font-medium text-sm">{category.name}</span>
                  </TableCell>
                  <TableCell>
                    <StatusBadge
                      status={category.active ? 'active' : 'inactive'}
                      variant={category.active ? 'success' : 'secondary'}
                    />
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">
                      {format(new Date(category.createdAt), 'MMM dd, yyyy')}
                    </span>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="size-8">
                          <MoreVertical className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleViewDetails(category)}>
                          <Eye className="size-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEdit(category)}>
                          <Edit className="size-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(category.id)}
                          className="text-danger"
                        >
                          <Trash2 className="size-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </>
      ) : (
        <EmptyState
          title="No categories found"
          description={
            filters.search || filters.activeOnly !== undefined
              ? 'No categories match your current filters.'
              : 'No categories have been created yet.'
          }
          actionLabel={filters.search || filters.activeOnly !== undefined ? 'Clear Filters' : 'Create Category'}
          onAction={
            filters.search || filters.activeOnly !== undefined
              ? handleResetFilters
              : handleCreate
          }
        />
      )}

      {/* Category Form Drawer */}
      <CategoryFormDrawer
        category={selectedCategory}
        isOpen={isFormDrawerOpen}
        onClose={() => setIsFormDrawerOpen(false)}
        onSubmit={handleFormSubmit}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />

      {/* Category Details Drawer */}
      <CategoryDetailsDrawer
        category={selectedCategory}
        isOpen={isDetailsDrawerOpen}
        onClose={() => {
          setIsDetailsDrawerOpen(false)
          setSelectedCategory(null)
        }}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </PageContainer>
  )
}
