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
import { BookingStatistics } from '@/components/bookings/BookingStatistics'
import { BookingStatusBadge } from '@/components/bookings/BookingStatusBadge'
import {
  getBookings,
  getBookingById,
  cancelBooking,
  completeBooking,
  disputeBooking,
  getBookingStatistics,
  exportBookings,
} from '@/services/bookings.service'
import type { Booking, BookingFilters, BookingStatus } from '@/types/booking.types'
import { format } from 'date-fns'
import { Search, MoreVertical, Eye, Download, RefreshCw } from 'lucide-react'
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

export default function Bookings() {
  const queryClient = useQueryClient()
  const [filters, setFilters] = useState<BookingFilters>({
    page: 1,
    limit: 10,
    search: '',
    status: undefined,
    categoryId: undefined,
    sortBy: 'newest',
  })
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const debouncedSearch = useMemo(
    () =>
      debounce((value: string) => {
        setFilters((prev) => ({ ...prev, search: value, page: 1 }))
      }, 400),
    [],
  )

  const {
    data: bookingsData,
    isLoading: isLoadingBookings,
    error: bookingsError,
    refetch: refetchBookings,
  } = useQuery({
    queryKey: ['bookings', filters],
    queryFn: () => getBookings(filters),
  })

  const { data: statistics, isLoading: isLoadingStats } = useQuery({
    queryKey: ['booking-statistics'],
    queryFn: getBookingStatistics,
  })

  const { data: bookingDetails, isLoading: isLoadingDetails } = useQuery({
    queryKey: ['booking-details', selectedBooking?.id],
    queryFn: () => getBookingById(selectedBooking!.id),
    enabled: !!selectedBooking && isDrawerOpen,
  })

  const cancelMutation = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) => cancelBooking(id, { reason }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] })
      queryClient.invalidateQueries({ queryKey: ['booking-statistics'] })
      toast.success('Booking cancelled successfully')
    },
    onError: () => {
      toast.error('Failed to cancel booking')
    },
  })

  const completeMutation = useMutation({
    mutationFn: ({ id, note }: { id: string; note?: string }) => completeBooking(id, { note }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] })
      queryClient.invalidateQueries({ queryKey: ['booking-statistics'] })
      toast.success('Booking completed successfully')
    },
    onError: () => {
      toast.error('Failed to complete booking')
    },
  })

  const disputeBookingMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) =>
      disputeBooking(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] })
      queryClient.invalidateQueries({ queryKey: ['booking-statistics'] })
      toast.success('Dispute resolved successfully')
    },
    onError: () => {
      toast.error('Failed to resolve dispute')
    },
  })

  const exportMutation = useMutation({
    mutationFn: () => exportBookings(filters),
    onSuccess: (blob) => {
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `bookings-export-${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      toast.success('Bookings exported successfully')
    },
    onError: () => {
      toast.error('Failed to export bookings')
    },
  })

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    debouncedSearch(value)
  }

  const handleStatusFilterChange = (status: BookingStatus | undefined) => {
    setFilters((prev) => ({ ...prev, status, page: 1 }))
  }

  const handleSortChange = (sortBy: 'newest' | 'oldest' | 'booking_date' | 'scheduled_date' | 'status' | 'amount') => {
    setFilters((prev) => ({ ...prev, sortBy, page: 1 }))
  }

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }))
  }

  const handleViewDetails = (booking: Booking) => {
    setSelectedBooking(booking)
    setIsDrawerOpen(true)
  }

  const handleCancel = async (id: string, reason?: string) => {
    await cancelMutation.mutateAsync({ id, reason })
    if (selectedBooking?.id === id) {
      setIsDrawerOpen(false)
      setSelectedBooking(null)
    }
  }

  const handleComplete = async (id: string, note?: string) => {
    await completeMutation.mutateAsync({ id, note })
    if (selectedBooking?.id === id) {
      setIsDrawerOpen(false)
      setSelectedBooking(null)
    }
  }

  const handleResolveDispute = async (id: string, payload: any) => {
    await disputeBookingMutation.mutateAsync({ id, payload })
    if (selectedBooking?.id === id) {
      setIsDrawerOpen(false)
      setSelectedBooking(null)
    }
  }

  const handleExport = () => {
    exportMutation.mutate()
  }

  const handleRefresh = () => {
    refetchBookings()
  }

  const handleResetFilters = () => {
    setFilters({ page: 1, limit: 10, search: '', status: undefined, categoryId: undefined, sortBy: 'newest' })
  }

  if (bookingsError) {
    return (
      <PageContainer>
        <PageHeader
          title="Bookings"
          description="Monitor and manage every booking across the SkillBridge platform."
        />
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
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleExport}
              disabled={exportMutation.isPending}
            >
              <Download className="size-4 mr-2" />
              Export CSV
            </Button>
            <Button
              variant="outline"
              onClick={handleRefresh}
              disabled={isLoadingBookings}
            >
              <RefreshCw className={`size-4 mr-2 ${isLoadingBookings ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        }
      />

      {/* Statistics Cards */}
      {isLoadingStats ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
      ) : statistics ? (
        <div className="mb-6">
          <BookingStatistics statistics={statistics} />
        </div>
      ) : null}

      {/* Filter Toolbar */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center gap-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by booking ID, student, artisan, phone, or email..."
              className="pl-9"
              defaultValue={filters.search}
              onChange={handleSearchChange}
            />
          </div>
          <Button
            variant="outline"
            onClick={handleResetFilters}
            disabled={!filters.search && !filters.status && !filters.categoryId}
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
              Pending
            </Button>
            <Button
              variant={filters.status === 'accepted' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => handleStatusFilterChange('accepted')}
            >
              Accepted
            </Button>
            <Button
              variant={filters.status === 'in_progress' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => handleStatusFilterChange('in_progress')}
            >
              In Progress
            </Button>
            <Button
              variant={filters.status === 'completed' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => handleStatusFilterChange('completed')}
            >
              Completed
            </Button>
            <Button
              variant={filters.status === 'cancelled' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => handleStatusFilterChange('cancelled')}
            >
              Cancelled
            </Button>
            <Button
              variant={filters.status === 'disputed' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => handleStatusFilterChange('disputed')}
            >
              Disputed
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
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="size-8" />
            </div>
          ))}
        </div>
      ) : bookingsData?.data && bookingsData.data.length > 0 ? (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Booking ID</TableHead>
                <TableHead>Student</TableHead>
                <TableHead>Artisan</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Booking Date</TableHead>
                <TableHead>Scheduled Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookingsData.data.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell>
                    <span className="text-sm font-mono">{booking.id.slice(0, 8)}...</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="size-8">
                        <AvatarImage src={booking.studentAvatar || undefined} alt={`${booking.studentFirstName} ${booking.studentLastName}`} />
                        <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                          {getInitials(booking.studentFirstName, booking.studentLastName)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">
                          {booking.studentFirstName} {booking.studentLastName}
                        </p>
                        <p className="text-xs text-muted-foreground">{booking.studentEmail}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="size-8">
                        <AvatarImage src={booking.artisanAvatar || undefined} alt={`${booking.artisanFirstName} ${booking.artisanLastName}`} />
                        <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                          {getInitials(booking.artisanFirstName, booking.artisanLastName)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">
                          {booking.artisanFirstName} {booking.artisanLastName}
                        </p>
                        <p className="text-xs text-muted-foreground">{booking.artisanBusinessName || booking.artisanEmail}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{booking.categoryName}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">
                      {format(new Date(booking.createdAt), 'MMM dd, yyyy')}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">
                      {format(new Date(booking.scheduledDate), 'MMM dd, yyyy')}
                    </span>
                  </TableCell>
                  <TableCell>
                    <BookingStatusBadge status={booking.status} />
                  </TableCell>
                  <TableCell>
                    <span className="text-sm capitalize">{booking.payment.status.replace('_', ' ')}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm font-medium">
                      {booking.payment.currency} {booking.payment.amount.toFixed(2)}
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
          <div className="mt-4">
            <Pagination
              page={bookingsData.meta.page}
              totalPages={bookingsData.meta.totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </>
      ) : (
        <EmptyState
          title="No bookings found"
          description={
            filters.search || filters.status || filters.categoryId
              ? 'No bookings match your current filters.'
              : 'No bookings have been created yet.'
          }
          actionLabel={filters.search || filters.status || filters.categoryId ? 'Clear Filters' : undefined}
          onAction={filters.search || filters.status || filters.categoryId ? handleResetFilters : undefined}
        />
      )}

      {/* Booking Details Drawer */}
      <BookingDetailsDrawer
        booking={bookingDetails || selectedBooking}
        isLoading={isLoadingDetails}
        isOpen={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false)
          setSelectedBooking(null)
        }}
        onCancel={handleCancel}
        onComplete={handleComplete}
        onResolveDispute={handleResolveDispute}
      />
    </PageContainer>
  )
}
