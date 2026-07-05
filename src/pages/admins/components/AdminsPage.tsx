import { useEffect, useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { debounce } from 'lodash-es'
import { Eye, Plus, Search, Edit, Trash2, Power } from 'lucide-react'
import { PageContainer } from '@/components/layout/PageContainer'
import { PageHeader } from '@/components/feedback/PageHeader'
import { ErrorState } from '@/components/common/ErrorState'
import { EmptyState } from '@/components/common/EmptyState'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Pagination } from '@/components/common/Pagination'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/common/Table'
import { AdminStatistics } from '@/components/admins/AdminStatistics'
import { AdminStatusBadge } from '@/components/admins/AdminStatusBadge'
import { AdminDrawer } from '@/components/admins/AdminDrawer'
import {
  getAdmins,
  getAdminById,
  createAdmin,
  updateAdmin,
  updateAdminStatus,
  deleteAdmin,
} from '@/services/admins.service'
import type {
  Admin,
  AdminFilters,
  AdminFormValues,
  AdminRole,
  AdminStatus,
} from '@/types/admin.types'
import { useAuthStore } from '@/store/auth.store'
import { PERMISSIONS } from '@/constants/permissions'
import { ROLES } from '@/constants/roles'
import toast from 'react-hot-toast'

const PAGE_SIZE = 10

function canManageAdmins(roles: string[], permissions: string[]) {
  return roles.includes(ROLES.SUPER_ADMIN) || permissions.includes(PERMISSIONS.ADMINS_MANAGE)
}

function canDeleteAdmins(roles: string[], permissions: string[]) {
  return roles.includes(ROLES.SUPER_ADMIN) || permissions.includes(PERMISSIONS.ADMINS_MANAGE)
}

function getRoleLabel(role: AdminRole): string {
  return role.replace(/_/g, ' ').replace(/\b\w/g, (character) => character.toUpperCase())
}


export default function Admins() {
  const queryClient = useQueryClient()
  const currentAdmin = useAuthStore((state) => state.admin)
  const currentRoles = useAuthStore((state) => state.roles)
  const currentPermissions = useAuthStore((state) => state.permissions)
  const hasManageAccess = canManageAdmins(currentRoles, currentPermissions)
  const hasDeleteAccess = canDeleteAdmins(currentRoles, currentPermissions)

  const [searchInput, setSearchInput] = useState('')
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState<AdminRole | ''>('')
  const [statusFilter, setStatusFilter] = useState<AdminStatus | ''>('')
  const [page, setPage] = useState(1)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [drawerMode, setDrawerMode] = useState<'create' | 'edit' | 'view'>('view')
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [statusDialogOpen, setStatusDialogOpen] = useState(false)
  const [pendingStatusAction, setPendingStatusAction] = useState<{ admin: Admin; status: AdminStatus } | null>(null)

  const debouncedSearch = useMemo(
    () =>
      debounce((value: string) => {
        setSearch(value)
        setPage(1)
      }, 350),
    [],
  )

  useEffect(() => () => debouncedSearch.cancel(), [debouncedSearch])

  const filters: AdminFilters = {
    search: search || undefined,
    role: roleFilter || undefined,
    status: statusFilter || undefined,
    page,
    limit: PAGE_SIZE,
  }

  const { data: adminsData, isLoading, error, refetch } = useQuery({
    queryKey: ['admins', filters],
    queryFn: () => getAdmins(filters),
  })

  const adminPage = adminsData ?? null
  const adminList = adminPage?.data ?? []

  const { data: selectedAdminDetails } = useQuery({
    queryKey: ['admin-details', selectedAdmin?.id],
    queryFn: () => getAdminById(selectedAdmin!.id),
    enabled: !!selectedAdmin && drawerOpen && drawerMode !== 'create',
  })

  const selectedAdminData = selectedAdminDetails ?? selectedAdmin

  const createMutation = useMutation({
    mutationFn: createAdmin,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admins'] })
      toast.success('Admin created successfully')
      setDrawerOpen(false)
    },
    onError: (mutationError: unknown) => {
      toast.error(mutationError instanceof Error ? mutationError.message : 'Failed to create admin')
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: AdminFormValues }) => updateAdmin(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admins'] })
      toast.success('Admin updated successfully')
      setDrawerOpen(false)
    },
    onError: (mutationError: unknown) => {
      toast.error(mutationError instanceof Error ? mutationError.message : 'Failed to update admin')
    },
  })

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: AdminStatus }) => updateAdminStatus(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admins'] })
      toast.success('Admin status updated successfully')
      setStatusDialogOpen(false)
      setPendingStatusAction(null)
    },
    onError: (mutationError: unknown) => {
      toast.error(mutationError instanceof Error ? mutationError.message : 'Failed to update admin status')
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteAdmin,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admins'] })
      toast.success('Admin deleted successfully')
      setDeleteDialogOpen(false)
      setSelectedAdmin(null)
    },
    onError: (mutationError: unknown) => {
      toast.error(mutationError instanceof Error ? mutationError.message : 'Failed to delete admin')
    },
  })

  const statistics = adminPage
    ? {
        totalAdmins: adminPage.total,
        activeAdmins: adminPage.data.filter((admin) => admin.status === 'active').length,
        inactiveAdmins: adminPage.data.filter((admin) => admin.status === 'inactive').length,
        superAdmins: adminPage.data.filter((admin) => admin.role === 'super_admin').length,
      }
    : null

  const openCreateDrawer = () => {
    if (!hasManageAccess) {
      toast.error('You do not have permission to create administrators')
      return
    }
    setDrawerMode('create')
    setSelectedAdmin(null)
    setDrawerOpen(true)
  }

  const openViewDrawer = (admin: Admin) => {
    setDrawerMode('view')
    setSelectedAdmin(admin)
    setDrawerOpen(true)
  }

  const openEditDrawer = (admin: Admin) => {
    if (!hasManageAccess) {
      toast.error('You do not have permission to edit administrators')
      return
    }
    setDrawerMode('edit')
    setSelectedAdmin(admin)
    setDrawerOpen(true)
  }

  const handleDelete = (admin: Admin) => {
    if (!hasDeleteAccess) {
      toast.error('You do not have permission to delete administrators')
      return
    }
    if (currentAdmin?.id === admin.id) {
      toast.error('You cannot delete your own account')
      return
    }
    setSelectedAdmin(admin)
    setDeleteDialogOpen(true)
  }

  const handleStatusChange = (admin: Admin) => {
    if (!hasManageAccess) {
      toast.error('You do not have permission to change administrator status')
      return
    }
    if (currentAdmin?.id === admin.id) {
      toast.error('You cannot change your own status')
      return
    }
    const nextStatus: AdminStatus = admin.status === 'active' ? 'inactive' : 'active'
    setPendingStatusAction({ admin, status: nextStatus })
    setStatusDialogOpen(true)
  }

  const handleDrawerSubmit = (data: AdminFormValues) => {
    if (!hasManageAccess) {
      toast.error('You do not have permission to modify administrators')
      return
    }

    if (drawerMode === 'create') {
      createMutation.mutate(data)
      return
    }

    if (selectedAdmin) {
      updateMutation.mutate({ id: selectedAdmin.id, data })
    }
  }

  const handleConfirmDelete = () => {
    if (!selectedAdmin) return

    if (currentAdmin?.id === selectedAdmin.id) {
      toast.error('You cannot delete your own account')
      return
    }

    if (
      selectedAdmin.role === 'super_admin' &&
      (adminPage?.data.filter((admin) => admin.role === 'super_admin').length ?? 0) <= 1
    ) {
      toast.error('You cannot delete the last remaining Super Admin')
      return
    }

    deleteMutation.mutate(selectedAdmin.id)
  }

  const handleConfirmStatus = () => {
    if (!pendingStatusAction) return

    if (currentAdmin?.id === pendingStatusAction.admin.id) {
      toast.error('You cannot change your own status')
      return
    }

    statusMutation.mutate({
      id: pendingStatusAction.admin.id,
      status: pendingStatusAction.status,
    })
  }

  const selectedValues = selectedAdminData
    ? {
        name: selectedAdminData.name,
        email: selectedAdminData.email,
        role: selectedAdminData.role,
        status: selectedAdminData.status,
      }
    : undefined

  if (error) {
    return (
      <PageContainer>
        <PageHeader
          title="Admin Management"
          description="Manage administrator accounts and permissions."
        />
        <ErrorState
          title="Failed to load admins"
          description="There was an error fetching the admin data. Please try again."
          onRetry={() => refetch()}
        />
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <PageHeader
        title="Admin Management"
        description="Manage administrator accounts and permissions."
        actions={hasManageAccess ? (
          <Button onClick={openCreateDrawer}>
            <Plus className="mr-2 size-4" />
            Create Admin
          </Button>
        ) : undefined}
      />

      <div className="mb-6">
        <AdminStatistics statistics={statistics} isLoading={isLoading} />
      </div>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by name or email..."
              value={searchInput}
              onChange={(event) => {
                const value = event.target.value
                setSearchInput(value)
                debouncedSearch(value)
              }}
              className="pl-10"
            />
          </div>
        </div>
        <select
          value={roleFilter}
          onChange={(event) => {
            setRoleFilter(event.target.value as AdminRole | '')
            setPage(1)
          }}
          className="rounded-md border border-border bg-background px-3 py-2"
        >
          <option value="">All Roles</option>
          <option value="super_admin">Super Admin</option>
          <option value="admin">Admin</option>
          <option value="support_staff">Support Staff</option>
        </select>
        <select
          value={statusFilter}
          onChange={(event) => {
            setStatusFilter(event.target.value as AdminStatus | '')
            setPage(1)
          }}
          className="rounded-md border border-border bg-background px-3 py-2"
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {isLoading ? (
        <div className="rounded-lg border border-border p-8">
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((item) => (
              <div key={item} className="h-12 animate-pulse rounded bg-muted" />
            ))}
          </div>
        </div>
      ) : adminList.length === 0 ? (
        <EmptyState
          title="No administrators found"
          description="Get started by creating your first administrator account."
          actionLabel={hasManageAccess ? 'Create Admin' : undefined}
          onAction={hasManageAccess ? openCreateDrawer : undefined}
        />
      ) : (
        <>
          <div className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Login</TableHead>
                  <TableHead>Created Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {adminList.map((admin) => {
                  const isSelf = admin.id === currentAdmin?.id
                  return (
                    <TableRow key={admin.id}>
                      <TableCell className="font-medium">{admin.name}</TableCell>
                      <TableCell className="text-muted-foreground">{admin.email}</TableCell>
                      <TableCell>{getRoleLabel(admin.role)}</TableCell>
                      <TableCell><AdminStatusBadge status={admin.status} /></TableCell>
                      <TableCell className="text-sm text-muted-foreground">{admin.lastLogin ? new Date(admin.lastLogin).toLocaleDateString() : 'Never'}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{new Date(admin.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" onClick={() => openViewDrawer(admin)} aria-label="View admin">
                            <Eye className="size-4" />
                          </Button>
                          {hasManageAccess && (
                            <Button variant="ghost" size="sm" onClick={() => openEditDrawer(admin)} aria-label="Edit admin">
                              <Edit className="size-4" />
                            </Button>
                          )}
                          {hasManageAccess && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleStatusChange(admin)}
                              disabled={isSelf}
                              aria-label={admin.status === 'active' ? 'Deactivate admin' : 'Activate admin'}
                            >
                              <Power className="size-4" />
                            </Button>
                          )}
                          {hasDeleteAccess && (
                            <Button variant="ghost" size="sm" onClick={() => handleDelete(admin)} disabled={isSelf} aria-label="Delete admin">
                              <Trash2 className="size-4 text-danger" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>

          <div className="space-y-4 md:hidden">
            {adminList.map((admin) => {
              const isSelf = admin.id === currentAdmin?.id
              return (
                <Card key={admin.id}>
                  <CardContent className="space-y-3 p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-medium">{admin.name}</p>
                        <p className="text-sm text-muted-foreground">{admin.email}</p>
                      </div>
                      <AdminStatusBadge status={admin.status} />
                    </div>
                    <div className="grid gap-2 text-sm">
                      <div className="flex items-center justify-between"><span className="text-muted-foreground">Role</span><span>{getRoleLabel(admin.role)}</span></div>
                      <div className="flex items-center justify-between"><span className="text-muted-foreground">Last Login</span><span>{admin.lastLogin ? new Date(admin.lastLogin).toLocaleDateString() : 'Never'}</span></div>
                      <div className="flex items-center justify-between"><span className="text-muted-foreground">Created</span><span>{new Date(admin.createdAt).toLocaleDateString()}</span></div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <Button variant="outline" onClick={() => openViewDrawer(admin)}>
                        <Eye className="mr-2 size-4" />
                        View
                      </Button>
                      {hasManageAccess && (
                        <Button variant="outline" onClick={() => openEditDrawer(admin)}>
                          <Edit className="mr-2 size-4" />
                          Edit
                        </Button>
                      )}
                      {hasManageAccess && (
                        <Button variant="outline" onClick={() => handleStatusChange(admin)} disabled={isSelf}>
                          <Power className="mr-2 size-4" />
                          {admin.status === 'active' ? 'Deactivate' : 'Activate'}
                        </Button>
                      )}
                      {hasDeleteAccess && (
                        <Button variant="outline" onClick={() => handleDelete(admin)} disabled={isSelf}>
                          <Trash2 className="mr-2 size-4 text-danger" />
                          Delete
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {adminPage?.totalPages && adminPage.totalPages > 1 && (
            <div className="mt-4">
              <Pagination
                page={page}
                totalPages={adminPage.totalPages}
                onPageChange={setPage}
              />
              <p className="mt-3 text-center text-sm text-muted-foreground">
                Showing {((page - 1) * adminPage.limit) + 1} to {Math.min(page * adminPage.limit, adminPage.total)} of {adminPage.total} admins
              </p>
            </div>
          )}
        </>
      )}

      <AdminDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        mode={drawerMode}
        defaultValues={selectedValues}
        onSubmit={drawerMode === 'view' ? undefined : handleDrawerSubmit}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Admin"
        description={`Are you sure you want to delete ${selectedAdmin?.name}? This action cannot be undone.`}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onConfirm={handleConfirmDelete}
        isLoading={deleteMutation.isPending}
        variant="danger"
      />

      <ConfirmDialog
        open={statusDialogOpen}
        onOpenChange={setStatusDialogOpen}
        title={pendingStatusAction?.status === 'active' ? 'Activate Admin' : 'Deactivate Admin'}
        description={`Are you sure you want to ${pendingStatusAction?.status === 'active' ? 'activate' : 'deactivate'} ${pendingStatusAction?.admin.name}?`}
        confirmLabel={pendingStatusAction?.status === 'active' ? 'Activate' : 'Deactivate'}
        cancelLabel="Cancel"
        onConfirm={handleConfirmStatus}
        isLoading={statusMutation.isPending}
        variant={pendingStatusAction?.status === 'active' ? 'primary' : 'danger'}
      />
    </PageContainer>
  )
}

