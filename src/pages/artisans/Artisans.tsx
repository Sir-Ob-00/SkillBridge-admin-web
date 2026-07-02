import { useState, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { debounce } from 'lodash-es'
import { PageContainer } from '@/components/layout/PageContainer'
import { PageHeader } from '@/components/feedback/PageHeader'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/common/Table'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { ErrorState } from '@/components/common/ErrorState'
import { EmptyState } from '@/components/common/EmptyState'
import { StatusBadge } from '@/components/common/StatusBadge'
import { Pagination } from '@/components/common/Pagination'
import { ArtisanDetailsDrawer } from '@/components/artisans/ArtisanDetailsDrawer'
import {
  getArtisans,
  getArtisanById,
  updateArtisanStatus,
  verifyArtisan,
  deleteArtisan,
} from '@/services/artisans.service'
import type { Artisan, ArtisanFilters, ArtisanStatus, VerificationStatus } from '@/types/artisan.types'
import { format } from 'date-fns'
import { Search, MoreVertical, Eye, Ban, Trash2, Check, Shield, Briefcase, Star } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import toast from 'react-hot-toast'

const getInitials = (firstName: string, lastName: string) => {
  return `${firstName[0]}${lastName[0]}`.toUpperCase()
}

const getStatusVariant = (status: ArtisanStatus): 'success' | 'warning' | 'danger' | 'secondary' => {
  switch (status) {
    case 'active':
      return 'success'
    case 'suspended':
      return 'warning'
    case 'rejected':
      return 'danger'
    case 'pending':
      return 'secondary'
    default:
      return 'secondary'
  }
}

const getVerificationVariant = (status: VerificationStatus): 'success' | 'warning' | 'danger' | 'secondary' => {
  switch (status) {
    case 'verified':
      return 'success'
    case 'pending':
      return 'warning'
    case 'rejected':
      return 'danger'
    case 'unverified':
      return 'secondary'
    default:
      return 'secondary'
  }
}

export default function Artisans() {
  const queryClient = useQueryClient()
  const [filters, setFilters] = useState<ArtisanFilters>({
    page: 1,
    limit: 10,
    search: '',
    status: undefined,
    verificationStatus: undefined,
    category: undefined,
  })
  const [selectedArtisan, setSelectedArtisan] = useState<Artisan | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const debouncedSearch = useMemo(
    () =>
      debounce((value: string) => {
        setFilters((prev) => ({ ...prev, search: value, page: 1 }))
      }, 400),
    [],
  )

  const {
    data: artisansData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['artisans', filters],
    queryFn: () => getArtisans(filters),
  })

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'active' | 'suspended' }) =>
      updateArtisanStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['artisans'] })
      toast.success('Artisan status updated successfully')
    },
    onError: () => {
      toast.error('Failed to update artisan status')
    },
  })

  const verifyMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: { status: 'verified' | 'rejected'; note?: string } }) =>
      verifyArtisan(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['artisans'] })
      toast.success('Artisan verification updated successfully')
    },
    onError: () => {
      toast.error('Failed to update artisan verification')
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteArtisan,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['artisans'] })
      toast.success('Artisan deleted successfully')
    },
    onError: () => {
      toast.error('Failed to delete artisan')
    },
  })

  const { data: artisanDetails, isLoading: isLoadingDetails } = useQuery({
    queryKey: ['artisan-details', selectedArtisan?.id],
    queryFn: () => getArtisanById(selectedArtisan!.id),
    enabled: !!selectedArtisan && isDrawerOpen,
  })

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    debouncedSearch(value)
  }

  const handleStatusFilterChange = (status: ArtisanStatus | undefined) => {
    setFilters((prev) => ({ ...prev, status, page: 1 }))
  }

  const handleVerificationFilterChange = (status: VerificationStatus | undefined) => {
    setFilters((prev) => ({ ...prev, verificationStatus: status, page: 1 }))
  }

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }))
  }

  const handleViewDetails = (artisan: Artisan) => {
    setSelectedArtisan(artisan)
    setIsDrawerOpen(true)
  }

  const handleStatusToggle = async (id: string, status: 'active' | 'suspended') => {
    await statusMutation.mutateAsync({ id, status })
    if (selectedArtisan?.id === id) {
      setSelectedArtisan((prev) => prev ? { ...prev, status } : null)
    }
  }

  const handleVerify = async (id: string, payload: { status: 'verified' | 'rejected'; note?: string }) => {
    await verifyMutation.mutateAsync({ id, payload })
  }

  const handleDelete = async (id: string) => {
    await deleteMutation.mutateAsync(id)
    setIsDrawerOpen(false)
    setSelectedArtisan(null)
  }

  const handleResetFilters = () => {
    setFilters({ page: 1, limit: 10, search: '', status: undefined, verificationStatus: undefined, category: undefined })
  }

  if (error) {
    return (
      <PageContainer>
        <PageHeader
          title="Artisans"
          description="Manage verified and pending artisans"
        />
        <ErrorState
          title="Failed to load artisans"
          description="There was an error fetching the artisans list. Please try again."
          onRetry={() => refetch()}
        />
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <PageHeader
        title="Artisans"
        description="Manage verified and pending artisans"
      />

      {/* Filter Bar */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center gap-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by name, business, email, or phone..."
              className="pl-9"
              defaultValue={filters.search}
              onChange={handleSearchChange}
            />
          </div>
          <Button
            variant="outline"
            onClick={handleResetFilters}
            disabled={!filters.search && !filters.status && !filters.verificationStatus && !filters.category}
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
              variant={filters.status === 'suspended' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => handleStatusFilterChange('suspended')}
            >
              Suspended
            </Button>
            <Button
              variant={filters.status === 'pending' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => handleStatusFilterChange('pending')}
            >
              Pending
            </Button>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant={filters.verificationStatus === 'verified' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => handleVerificationFilterChange('verified')}
            >
              <Shield className="size-4 mr-1" />
              Verified
            </Button>
            <Button
              variant={filters.verificationStatus === 'pending' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => handleVerificationFilterChange('pending')}
            >
              Pending
            </Button>
          </div>
        </div>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-4 p-4 border border-border rounded-lg">
              <Skeleton className="size-10 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-3 w-32" />
              </div>
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="size-8" />
            </div>
          ))}
        </div>
      ) : artisansData?.data && artisansData.data.length > 0 ? (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Artisan</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Verification</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Bookings</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {artisansData.data.map((artisan) => (
                <TableRow key={artisan.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="size-8">
                        <AvatarImage src={artisan.avatar || undefined} alt={`${artisan.firstName} ${artisan.lastName}`} />
                        <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                          {getInitials(artisan.firstName, artisan.lastName)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">{artisan.businessName}</p>
                        <p className="text-xs text-muted-foreground">
                          {artisan.firstName} {artisan.lastName}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm flex items-center gap-1">
                      <Briefcase className="size-3 text-muted-foreground" />
                      {artisan.category}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm flex items-center gap-1">
                      <Star className="size-3 fill-yellow-400 text-yellow-400" />
                      {artisan.rating.toFixed(1)} ({artisan.totalReviews})
                    </span>
                  </TableCell>
                  <TableCell>
                    <StatusBadge
                      status={artisan.verificationStatus}
                      variant={getVerificationVariant(artisan.verificationStatus)}
                    />
                  </TableCell>
                  <TableCell>
                    <StatusBadge
                      status={artisan.status}
                      variant={getStatusVariant(artisan.status)}
                    />
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">
                      {format(new Date(artisan.joinedAt), 'MMM dd, yyyy')}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm font-medium">{artisan.totalBookings}</span>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="size-8">
                          <MoreVertical className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleViewDetails(artisan)}>
                          <Eye className="size-4 mr-2" />
                          View Profile
                        </DropdownMenuItem>
                        {artisan.verificationStatus === 'pending' && (
                          <>
                            <DropdownMenuItem
                              onClick={() => handleVerify(artisan.id, { status: 'verified' })}
                            >
                              <Shield className="size-4 mr-2" />
                              Verify
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleVerify(artisan.id, { status: 'rejected' })}
                              className="text-danger"
                            >
                              <Ban className="size-4 mr-2" />
                              Reject
                            </DropdownMenuItem>
                          </>
                        )}
                        {artisan.status === 'active' ? (
                          <DropdownMenuItem
                            onClick={() => handleStatusToggle(artisan.id, 'suspended')}
                          >
                            <Ban className="size-4 mr-2" />
                            Suspend
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem
                            onClick={() => handleStatusToggle(artisan.id, 'active')}
                          >
                            <Check className="size-4 mr-2" />
                            Activate
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem
                          onClick={() => handleDelete(artisan.id)}
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
              page={artisansData.meta.page}
              totalPages={artisansData.meta.totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </>
      ) : (
        <EmptyState
          title="No artisans found"
          description={
            filters.search || filters.status || filters.verificationStatus || filters.category
              ? 'No artisans match your current filters.'
              : 'No artisans have registered yet.'
          }
          actionLabel={filters.search || filters.status || filters.verificationStatus || filters.category ? 'Clear Filters' : undefined}
          onAction={filters.search || filters.status || filters.verificationStatus || filters.category ? handleResetFilters : undefined}
        />
      )}

      {/* Artisan Details Drawer */}
      <ArtisanDetailsDrawer
        artisan={artisanDetails || null}
        isLoading={isLoadingDetails}
        isOpen={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false)
          setSelectedArtisan(null)
        }}
        onStatusChange={handleStatusToggle}
        onVerify={handleVerify}
        onDelete={handleDelete}
      />
    </PageContainer>
  )
}
