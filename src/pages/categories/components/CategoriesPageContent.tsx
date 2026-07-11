import { useState, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { debounce } from 'lodash-es'
import { PageContainer } from '@/components/layout/PageContainer'
import { PageHeader } from '@/components/feedback/PageHeader'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/common/Table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { ErrorState } from '@/components/common/ErrorState'
import { EmptyState } from '@/components/common/EmptyState'
import { StatusBadge } from '@/components/common/StatusBadge'
import { Pagination } from '@/components/common/Pagination'
import { CategoryFormDrawer } from '@/components/categories/CategoryFormDrawer'
import { CategoryDetailsDrawer } from '@/components/categories/CategoryDetailsDrawer'
import { CategoryOrderList } from '@/components/categories/CategoryOrderList'
import { Card, CardContent } from '@/components/ui/card'
import {
  getCategories,
  createCategory,
  updateCategory,
  updateCategoryStatus,
  reorderCategories,
  deleteCategory,
  getCategoryStatistics,
} from '@/services/categories.service'
import type { Category, CategoryFilters, CategoryStatus, CategoryForm } from '@/types/category.types'
import { format } from 'date-fns'
import { Search, MoreVertical, Eye, Edit, Archive, RotateCcw, Trash2, GripVertical, Star, Layers, Plus } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import toast from 'react-hot-toast'

const getStatusVariant = (status: CategoryStatus): 'success' | 'warning' | 'danger' | 'secondary' => {
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

export default function Categories() {
  const queryClient = useQueryClient()
  const [filters, setFilters] = useState<CategoryFilters>({
    page: 1,
    limit: 10,
    search: '',
    status: undefined,
    isFeatured: undefined,
    sortBy: 'order',
  })
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [isFormDrawerOpen, setIsFormDrawerOpen] = useState(false)
  const [isDetailsDrawerOpen, setIsDetailsDrawerOpen] = useState(false)
  const [isReordering, setIsReordering] = useState(false)

  const debouncedSearch = useMemo(
    () =>
      debounce((value: string) => {
        setFilters((prev) => ({ ...prev, search: value, page: 1 }))
      }, 400),
    [],
  )

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

  const { data: categoryStatistics, isLoading: isLoadingCategoryStats } = useQuery({
    queryKey: ['category-statistics', selectedCategory?.id],
    queryFn: getCategoryStatistics,
    enabled: !!selectedCategory && isDetailsDrawerOpen,
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

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: CategoryStatus }) =>
      updateCategoryStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      queryClient.invalidateQueries({ queryKey: ['category-overview-statistics'] })
      toast.success('Category status updated successfully')
    },
    onError: () => {
      toast.error('Failed to update category status')
    },
  })

  const reorderMutation = useMutation({
    mutationFn: (orderedCategories: Category[]) => {
      const payload = orderedCategories.map((cat, index) => ({
        categoryId: cat.id,
        displayOrder: index,
      }))
      return reorderCategories(payload)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      toast.success('Category order updated successfully')
      setIsReordering(false)
    },
    onError: () => {
      toast.error('Failed to update category order')
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
    const value = e.target.value
    debouncedSearch(value)
  }

  const handleStatusFilterChange = (status: CategoryStatus | undefined) => {
    setFilters((prev) => ({ ...prev, status, page: 1 }))
  }

  const handleFeaturedFilterChange = (isFeatured: boolean | undefined) => {
    setFilters((prev) => ({ ...prev, isFeatured, page: 1 }))
  }

  const handleSortChange = (sortBy: 'name' | 'newest' | 'oldest' | 'artisans' | 'bookings' | 'order') => {
    setFilters((prev) => ({ ...prev, sortBy, page: 1 }))
  }

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }))
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

  const handleArchive = (id: string) => {
    statusMutation.mutate({ id, status: 'archived' })
  }

  const handleRestore = (id: string) => {
    statusMutation.mutate({ id, status: 'active' })
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
    setFilters({ page: 1, limit: 10, search: '', status: undefined, isFeatured: undefined, sortBy: 'order' })
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
          [1, 2, 3, 4, 5, 6].map((i) => <Skeleton key={i} className="h-24" />)
        ) : overviewStats ? (
          <>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Categories</p>
                    <p className="text-2xl font-bold">{overviewStats.totalCategories}</p>
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
                    <p className="text-2xl font-bold text-success">{overviewStats.activeCategories}</p>
                  </div>
                  <Layers className="size-8 text-success" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Featured Categories</p>
                    <p className="text-2xl font-bold text-warning">{overviewStats.featuredCategories}</p>
                  </div>
                  <Star className="size-8 text-warning" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Archived Categories</p>
                    <p className="text-2xl font-bold text-secondary">{overviewStats.archivedCategories}</p>
                  </div>
                  <Archive className="size-8 text-secondary" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Artisans</p>
                    <p className="text-2xl font-bold">{overviewStats.totalArtisans}</p>
                  </div>
                  <Layers className="size-8 text-primary" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Bookings</p>
                    <p className="text-2xl font-bold">{overviewStats.totalBookings}</p>
                  </div>
                  <Layers className="size-8 text-primary" />
                </div>
              </CardContent>
            </Card>
          </>
        ) : null}
      </div>

      {/* Reorder Mode */}
      {isReordering && categoriesData?.data && (
        <CategoryOrderList
          categories={categoriesData.data}
          onSaveOrder={reorderMutation.mutate}
          onCancel={() => setIsReordering(false)}
          isLoading={reorderMutation.isPending}
        />
      )}

      {/* Filter Toolbar */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center gap-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by name, slug, or description..."
              className="pl-9"
              defaultValue={filters.search}
              onChange={handleSearchChange}
            />
          </div>
          <Button
            variant="outline"
            onClick={handleResetFilters}
            disabled={!filters.search && !filters.status && filters.isFeatured !== undefined}
          >
            Reset
          </Button>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 border-r border-border pr-2">
            <Button
              variant={filters.status === undefined ? 'primary' : 'outline'}
              size="sm"
              onClick={() => handleStatusFilterChange(undefined)}
            >
              All
            </Button>
            <Button
              variant={filters.status === 'active' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => handleStatusFilterChange('active')}
            >
              Active
            </Button>
            <Button
              variant={filters.status === 'archived' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => handleStatusFilterChange('archived')}
            >
              Archived
            </Button>
            <Button
              variant={filters.status === 'hidden' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => handleStatusFilterChange('hidden')}
            >
              Hidden
            </Button>
          </div>
          <div className="flex items-center gap-1 border-r border-border pr-2">
            <Button
              variant={filters.isFeatured === undefined ? 'primary' : 'outline'}
              size="sm"
              onClick={() => handleFeaturedFilterChange(undefined)}
            >
              All
            </Button>
            <Button
              variant={filters.isFeatured === true ? 'primary' : 'outline'}
              size="sm"
              onClick={() => handleFeaturedFilterChange(true)}
            >
              <Star className="size-4 mr-1" />
              Featured
            </Button>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant={filters.sortBy === 'order' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => handleSortChange('order')}
            >
              Order
            </Button>
            <Button
              variant={filters.sortBy === 'name' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => handleSortChange('name')}
            >
              Name
            </Button>
            <Button
              variant={filters.sortBy === 'artisans' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => handleSortChange('artisans')}
            >
              Artisans
            </Button>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsReordering(!isReordering)}
          >
            <GripVertical className="size-4 mr-1" />
            Reorder
          </Button>
        </div>
      </div>

      {/* Table */}
      {isLoadingCategories ? (
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-4 p-4 border border-border rounded-lg">
              <Skeleton className="size-10 rounded" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-3 w-32" />
              </div>
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="size-8" />
            </div>
          ))}
        </div>
      ) : categoriesData?.data && categoriesData.data.length > 0 ? (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Icon</TableHead>
                <TableHead>Category Name</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Artisans</TableHead>
                <TableHead>Bookings</TableHead>
                <TableHead>SOrder</TableHead>
                <TableHead>Featured</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categoriesData.data.map((category) => (
                <TableRow key={category.id}>
                  <TableCell>
                    {category.image ? (
                      <img
                        src={category.image}
                        alt={category.name}
                        className="size-10 object-cover rounded"
                      />
                    ) : (
                      <div className="size-10 bg-muted rounded flex items-center justify-center">
                        <Layers className="size-5 text-muted-foreground" />
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className="font-medium text-sm">{category.name}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">{category.slug}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm font-medium">{category.artisanCount}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm font-medium">{category.bookingCount}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{category.displayOrder}</span>
                  </TableCell>
                  <TableCell>
                    {category.isFeatured && (
                      <Star className="size-4 text-warning fill-warning" />
                    )}
                  </TableCell>
                  <TableCell>
                    <StatusBadge
                      status={category.status}
                      variant={getStatusVariant(category.status)}
                    />
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">
                      {format(new Date(category.updatedAt), 'MMM dd, yyyy')}
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
                        {category.status === 'active' ? (
                          <DropdownMenuItem onClick={() => handleArchive(category.id)}>
                            <Archive className="size-4 mr-2" />
                            Archive
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem onClick={() => handleRestore(category.id)}>
                            <RotateCcw className="size-4 mr-2" />
                            Restore
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem
                          onClick={() => handleDelete(category.id)}
                          disabled={category.artisanCount > 0}
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
          <div className="mt-4">
            <Pagination
              page={categoriesData.meta.page}
              totalPages={categoriesData.meta.totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </>
      ) : (
        <EmptyState
          title="No categories found"
          description={
            filters.search || filters.status || filters.isFeatured !== undefined
              ? 'No categories match your current filters.'
              : 'No categories have been created yet.'
          }
          actionLabel={filters.search || filters.status || filters.isFeatured !== undefined ? 'Clear Filters' : 'Create Category'}
          onAction={
            filters.search || filters.status || filters.isFeatured !== undefined
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
        statistics={categoryStatistics}
        isLoading={isLoadingCategoryStats}
        isOpen={isDetailsDrawerOpen}
        onClose={() => {
          setIsDetailsDrawerOpen(false)
          setSelectedCategory(null)
        }}
        onEdit={handleEdit}
        onArchive={handleArchive}
        onRestore={handleRestore}
        onDelete={handleDelete}
      />
    </PageContainer>
  )
}
