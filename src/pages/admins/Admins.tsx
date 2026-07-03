import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { PageContainer } from '@/components/layout/PageContainer'
import { PageHeader } from '@/components/feedback/PageHeader'
import { ErrorState } from '@/components/common/ErrorState'
import { EmptyState } from '@/components/common/EmptyState'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { AdminStatistics } from '@/components/admins/AdminStatistics'
import { AdminStatusBadge } from '@/components/admins/AdminStatusBadge'
import { AdminDrawer } from '@/components/admins/AdminDrawer'
import { getAdmins, createAdmin, updateAdmin, updateAdminStatus, deleteAdmin } from '@/services/admins.service'
import type { Admin, AdminFilters, AdminRole, AdminStatus } from '@/types/admin.types'
import { Search, Plus, Edit, Trash2, Power } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Admins() {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState<AdminRole | ''>('')
  const [statusFilter, setStatusFilter] = useState<AdminStatus | ''>('')
  const [page, setPage] = useState(1)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [drawerMode, setDrawerMode] = useState<'create' | 'edit'>('create')
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [statusDialogOpen, setStatusDialogOpen] = useState(false)
  const [pendingStatusAction, setPendingStatusAction] = useState<{ admin: Admin; status: AdminStatus } | null>(null)

  const filters: AdminFilters = {
    search: search || undefined,
    role: roleFilter || undefined,
    status: statusFilter || undefined,
  }

  const { data: adminsData, isLoading, error, refetch } = useQuery({
    queryKey: ['admins', filters, page],
    queryFn: () => getAdmins(filters),
  })

  const createMutation = useMutation({
    mutationFn: createAdmin,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admins'] })
      toast.success('Admin created successfully')
      setDrawerOpen(false)
    },
    onError: () => {
      toast.error('Failed to create admin')
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => updateAdmin(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admins'] })
      toast.success('Admin updated successfully')
      setDrawerOpen(false)
    },
    onError: () => {
      toast.error('Failed to update admin')
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
    onError: () => {
      toast.error('Failed to update admin status')
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
    onError: () => {
      toast.error('Failed to delete admin')
    },
  })

  const handleCreate = () => {
    setDrawerMode('create')
    setSelectedAdmin(null)
    setDrawerOpen(true)
  }

  const handleEdit = (admin: Admin) => {
    setDrawerMode('edit')
    setSelectedAdmin(admin)
    setDrawerOpen(true)
  }

  const handleDelete = (admin: Admin) => {
    setSelectedAdmin(admin)
    setDeleteDialogOpen(true)
  }

  const handleStatusChange = (admin: Admin, status: AdminStatus) => {
    setPendingStatusAction({ admin, status })
    setStatusDialogOpen(true)
  }

  const handleDrawerSubmit = (data: any) => {
    if (drawerMode === 'create') {
      createMutation.mutate(data)
    } else if (selectedAdmin) {
      updateMutation.mutate({ id: selectedAdmin.id, data })
    }
  }

  const handleConfirmDelete = () => {
    if (selectedAdmin) {
      deleteMutation.mutate(selectedAdmin.id)
    }
  }

  const handleConfirmStatus = () => {
    if (pendingStatusAction) {
      statusMutation.mutate({ id: pendingStatusAction.admin.id, status: pendingStatusAction.status })
    }
  }

  const statistics = adminsData ? {
    totalAdmins: adminsData.total,
    activeAdmins: adminsData.data.filter(a => a.status === 'active').length,
    inactiveAdmins: adminsData.data.filter(a => a.status === 'inactive').length,
    superAdmins: adminsData.data.filter(a => a.role === 'super_admin').length,
  } : null

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
        actions={
          <Button onClick={handleCreate}>
            <Plus className="size-4 mr-2" />
            Create Admin
          </Button>
        }
      />

      {/* Statistics */}
      <div className="mb-6">
        <AdminStatistics statistics={statistics} isLoading={isLoading} />
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value as AdminRole | '')}
          className="px-3 py-2 border border-border rounded-md bg-background"
        >
          <option value="">All Roles</option>
          <option value="super_admin">Super Admin</option>
          <option value="admin">Admin</option>
          <option value="support_staff">Support Staff</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as AdminStatus | '')}
          className="px-3 py-2 border border-border rounded-md bg-background"
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="border border-border rounded-lg overflow-hidden">
          <div className="p-8 space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-12 bg-muted animate-pulse rounded" />
            ))}
          </div>
        </div>
      ) : adminsData?.data.length === 0 ? (
        <EmptyState
          title="No administrators found"
          description="Get started by creating your first administrator account."
          actionLabel="Create Admin"
          onAction={handleCreate}
        />
      ) : (
        <div className="border border-border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="text-left p-4 font-medium text-sm">Name</th>
                  <th className="text-left p-4 font-medium text-sm">Email</th>
                  <th className="text-left p-4 font-medium text-sm">Role</th>
                  <th className="text-left p-4 font-medium text-sm">Status</th>
                  <th className="text-left p-4 font-medium text-sm">Last Login</th>
                  <th className="text-left p-4 font-medium text-sm">Created</th>
                  <th className="text-left p-4 font-medium text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {adminsData?.data.map((admin) => (
                  <tr key={admin.id} className="border-t border-border hover:bg-muted/50">
                    <td className="p-4 font-medium">{admin.name}</td>
                    <td className="p-4 text-muted-foreground">{admin.email}</td>
                    <td className="p-4">
                      <span className="capitalize">{admin.role.replace('_', ' ')}</span>
                    </td>
                    <td className="p-4">
                      <AdminStatusBadge status={admin.status} />
                    </td>
                    <td className="p-4 text-muted-foreground text-sm">
                      {admin.lastLogin ? new Date(admin.lastLogin).toLocaleDateString() : 'Never'}
                    </td>
                    <td className="p-4 text-muted-foreground text-sm">
                      {new Date(admin.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(admin)}
                        >
                          <Edit className="size-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleStatusChange(admin, admin.status === 'active' ? 'inactive' : 'active')}
                        >
                          <Power className="size-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(admin)}
                        >
                          <Trash2 className="size-4 text-danger" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {adminsData && adminsData.totalPages > 1 && (
            <div className="flex items-center justify-between p-4 border-t border-border">
              <p className="text-sm text-muted-foreground">
                Showing {((page - 1) * adminsData.limit) + 1} to {Math.min(page * adminsData.limit, adminsData.total)} of {adminsData.total} admins
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(p => Math.min(adminsData.totalPages, p + 1))}
                  disabled={page === adminsData.totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Drawer */}
      <AdminDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        mode={drawerMode}
        defaultValues={selectedAdmin ? {
          name: selectedAdmin.name,
          email: selectedAdmin.email,
          role: selectedAdmin.role,
          status: selectedAdmin.status,
        } : undefined}
        onSubmit={handleDrawerSubmit}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />

      {/* Delete Confirmation Dialog */}
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

      {/* Status Change Confirmation Dialog */}
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
