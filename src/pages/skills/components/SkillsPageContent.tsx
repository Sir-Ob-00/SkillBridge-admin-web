import { useState, useMemo } from 'react'
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
import { SkillFormDrawer } from '@/components/skills/SkillFormDrawer'
import { SkillDetailsDrawer } from '@/components/skills/SkillDetailsDrawer'
import {
  getSkills,
  createSkill,
  updateSkill,
  deleteSkill,
} from '@/services/skills.service'
import { getCategories } from '@/services/categories.service'
import type { Skill, SkillFilters, SkillForm } from '@/types/skill.types'
import type { Category } from '@/types/category.types'
import { format } from 'date-fns'
import { Search, MoreVertical, Eye, Edit, Trash2, Plus } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import toast from 'react-hot-toast'

export default function Skills() {
  const queryClient = useQueryClient()
  const [filters, setFilters] = useState<SkillFilters>({
    categoryId: undefined,
    activeOnly: undefined,
  })
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null)
  const [isFormDrawerOpen, setIsFormDrawerOpen] = useState(false)
  const [isDetailsDrawerOpen, setIsDetailsDrawerOpen] = useState(false)

  const { data: skills = [], isLoading: isLoadingSkills, error: skillsError, refetch: refetchSkills } = useQuery({
    queryKey: ['skills', filters],
    queryFn: () => getSkills(filters),
  })

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: () => getCategories(),
  })

  const createMutation = useMutation({
    mutationFn: (data: SkillForm) => createSkill(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skills'] })
      toast.success('Skill created successfully')
      setIsFormDrawerOpen(false)
    },
    onError: () => {
      toast.error('Failed to create skill')
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<SkillForm> }) => updateSkill(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skills'] })
      toast.success('Skill updated successfully')
      setIsFormDrawerOpen(false)
    },
    onError: () => {
      toast.error('Failed to update skill')
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteSkill,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skills'] })
      toast.success('Skill deleted successfully')
      setIsDetailsDrawerOpen(false)
    },
    onError: () => {
      toast.error('Failed to delete skill')
    },
  })

  const handleCategoryFilterChange = (categoryId: string | undefined) => {
    setFilters((prev) => ({ ...prev, categoryId }))
  }

  const handleActiveFilterChange = (activeOnly: boolean | undefined) => {
    setFilters((prev) => ({ ...prev, activeOnly }))
  }

  const handleCreate = () => {
    setSelectedSkill(null)
    setIsFormDrawerOpen(true)
  }

  const handleEdit = (skill: Skill) => {
    setSelectedSkill(skill)
    setIsFormDrawerOpen(true)
  }

  const handleViewDetails = (skill: Skill) => {
    setSelectedSkill(skill)
    setIsDetailsDrawerOpen(true)
  }

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id)
  }

  const handleFormSubmit = (data: SkillForm) => {
    if (selectedSkill) {
      updateMutation.mutate({ id: selectedSkill.id, data })
    } else {
      createMutation.mutate(data)
    }
  }

  const handleResetFilters = () => {
    setFilters({ categoryId: undefined, activeOnly: undefined })
  }

  const stats = useMemo(() => {
    const total = skills.length
    const active = skills.filter((s) => s.active).length
    const inactive = total - active
    return { total, active, inactive }
  }, [skills])

  const categoryName = (categoryId: string) => {
    const cat = categories.find((c) => c.id === categoryId)
    return cat?.name ?? '—'
  }

  if (skillsError) {
    return (
      <PageContainer>
        <PageHeader
          title="Skills"
          description="Manage artisan skills across categories"
          actions={
            <Button onClick={handleCreate}>
              <Plus className="size-4 mr-2" />
              Add Skill
            </Button>
          }
        />
        <ErrorState
          title="Failed to load skills"
          description="There was an error fetching the skills. Please try again."
          onRetry={() => refetchSkills()}
        />
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <PageHeader
        title="Skills"
        description="Manage artisan skills across categories"
        actions={
          <Button onClick={handleCreate}>
            <Plus className="size-4 mr-2" />
            Add Skill
          </Button>
        }
      />

      {/* Statistics Cards */}
      <div className="grid gap-4 sm:grid-cols-3 mb-6">
        {isLoadingSkills ? (
          [1, 2, 3].map((i) => <Skeleton key={i} className="h-24" />)
        ) : (
          <>
            <div className="rounded-lg border border-border p-4">
              <p className="text-sm text-muted-foreground">Total Skills</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
            <div className="rounded-lg border border-border p-4">
              <p className="text-sm text-muted-foreground">Active</p>
              <p className="text-2xl font-bold text-success">{stats.active}</p>
            </div>
            <div className="rounded-lg border border-border p-4">
              <p className="text-sm text-muted-foreground">Inactive</p>
              <p className="text-2xl font-bold text-secondary">{stats.inactive}</p>
            </div>
          </>
        )}
      </div>

      {/* Filter Toolbar */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center gap-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by name..."
              className="pl-9"
              disabled
            />
          </div>
          <select
            value={filters.categoryId ?? ''}
            onChange={(e) => handleCategoryFilterChange(e.target.value || undefined)}
            className="rounded-md border border-border bg-background px-3 py-2 text-sm"
          >
            <option value="">All Categories</option>
            {categories.map((cat: Category) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          <Button
            variant="outline"
            onClick={handleResetFilters}
            disabled={!filters.categoryId && filters.activeOnly === undefined}
          >
            Reset
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={filters.activeOnly === undefined ? 'primary' : 'outline'}
            size="sm"
            onClick={() => handleActiveFilterChange(undefined)}
          >
            All
          </Button>
          <Button
            variant={filters.activeOnly === true ? 'primary' : 'outline'}
            size="sm"
            onClick={() => handleActiveFilterChange(true)}
          >
            Active
          </Button>
          <Button
            variant={filters.activeOnly === false ? 'primary' : 'outline'}
            size="sm"
            onClick={() => handleActiveFilterChange(false)}
          >
            Inactive
          </Button>
        </div>
      </div>

      {/* Table */}
      {isLoadingSkills ? (
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
      ) : skills.length > 0 ? (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Skill Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {skills.map((skill) => (
                <TableRow key={skill.id}>
                  <TableCell>
                    <span className="font-medium text-sm">{skill.name}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{categoryName(skill.categoryId)}</span>
                  </TableCell>
                  <TableCell>
                    <StatusBadge
                      status={skill.active ? 'active' : 'inactive'}
                      variant={skill.active ? 'success' : 'secondary'}
                    />
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">
                      {format(new Date(skill.createdAt), 'MMM dd, yyyy')}
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
                        <DropdownMenuItem onClick={() => handleViewDetails(skill)}>
                          <Eye className="size-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEdit(skill)}>
                          <Edit className="size-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(skill.id)}
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
          title="No skills found"
          description={
            filters.categoryId || filters.activeOnly !== undefined
              ? 'No skills match your current filters.'
              : 'No skills have been created yet.'
          }
          actionLabel={
            filters.categoryId || filters.activeOnly !== undefined
              ? 'Clear Filters'
              : 'Add Skill'
          }
          onAction={
            filters.categoryId || filters.activeOnly !== undefined
              ? handleResetFilters
              : handleCreate
          }
        />
      )}

      {/* Skill Form Drawer */}
      <SkillFormDrawer
        skill={selectedSkill}
        categories={categories}
        isOpen={isFormDrawerOpen}
        onClose={() => setIsFormDrawerOpen(false)}
        onSubmit={handleFormSubmit}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />

      {/* Skill Details Drawer */}
      <SkillDetailsDrawer
        skill={selectedSkill}
        categoryName={selectedSkill ? categoryName(selectedSkill.categoryId) : undefined}
        isOpen={isDetailsDrawerOpen}
        onClose={() => {
          setIsDetailsDrawerOpen(false)
          setSelectedSkill(null)
        }}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </PageContainer>
  )
}
