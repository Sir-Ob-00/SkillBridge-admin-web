import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { debounce } from 'lodash-es'
import { PageContainer } from '@/components/layout/PageContainer'
import { PageHeader } from '@/components/feedback/PageHeader'
import { ErrorState } from '@/components/common/ErrorState'
import { EmptyState } from '@/components/common/EmptyState'
import { ApplicationCard } from '@/components/artisan-applications/ApplicationCard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { getApplications, getApplicationStatistics } from '@/services/artisanApplications.service'
import type { ApplicationFilters, ApplicationStatus } from '@/types/artisanApplication.types'
import { Search, RefreshCw } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function Applications() {
  const navigate = useNavigate()
  const [filters, setFilters] = useState<ApplicationFilters>({
    page: 1,
    limit: 12,
    status: undefined,
    search: '',
    sortBy: 'submittedAt',
    sortOrder: 'desc',
  })

  const debouncedSearch = useMemo(
    () =>
      debounce((value: string) => {
        setFilters((prev) => ({ ...prev, search: value, page: 1 }))
      }, 400),
    [],
  )

  const { data: applicationsData, isLoading, error, refetch } = useQuery({
    queryKey: ['artisan-applications', filters],
    queryFn: () => getApplications(filters),
  })

  const { data: statistics } = useQuery({
    queryKey: ['application-statistics'],
    queryFn: getApplicationStatistics,
  })

  const handleSearchChange = (value: string) => {
    debouncedSearch(value)
  }

  const handleStatusFilter = (status: ApplicationStatus | undefined) => {
    setFilters((prev) => ({ ...prev, status, page: 1 }))
  }

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }))
  }

  const handleViewDetails = (id: string) => {
    navigate(`/dashboard/artisan-applications/${id}`)
  }

  const statusOptions: { value: ApplicationStatus; label: string }[] = [
    { value: 'pending', label: 'Pending' },
    { value: 'under_review', label: 'Under Review' },
    { value: 'approved', label: 'Approved' },
    { value: 'rejected', label: 'Rejected' },
    { value: 'changes_requested', label: 'Changes Requested' },
  ]

  if (error) {
    return (
      <PageContainer>
        <PageHeader
          title="Artisan Applications"
          description="Review and manage artisan applications."
          actions={
            <Button variant="outline" onClick={() => refetch()}>
              <RefreshCw className="mr-2 size-4" />
              Retry
            </Button>
          }
        />
        <ErrorState
          title="Failed to load applications"
          description="There was an error fetching the applications. Please try again."
          onRetry={() => refetch()}
        />
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <PageHeader
        title="Artisan Applications"
        description="Review and manage artisan applications."
        actions={
          <Button variant="outline" onClick={() => refetch()} disabled={isLoading}>
            <RefreshCw className={`mr-2 size-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        }
      />

      {/* Statistics Cards */}
      {statistics && (
        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <div className="p-4 border border-border rounded-lg bg-card">
            <p className="text-sm text-muted-foreground">Total</p>
            <p className="text-2xl font-bold">{statistics.total}</p>
          </div>
          <div className="p-4 border border-border rounded-lg bg-card">
            <p className="text-sm text-muted-foreground">Pending</p>
            <p className="text-2xl font-bold">{statistics.pending}</p>
          </div>
          <div className="p-4 border border-border rounded-lg bg-card">
            <p className="text-sm text-muted-foreground">Under Review</p>
            <p className="text-2xl font-bold">{statistics.underReview}</p>
          </div>
          <div className="p-4 border border-border rounded-lg bg-card">
            <p className="text-sm text-muted-foreground">Approved</p>
            <p className="text-2xl font-bold">{statistics.approved}</p>
          </div>
          <div className="p-4 border border-border rounded-lg bg-card">
            <p className="text-sm text-muted-foreground">Changes Requested</p>
            <p className="text-2xl font-bold">{statistics.changesRequested}</p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="mb-6 p-4 border border-border rounded-lg bg-card space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, business, or email..."
                className="pl-10"
                defaultValue={filters.search}
                onChange={(e) => handleSearchChange(e.target.value)}
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant={filters.status === undefined ? 'primary' : 'outline'}
              onClick={() => handleStatusFilter(undefined)}
            >
              All
            </Button>
            {statusOptions.map((option) => (
              <Button
                key={option.value}
                variant={filters.status === option.value ? 'primary' : 'outline'}
                onClick={() => handleStatusFilter(option.value)}
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Applications Grid */}
      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-64" />
          ))}
        </div>
      ) : applicationsData?.data.length === 0 ? (
        <EmptyState
          title="No applications found"
          description={
            filters.search || filters.status
              ? 'No applications match your current search and filter criteria.'
              : 'No artisan applications have been submitted yet.'
          }
          actionLabel={filters.search || filters.status ? 'Clear Filters' : undefined}
          onAction={
            filters.search || filters.status
              ? () => setFilters({ page: 1, limit: 12, sortBy: 'submittedAt', sortOrder: 'desc' })
              : undefined
          }
        />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {applicationsData?.data.map((application) => (
              <ApplicationCard
                key={application.id}
                application={application}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>

          {/* Pagination */}
          {applicationsData && applicationsData.totalPages > 1 && (
            <div className="mt-6 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Showing {((filters.page || 1) - 1) * (filters.limit || 12) + 1} to{' '}
                {Math.min((filters.page || 1) * (filters.limit || 12), applicationsData.total)} of{' '}
                {applicationsData.total} applications
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => handlePageChange((filters.page || 1) - 1)}
                  disabled={(filters.page || 1) === 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handlePageChange((filters.page || 1) + 1)}
                  disabled={(filters.page || 1) === applicationsData.totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </PageContainer>
  )
}
