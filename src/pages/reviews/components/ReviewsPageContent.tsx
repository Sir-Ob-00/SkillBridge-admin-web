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
import { ReviewDetailsDrawer } from '@/components/reviews/ReviewDetailsDrawer'
import { ReviewStatistics } from '@/components/reviews/ReviewStatistics'
import { RatingStars } from '@/components/reviews/RatingStars'
import { ReviewStatusBadge } from '@/components/reviews/ReviewStatusBadge'
import {
  getReviews,
  getReviewById,
  hideReview,
  restoreReview,
  flagReview,
  deleteReview,
  getReviewStatistics,
  exportReviews,
} from '@/services/reviews.service'
import type { Review, ReviewFilters, ReviewStatus } from '@/types/review.types'
import { format } from 'date-fns'
import { Search, MoreVertical, Eye, Download, RefreshCw, Star } from 'lucide-react'
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

export default function Reviews() {
  const queryClient = useQueryClient()
  const [filters, setFilters] = useState<ReviewFilters>({
    page: 1,
    limit: 10,
    search: '',
    status: undefined,
    rating: undefined,
    categoryId: undefined,
    sortBy: 'newest',
  })
  const [selectedReview, setSelectedReview] = useState<Review | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const debouncedSearch = useMemo(
    () =>
      debounce((value: string) => {
        setFilters((prev) => ({ ...prev, search: value, page: 1 }))
      }, 400),
    [],
  )

  const {
    data: reviewsData,
    isLoading: isLoadingReviews,
    error: reviewsError,
    refetch: refetchReviews,
  } = useQuery({
    queryKey: ['reviews', filters],
    queryFn: () => getReviews(filters),
  })

  const { data: statistics, isLoading: isLoadingStats } = useQuery({
    queryKey: ['review-statistics'],
    queryFn: getReviewStatistics,
  })

  const { data: reviewDetails, isLoading: isLoadingDetails } = useQuery({
    queryKey: ['review-details', selectedReview?.id],
    queryFn: () => getReviewById(selectedReview!.id),
    enabled: !!selectedReview && isDrawerOpen,
  })

  const hideMutation = useMutation({
    mutationFn: ({ id, reason, note }: { id: string; reason?: string; note?: string }) => hideReview(id, { reason, note }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] })
      queryClient.invalidateQueries({ queryKey: ['review-statistics'] })
      toast.success('Review hidden successfully')
    },
    onError: () => {
      toast.error('Failed to hide review')
    },
  })

  const restoreMutation = useMutation({
    mutationFn: ({ id, note }: { id: string; note?: string }) => restoreReview(id, { note }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] })
      queryClient.invalidateQueries({ queryKey: ['review-statistics'] })
      toast.success('Review restored successfully')
    },
    onError: () => {
      toast.error('Failed to restore review')
    },
  })

  const flagMutation = useMutation({
    mutationFn: ({ id, reason, note }: { id: string; reason: string; note?: string }) => flagReview(id, { reason, note }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] })
      queryClient.invalidateQueries({ queryKey: ['review-statistics'] })
      toast.success('Review flagged successfully')
    },
    onError: () => {
      toast.error('Failed to flag review')
    },
  })

  const deleteMutation = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) => deleteReview(id, { reason }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] })
      queryClient.invalidateQueries({ queryKey: ['review-statistics'] })
      toast.success('Review deleted successfully')
    },
    onError: () => {
      toast.error('Failed to delete review')
    },
  })

  const exportMutation = useMutation({
    mutationFn: () => exportReviews(filters),
    onSuccess: (blob) => {
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `reviews-export-${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      toast.success('Reviews exported successfully')
    },
    onError: () => {
      toast.error('Failed to export reviews')
    },
  })

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    debouncedSearch(value)
  }

  const handleStatusFilterChange = (status: ReviewStatus | undefined) => {
    setFilters((prev) => ({ ...prev, status, page: 1 }))
  }

  const handleRatingFilterChange = (rating: number | undefined) => {
    setFilters((prev) => ({ ...prev, rating, page: 1 }))
  }

  const handleSortChange = (sortBy: 'newest' | 'oldest' | 'highest_rating' | 'lowest_rating' | 'recently_updated') => {
    setFilters((prev) => ({ ...prev, sortBy, page: 1 }))
  }

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }))
  }

  const handleViewDetails = (review: Review) => {
    setSelectedReview(review)
    setIsDrawerOpen(true)
  }

  const handleHide = async (id: string, reason?: string, note?: string) => {
    await hideMutation.mutateAsync({ id, reason, note })
    if (selectedReview?.id === id) {
      setIsDrawerOpen(false)
      setSelectedReview(null)
    }
  }

  const handleRestore = async (id: string, note?: string) => {
    await restoreMutation.mutateAsync({ id, note })
    if (selectedReview?.id === id) {
      setIsDrawerOpen(false)
      setSelectedReview(null)
    }
  }

  const handleFlag = async (id: string, reason: string, note?: string) => {
    await flagMutation.mutateAsync({ id, reason, note })
  }

  const handleDelete = async (id: string, reason: string) => {
    await deleteMutation.mutateAsync({ id, reason })
  }

  const handleExport = () => {
    exportMutation.mutate()
  }

  const handleRefresh = () => {
    refetchReviews()
  }

  const handleResetFilters = () => {
    setFilters({ page: 1, limit: 10, search: '', status: undefined, rating: undefined, categoryId: undefined, sortBy: 'newest' })
  }

  if (reviewsError) {
    return (
      <PageContainer>
        <PageHeader
          title="Reviews & Ratings"
          description="Monitor and moderate student feedback across the SkillBridge platform."
        />
        <ErrorState
          title="Failed to load reviews"
          description="There was an error fetching the reviews. Please try again."
          onRetry={() => refetchReviews()}
        />
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <PageHeader
        title="Reviews & Ratings"
        description="Monitor and moderate student feedback across the SkillBridge platform."
        actions={
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleExport}
              disabled={exportMutation.isPending}
            >
              <Download className="size-4 mr-2" />
              Export Reviews
            </Button>
            <Button
              variant="outline"
              onClick={handleRefresh}
              disabled={isLoadingReviews}
            >
              <RefreshCw className={`size-4 mr-2 ${isLoadingReviews ? 'animate-spin' : ''}`} />
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
          <ReviewStatistics statistics={statistics} />
        </div>
      ) : null}

      {/* Filter Toolbar */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center gap-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by student, artisan, booking ID, or review text..."
              className="pl-9"
              defaultValue={filters.search}
              onChange={handleSearchChange}
            />
          </div>
          <Button
            variant="outline"
            onClick={handleResetFilters}
            disabled={!filters.search && !filters.status && !filters.rating && !filters.categoryId}
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
              variant={filters.status === 'visible' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => handleStatusFilterChange('visible')}
            >
              Visible
            </Button>
            <Button
              variant={filters.status === 'hidden' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => handleStatusFilterChange('hidden')}
            >
              Hidden
            </Button>
            <Button
              variant={filters.status === 'flagged' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => handleStatusFilterChange('flagged')}
            >
              Flagged
            </Button>
            <Button
              variant={filters.status === 'removed' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => handleStatusFilterChange('removed')}
            >
              Removed
            </Button>
          </div>
          <div className="flex items-center gap-1 border-r border-border pr-2">
            {[5, 4, 3, 2, 1].map((rating) => (
              <Button
                key={rating}
                variant={filters.rating === rating ? 'primary' : 'outline'}
                size="sm"
                onClick={() => handleRatingFilterChange(filters.rating === rating ? undefined : rating)}
              >
                <Star className={`size-3 mr-1 ${filters.rating === rating ? 'fill-yellow-400 text-yellow-400' : ''}`} />
                {rating}
              </Button>
            ))}
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
            <Button
              variant={filters.sortBy === 'highest_rating' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => handleSortChange('highest_rating')}
            >
              Highest
            </Button>
            <Button
              variant={filters.sortBy === 'lowest_rating' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => handleSortChange('lowest_rating')}
            >
              Lowest
            </Button>
          </div>
        </div>
      </div>

      {/* Table */}
      {isLoadingReviews ? (
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
              <Skeleton className="size-8" />
            </div>
          ))}
        </div>
      ) : reviewsData?.data && reviewsData.data.length > 0 ? (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Rating</TableHead>
                <TableHead>Student</TableHead>
                <TableHead>Artisan</TableHead>
                <TableHead>Booking ID</TableHead>
                <TableHead>Comment Preview</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reviewsData.data.map((review) => (
                <TableRow key={review.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <RatingStars rating={review.rating} />
                      <span className="text-sm font-medium">{review.rating.toFixed(1)}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="size-8">
                        <AvatarImage src={review.studentAvatar || undefined} alt={`${review.studentFirstName} ${review.studentLastName}`} />
                        <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                          {getInitials(review.studentFirstName, review.studentLastName)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">
                          {review.studentFirstName} {review.studentLastName}
                        </p>
                        <p className="text-xs text-muted-foreground">{review.studentEmail}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="size-8">
                        <AvatarImage src={review.artisanAvatar || undefined} alt={`${review.artisanFirstName} ${review.artisanLastName}`} />
                        <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                          {getInitials(review.artisanFirstName, review.artisanLastName)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">
                          {review.artisanFirstName} {review.artisanLastName}
                        </p>
                        <p className="text-xs text-muted-foreground">{review.artisanBusinessName || review.artisanEmail}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm font-mono">{review.bookingId.slice(0, 8)}...</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm max-w-[200px] truncate block">
                      {review.comment}
                    </span>
                  </TableCell>
                  <TableCell>
                    <ReviewStatusBadge status={review.status} />
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">
                      {format(new Date(review.createdAt), 'MMM dd, yyyy')}
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
                        <DropdownMenuItem onClick={() => handleViewDetails(review)}>
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
              page={reviewsData.meta.page}
              totalPages={reviewsData.meta.totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </>
      ) : (
        <EmptyState
          title="No reviews found"
          description={
            filters.search || filters.status || filters.rating || filters.categoryId
              ? 'No reviews match your current filters.'
              : 'No reviews have been submitted yet.'
          }
          actionLabel={filters.search || filters.status || filters.rating || filters.categoryId ? 'Clear Filters' : undefined}
          onAction={filters.search || filters.status || filters.rating || filters.categoryId ? handleResetFilters : undefined}
        />
      )}

      {/* Review Details Drawer */}
      <ReviewDetailsDrawer
        review={reviewDetails || selectedReview}
        isLoading={isLoadingDetails}
        isOpen={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false)
          setSelectedReview(null)
        }}
        onHide={handleHide}
        onRestore={handleRestore}
        onFlag={handleFlag}
        onDelete={handleDelete}
      />
    </PageContainer>
  )
}
