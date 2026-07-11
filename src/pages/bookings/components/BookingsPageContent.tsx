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
import { Pagination } from '@/components/common/Pagination'
import { BookingDetailsDrawer } from '@/components/bookings/BookingDetailsDrawer'
import { BookingStatusBadge } from '@/components/bookings/BookingStatusBadge'
import { getBookings, getBookingById, getBookingStatistics } from '@/services/bookings.service'
import type { Booking, BookingFilters, BookingStatus } from '@/types/booking.types'
import { format } from 'date-fns'
import { Search, MoreVertical, Eye, RefreshCw, CalendarDays, TrendingUp } from 'lucide-react'
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

const STATUS_FILTERS: (BookingStatus | undefined)[] = [
  undefined,
  'pending',
  'accepted',
  'in_progress',
  'completed',
  'cancelled',
  'rejected',
]

const STATUS_LABELS: Record<string, string> = {
  undefined: 'All',
  pending: 'Pending',
  accepted: 'Accepted',
  in_progress: 'In Progress',
  completed: 'Completed',
  cancelled: 'Cancelled',
  rejected: 'Rejected',
}

export function BookingsPageContent() {
  const queryClient = useQueryClient()
  const [filters, setFilters] = useState<BookingFilters>({
    page: 1,
    limit: 10,
    search: '',
    status: undefined,
  })
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const debouncedSearch = useMemo(
    () => debounce((value: string) => setFilters((prev) => ({ ...prev, search: value, page: 1 })), 400),
    [],
  )

  const { data: bookingsData, isLoading: isLoadingBookings, error: bookingsError, refetch: refetchBookings } =
    useQuery({ queryKey: ['bookings', filters], queryFn: () => getBookings(filters) })

  const { data: statistics, isLoading: isLoadingStats } = useQuery({
    queryKey: ['booking-statistics'],
    queryFn: getBookingStatistics,
  })

  const { data: bookingDetails, isLoading: isLoadingDetails } = useQuery({
    queryKey: ['booking-details', selectedBooking?.id],
    queryFn: () => getBookingById(selectedBooking!.id),
    enabled: !!selectedBooking && isDrawerOpen,
  })

  const statusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: BookingStatus }) =>
      status === 'completed'
        ? (await import('@/services/bookings.service')).completeBooking(id)
        : (await import('@/services/bookings.service')).cancelBooking(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] })
      queryClient.invalidateQueries({ queryKey: ['booking-statistics'] })
      toast.success('Booking updated successfully')
    },
    onError: () => toast.error('Failed to update booking'),
  })

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => debouncedSearch(e.target.value)

  const handleStatusFilterChange = (status: BookingStatus | undefined) =>
    setFilters((prev) => ({ ...prev, status, page: 1 }))

  const handlePageChange = (page: number) => setFilters((prev) => ({ ...prev, page }))

  const handleViewDetails = (booking: Booking) => {
    setSelectedBooking(booking)
    setIsDrawerOpen(true)
  }

  const handleStatusChange = async (id: string, status: BookingStatus) => {
    await statusMutation.mutateAsync({ id, status })
    setIsDrawerOpen(false)
    setSelectedBooking(null)
  }

  const handleResetFilters = () => setFilters({ page: 1, limit: 10, search: '', status: undefined })

  const bookings = bookingsData?.items ?? []
  const hasFilters = Boolean(filters.search || filters.status)

  if (bookingsError) {
    return (
      <PageContainer>
        <PageHeader title="Bookings" description="Monitor and manage every booking across the SkillBridge platform." />
        <ErrorState
          title="Failed to load bookings"
          description="There was an error fetching the bookings. Please try again."
          onRetry={() => refetchBookings()}
        />
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <PageHeader
        title="Bookings"
        description="Monitor and manage every booking across the SkillBridge platform."
        actions={
          <Button variant="outline" onClick={() => refetchBookings()} disabled={isLoadingBookings}>
            <RefreshCw className={`size-4 mr-2 ${isLoadingBookings ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-6">
        {isLoadingStats ? (
          [1, 2, 3].map((i) => <Skeleton key={i} className="h-24" />)
        ) : statistics ? (
          <>
            <StatCard label="Total Bookings" value={statistics.total} icon={<CalendarDays className="size-8 text-primary" />} />
            <StatCard label="Revenue" value={`GH₵ ${statistics.revenue.toLocaleString()}`} icon={<TrendingUp className="size-8 text-success" />} />
            <StatCard
              label="Completed"
              value={statistics.byStatus.completed ?? 0}
              icon={<CalendarDays className="size-8 text-secondary" />}
            />
          </>
        ) : null}
      </div>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center gap-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by service, student, or artisan..."
              className="pl-9"
              defaultValue={filters.search}
              onChange={handleSearchChange}
            />
          </div>
          <Button variant="outline" onClick={handleResetFilters} disabled={!hasFilters}>
            Reset
          </Button>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {STATUS_FILTERS.map((status) => (
            <Button
              key={String(status)}
              variant={filters.status === status ? 'primary' : 'outline'}
              size="sm"
              onClick={() => handleStatusFilterChange(status)}
            >
              {STATUS_LABELS[String(status)]}
            </Button>
          ))}
        </div>
      </div>

      {isLoadingBookings ? (
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
      ) : bookings.length > 0 ? (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Service</TableHead>
                <TableHead>Student</TableHead>
                <TableHead>Artisan</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Scheduled</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell>
                    <p className="font-medium text-sm">{booking.serviceTitle}</p>
                    <p className="text-xs text-muted-foreground">{booking.id.slice(0, 8)}</p>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="size-7">
                        <AvatarImage src={booking.student.profileImageUrl || undefined} alt={booking.student.name} />
                        <AvatarFallback className="bg-primary text-primary-foreground text-[10px]">
                          {getInitials(booking.student.name)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{booking.student.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{booking.artisan.user.name}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm font-medium">GH₵ {booking.price}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">
                      {booking.scheduledTime ? format(new Date(booking.scheduledTime), 'MMM dd, yyyy') : '—'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <BookingStatusBadge status={booking.status} />
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="size-8">
                          <MoreVertical className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleViewDetails(booking)}>
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
          {bookingsData && (
            <div className="mt-4">
              <Pagination page={bookingsData.page} totalPages={bookingsData.totalPages} onPageChange={handlePageChange} />
            </div>
          )}
        </>
      ) : (
        <EmptyState
          title="No bookings found"
          description={
            hasFilters
              ? 'No bookings match your current filters.'
              : 'No bookings have been created yet.'
          }
          actionLabel={hasFilters ? 'Clear Filters' : undefined}
          onAction={hasFilters ? handleResetFilters : undefined}
        />
      )}

      <BookingDetailsDrawer
        booking={bookingDetails || selectedBooking}
        isLoading={isLoadingDetails}
        isOpen={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false)
          setSelectedBooking(null)
        }}
        onStatusChange={handleStatusChange}
        isActionLoading={statusMutation.isPending}
      />
    </PageContainer>
  )
}

function StatCard({ label, value, icon }: { label: string; value: number | string; icon: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-border p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
        {icon}
      </div>
    </div>
  )
}
