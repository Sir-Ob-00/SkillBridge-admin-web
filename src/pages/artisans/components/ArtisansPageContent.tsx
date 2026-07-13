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
import { StatCard } from '@/components/common/StatCard'
import { ArtisanDetailsDrawer } from '@/components/artisans/ArtisanDetailsDrawer'
import {
  getArtisans,
  getArtisanStatistics,
  getArtisanById,
  suspendArtisan,
  unsuspendArtisan,
  updateArtisanApplicationStatus,
} from '@/services/artisans.service'
import type { Artisan } from '@/types/artisan.types'
import { artisanStatus, artisanStatusVariant, artisanVerificationVariant } from '@/types/artisan.types'
import { format } from 'date-fns'
import { Search, MoreVertical, Eye, Ban, Check, Star, MapPin, Users, ShieldCheck, XCircle, Clock } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import toast from 'react-hot-toast'

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .map((p) => p.charAt(0))
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export function ArtisansPageContent() {
  const queryClient = useQueryClient()
  const [selectedStatus, setSelectedStatus] = useState<string | undefined>(undefined)
  const [searchInput, setSearchInput] = useState('')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [selectedArtisan, setSelectedArtisan] = useState<Artisan | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const debouncedSearch = useMemo(
    () => debounce((value: string) => setSearch(value), 400),
    [],
  )

  const { data: artisansData, isLoading, error, refetch } = useQuery({
    queryKey: ['artisans', selectedStatus, search, page],
    queryFn: () => getArtisans({ status: selectedStatus, search, page, limit: 10 }),
  })

  const { data: statistics } = useQuery({
    queryKey: ['artisans-statistics'],
    queryFn: getArtisanStatistics,
  })

  const { data: artisanDetails, isLoading: isLoadingDetails } = useQuery({
    queryKey: ['artisan-details', selectedArtisan?.id],
    queryFn: () => getArtisanById(selectedArtisan!.id),
    enabled: !!selectedArtisan && isDrawerOpen,
  })

  const suspendMutation = useMutation({
    mutationFn: ({ id, suspend }: { id: string; suspend: boolean }) =>
      suspend ? suspendArtisan(id) : unsuspendArtisan(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['artisans'] })
      queryClient.invalidateQueries({ queryKey: ['artisans-statistics'] })
      toast.success('Artisan status updated successfully')
    },
    onError: () => toast.error('Failed to update artisan status'),
  })

  const applicationStatusMutation = useMutation({
    mutationFn: ({ id, status, notes }: { id: string; status: string; notes?: string }) =>
      updateArtisanApplicationStatus(id, status, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['artisans'] })
      queryClient.invalidateQueries({ queryKey: ['artisan-details'] })
      queryClient.invalidateQueries({ queryKey: ['artisans-statistics'] })
      toast.success('Application status updated successfully')
    },
    onError: () => toast.error('Failed to update application status'),
  })

  const handleStatusChange = (status: string | undefined) => {
    setSelectedStatus(status)
    setPage(1)
  }

  const handlePageChange = (page: number) => setPage(page)

  const handleViewDetails = (artisan: Artisan) => {
    setSelectedArtisan(artisan)
    setIsDrawerOpen(true)
  }

  const handleStatusToggle = async (id: string, status: 'active' | 'suspended') => {
    await suspendMutation.mutateAsync({ id, suspend: status === 'suspended' })
    if (selectedArtisan?.id === id) {
      setSelectedArtisan((prev) => (prev ? { ...prev, isSuspended: status === 'suspended' } : null))
    }
  }

  const handleApplicationStatusChange = async (id: string, status: string, notes?: string) => {
    await applicationStatusMutation.mutateAsync({ id, status, notes })
  }

  const handleResetFilters = () => {
    setSelectedStatus(undefined)
    setSearchInput('')
    setSearch('')
    setPage(1)
  }

  const hasFilters = Boolean(search || selectedStatus)
  const artisans = artisansData?.items ?? []

  if (error) {
    return (
      <PageContainer>
        <PageHeader title="Artisans" description="Manage verified and pending artisans" />
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
      <PageHeader title="Artisans" description="Manage verified and pending artisans" />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 mb-6">
        {statistics ? (
          <>
            <StatCard title="Total Artisans" value={statistics.total} icon={Users} variant="primary" />
            <StatCard title="Verified" value={statistics.active} icon={ShieldCheck} variant="success" />
            <StatCard title="Unverified" value={statistics.pending} icon={Clock} variant="warning" />
            <StatCard title="Rejected" value={statistics.rejected} icon={XCircle} variant="danger" />
            <StatCard title="Active" value={statistics.active} icon={ShieldCheck} variant="info" />
            <StatCard title="Suspended" value={statistics.suspended} icon={Ban} variant="warning" />
          </>
        ) : (
          Array.from({ length: 6 }).map((_, i) => <Skeleton key={`skeleton-${i}`} className="h-24" />)
        )}
      </div>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center gap-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by business, name, or email..."
              className="pl-9"
              value={searchInput}
              onChange={(e) => {
                setSearchInput(e.target.value)
                debouncedSearch(e.target.value)
              }}
            />
          </div>
          <Button variant="outline" onClick={handleResetFilters} disabled={!hasFilters}>
            Reset
          </Button>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {[
            { label: 'All', value: undefined },
            { label: 'Verified', value: 'VERIFIED' },
            { label: 'Unverified', value: 'UNVERIFIED' },
            { label: 'Active', value: 'ACTIVE' },
            { label: 'Rejected', value: 'REJECTED' },
          ].map((tab) => (
            <Button
              key={tab.label}
              variant={selectedStatus === tab.value ? 'primary' : 'outline'}
              size="sm"
              onClick={() => handleStatusChange(tab.value)}
            >
              {tab.label}
            </Button>
          ))}
        </div>
      </div>

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
              <Skeleton className="size-8" />
            </div>
          ))}
        </div>
      ) : artisans.length > 0 ? (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Artisan</TableHead>
                <TableHead>Verification</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {artisans.map((artisan) => {
                const status = artisanStatus(artisan)
                return (
                  <TableRow key={artisan.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="size-8">
                          <AvatarImage src={artisan.user.profileImageUrl || undefined} alt={artisan.user.name} />
                          <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                            {getInitials(artisan.user.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">{artisan.businessName || artisan.user.name}</p>
                          <p className="text-xs text-muted-foreground">{artisan.user.name}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={artisan.verification} variant={artisanVerificationVariant(artisan.verification)} />
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={status} variant={artisanStatusVariant(status)} />
                    </TableCell>
                    <TableCell>
                      <span className="text-sm flex items-center gap-1">
                        <Star className="size-3 fill-yellow-400 text-yellow-400" />
                        {artisan.rating ? `${Number(artisan.rating).toFixed(1)} (${artisan.reviewCount ?? 0})` : '—'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm flex items-center gap-1">
                        <MapPin className="size-3 text-muted-foreground" />
                        {artisan.location || '—'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{format(new Date(artisan.createdAt), 'MMM dd, yyyy')}</span>
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
                            <Eye className="mr-2 size-4" />
                            View Profile
                          </DropdownMenuItem>
                          {status === 'active' ? (
                            <DropdownMenuItem onClick={() => handleStatusToggle(artisan.id, 'suspended')}>
                              <Ban className="mr-2 size-4" />
                              Suspend
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem onClick={() => handleStatusToggle(artisan.id, 'active')}>
                              <Check className="mr-2 size-4" />
                              Activate
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
          {artisansData && (
            <div className="mt-4">
              <Pagination page={artisansData.page} totalPages={artisansData.totalPages} onPageChange={handlePageChange} />
            </div>
          )}
        </>
      ) : (
        <EmptyState
          title="No artisans found"
          description={
            selectedStatus === 'VERIFIED'
              ? 'No verified artisans found'
              : selectedStatus === 'UNVERIFIED'
                ? 'No unverified artisans found'
                : selectedStatus === 'ACTIVE'
                  ? 'No active artisans found'
                  : selectedStatus === 'REJECTED'
                    ? 'No rejected artisans found'
                    : hasFilters
                      ? 'No artisans match your current filters.'
                      : 'No artisans have registered yet.'
          }
          actionLabel={hasFilters ? 'Clear Filters' : undefined}
          onAction={hasFilters ? handleResetFilters : undefined}
        />
      )}

      <ArtisanDetailsDrawer
        artisan={artisanDetails || null}
        isLoading={isLoadingDetails}
        isOpen={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false)
          setSelectedArtisan(null)
        }}
        onStatusChange={handleStatusToggle}
        onApplicationStatusChange={handleApplicationStatusChange}
      />
    </PageContainer>
  )
}
