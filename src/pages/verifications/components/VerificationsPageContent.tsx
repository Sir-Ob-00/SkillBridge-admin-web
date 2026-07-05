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
import { VerificationDrawer } from '@/components/verifications/VerificationDrawer'
import { Card, CardContent } from '@/components/ui/card'
import {
  getVerificationRequests,
  getVerificationById,
  approveVerification,
  rejectVerification,
  requestMoreInformation,
  getVerificationStatistics,
} from '@/services/verifications.service'
import type { VerificationRequest, VerificationFilters, VerificationStatus } from '@/types/verification.types'
import { format } from 'date-fns'
import { Search, MoreVertical, Eye, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
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

const getStatusVariant = (status: VerificationStatus): 'success' | 'warning' | 'danger' | 'secondary' => {
  switch (status) {
    case 'approved':
      return 'success'
    case 'rejected':
      return 'danger'
    case 'requires_more_info':
      return 'warning'
    case 'pending':
      return 'secondary'
    default:
      return 'secondary'
  }
}

export default function Verifications() {
  const queryClient = useQueryClient()
  const [filters, setFilters] = useState<VerificationFilters>({
    page: 1,
    limit: 10,
    search: '',
    status: undefined,
    category: undefined,
    sortBy: 'newest',
  })
  const [selectedVerification, setSelectedVerification] = useState<VerificationRequest | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const debouncedSearch = useMemo(
    () =>
      debounce((value: string) => {
        setFilters((prev) => ({ ...prev, search: value, page: 1 }))
      }, 400),
    [],
  )

  const {
    data: verificationsData,
    isLoading: isLoadingVerifications,
    error: verificationsError,
    refetch: refetchVerifications,
  } = useQuery({
    queryKey: ['verifications', filters],
    queryFn: () => getVerificationRequests(filters),
  })

  const { data: statistics, isLoading: isLoadingStats } = useQuery({
    queryKey: ['verification-statistics'],
    queryFn: getVerificationStatistics,
  })

  const { data: verificationDetails, isLoading: isLoadingDetails } = useQuery({
    queryKey: ['verification-details', selectedVerification?.id],
    queryFn: () => getVerificationById(selectedVerification!.id),
    enabled: !!selectedVerification && isDrawerOpen,
  })

  const approveMutation = useMutation({
    mutationFn: ({ id, note }: { id: string; note?: string }) => approveVerification(id, { note }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['verifications'] })
      queryClient.invalidateQueries({ queryKey: ['verification-statistics'] })
      toast.success('Verification approved successfully')
    },
    onError: () => {
      toast.error('Failed to approve verification')
    },
  })

  const rejectMutation = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) => rejectVerification(id, { reason }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['verifications'] })
      queryClient.invalidateQueries({ queryKey: ['verification-statistics'] })
      toast.success('Verification rejected successfully')
    },
    onError: () => {
      toast.error('Failed to reject verification')
    },
  })

  const requestInfoMutation = useMutation({
    mutationFn: ({ id, message }: { id: string; message: string }) => requestMoreInformation(id, { message }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['verifications'] })
      queryClient.invalidateQueries({ queryKey: ['verification-statistics'] })
      toast.success('Information request sent successfully')
    },
    onError: () => {
      toast.error('Failed to send information request')
    },
  })

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    debouncedSearch(value)
  }

  const handleStatusFilterChange = (status: VerificationStatus | undefined) => {
    setFilters((prev) => ({ ...prev, status, page: 1 }))
  }

  const handleSortChange = (sortBy: 'newest' | 'oldest' | 'status' | 'category') => {
    setFilters((prev) => ({ ...prev, sortBy, page: 1 }))
  }

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }))
  }

  const handleViewDetails = (verification: VerificationRequest) => {
    setSelectedVerification(verification)
    setIsDrawerOpen(true)
  }

  const handleApprove = async (id: string, note?: string) => {
    await approveMutation.mutateAsync({ id, note })
    if (selectedVerification?.id === id) {
      setIsDrawerOpen(false)
      setSelectedVerification(null)
    }
  }

  const handleReject = async (id: string, reason: string) => {
    await rejectMutation.mutateAsync({ id, reason })
    if (selectedVerification?.id === id) {
      setIsDrawerOpen(false)
      setSelectedVerification(null)
    }
  }

  const handleRequestInfo = async (id: string, message: string) => {
    await requestInfoMutation.mutateAsync({ id, message })
  }

  const handleResetFilters = () => {
    setFilters({ page: 1, limit: 10, search: '', status: undefined, category: undefined, sortBy: 'newest' })
  }

  if (verificationsError) {
    return (
      <PageContainer>
        <PageHeader
          title="Artisan Verification"
          description="Review artisan identity and business documents"
        />
        <ErrorState
          title="Failed to load verifications"
          description="There was an error fetching the verification requests. Please try again."
          onRetry={() => refetchVerifications()}
        />
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <PageHeader
        title="Artisan Verification"
        description="Review artisan identity and business documents"
      />

      {/* Statistics Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        {isLoadingStats ? (
          [1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-24" />
          ))
        ) : statistics ? (
          <>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Pending Reviews</p>
                    <p className="text-2xl font-bold text-warning">{statistics.pendingReviews}</p>
                  </div>
                  <Clock className="size-8 text-warning" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Approved Today</p>
                    <p className="text-2xl font-bold text-success">{statistics.approvedToday}</p>
                  </div>
                  <CheckCircle className="size-8 text-success" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Rejected Today</p>
                    <p className="text-2xl font-bold text-danger">{statistics.rejectedToday}</p>
                  </div>
                  <XCircle className="size-8 text-danger" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Requires Information</p>
                    <p className="text-2xl font-bold text-secondary">{statistics.requiresInformation}</p>
                  </div>
                  <AlertCircle className="size-8 text-secondary" />
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
              placeholder="Search by business, name, email, or phone..."
              className="pl-9"
              defaultValue={filters.search}
              onChange={handleSearchChange}
            />
          </div>
          <Button
            variant="outline"
            onClick={handleResetFilters}
            disabled={!filters.search && !filters.status && !filters.category}
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
              variant={filters.status === 'pending' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => handleStatusFilterChange('pending')}
            >
              <Clock className="size-4 mr-1" />
              Pending
            </Button>
            <Button
              variant={filters.status === 'approved' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => handleStatusFilterChange('approved')}
            >
              <CheckCircle className="size-4 mr-1" />
              Approved
            </Button>
            <Button
              variant={filters.status === 'rejected' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => handleStatusFilterChange('rejected')}
            >
              <XCircle className="size-4 mr-1" />
              Rejected
            </Button>
            <Button
              variant={filters.status === 'requires_more_info' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => handleStatusFilterChange('requires_more_info')}
            >
              <AlertCircle className="size-4 mr-1" />
              Info Needed
            </Button>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant={filters.sortBy === 'newest' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => handleSortChange('newest')}
            >
              Newest
            </Button>
            <Button
              variant={filters.sortBy === 'oldest' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => handleSortChange('oldest')}
            >
              Oldest
            </Button>
          </div>
        </div>
      </div>

      {/* Table */}
      {isLoadingVerifications ? (
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
              <Skeleton className="size-8" />
            </div>
          ))}
        </div>
      ) : verificationsData?.data && verificationsData.data.length > 0 ? (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Artisan</TableHead>
                <TableHead>Business</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Assigned Admin</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {verificationsData.data.map((verification) => (
                <TableRow key={verification.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="size-8">
                        <AvatarImage src={verification.artisanAvatar || undefined} alt={`${verification.artisanFirstName} ${verification.artisanLastName}`} />
                        <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                          {getInitials(verification.artisanFirstName, verification.artisanLastName)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">
                          {verification.artisanFirstName} {verification.artisanLastName}
                        </p>
                        <p className="text-xs text-muted-foreground">{verification.artisanEmail}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{verification.artisanBusinessName}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{verification.category}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">
                      {format(new Date(verification.submittedAt), 'MMM dd, yyyy')}
                    </span>
                  </TableCell>
                  <TableCell>
                    <StatusBadge
                      status={verification.status}
                      variant={getStatusVariant(verification.status)}
                    />
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {verification.assignedAdmin || 'Unassigned'}
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
                        <DropdownMenuItem onClick={() => handleViewDetails(verification)}>
                          <Eye className="size-4 mr-2" />
                          View Details
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
              page={verificationsData.meta.page}
              totalPages={verificationsData.meta.totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </>
      ) : (
        <EmptyState
          title="No verification requests found"
          description={
            filters.search || filters.status || filters.category
              ? 'No verification requests match your current filters.'
              : 'No verification requests have been submitted yet.'
          }
          actionLabel={filters.search || filters.status || filters.category ? 'Clear Filters' : undefined}
          onAction={filters.search || filters.status || filters.category ? handleResetFilters : undefined}
        />
      )}

      {/* Verification Details Drawer */}
      <VerificationDrawer
        verification={verificationDetails || selectedVerification}
        isLoading={isLoadingDetails}
        isOpen={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false)
          setSelectedVerification(null)
        }}
        onApprove={handleApprove}
        onReject={handleReject}
        onRequestInfo={handleRequestInfo}
      />
    </PageContainer>
  )
}
