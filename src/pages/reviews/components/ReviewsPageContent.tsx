import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { debounce } from 'lodash-es'
import { PageContainer } from '@/components/layout/PageContainer'
import { PageHeader } from '@/components/feedback/PageHeader'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/common/Table'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { ErrorState } from '@/components/common/ErrorState'
import { EmptyState } from '@/components/common/EmptyState'
import { Pagination } from '@/components/common/Pagination'
import { ReviewDetailsDrawer } from '@/components/reviews/ReviewDetailsDrawer'
import { RatingStars } from '@/components/reviews/RatingStars'
import { getReviews, getReviewById, getReviewStatistics } from '@/services/reviews.service'
import type { Review, ReviewFilters } from '@/types/review.types'
import { format } from 'date-fns'
import { Search, MoreVertical, Eye, Star, RefreshCw, Flag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .map((p) => p.charAt(0))
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export function ReviewsPageContent() {
  const [filters, setFilters] = useState<ReviewFilters>({
    page: 1,
    limit: 10,
    search: '',
    flagged: undefined,
  })
  const [selectedReview, setSelectedReview] = useState<Review | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const debouncedSearch = useMemo(
    () => debounce((value: string) => setFilters((prev) => ({ ...prev, search: value, page: 1 })), 400),
    [],
  )

  const { data: reviewsData, isLoading: isLoadingReviews, error: reviewsError, refetch: refetchReviews } =
    useQuery({ queryKey: ['reviews', filters], queryFn: () => getReviews(filters) })

  const { data: statistics, isLoading: isLoadingStats } = useQuery({
    queryKey: ['review-statistics'],
    queryFn: getReviewStatistics,
  })

  const { data: reviewDetails, isLoading: isLoadingDetails } = useQuery({
    queryKey: ['review-details', selectedReview?.id],
    queryFn: () => getReviewById(selectedReview!.id),
    enabled: !!selectedReview && isDrawerOpen,
  })

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => debouncedSearch(e.target.value)
  const handleFlaggedChange = (flagged: boolean | undefined) => setFilters((prev) => ({ ...prev, flagged, page: 1 }))
  const handlePageChange = (page: number) => setFilters((prev) => ({ ...prev, page }))
  const handleViewDetails = (review: Review) => {
    setSelectedReview(review)
    setIsDrawerOpen(true)
  }
  const handleResetFilters = () => setFilters({ page: 1, limit: 10, search: '', flagged: undefined })

  const reviews = reviewsData?.items ?? []
  const hasFilters = Boolean(filters.search || filters.flagged !== undefined)

  if (reviewsError) {
    return (
      <PageContainer>
        <PageHeader title="Reviews & Ratings" description="Monitor and moderate student feedback across the SkillBridge platform." />
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
        description="Monitor student feedback across the SkillBridge platform."
        actions={
          <Button variant="outline" onClick={() => refetchReviews()} disabled={isLoadingReviews}>
            <RefreshCw className={`size-4 mr-2 ${isLoadingReviews ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-6">
        {isLoadingStats ? (
          [1, 2, 3].map((i) => <Skeleton key={i} className="h-24" />)
        ) : statistics ? (
          <>
            <StatCard label="Total Reviews" value={statistics.total} icon={<Star className="size-8 text-primary" />} />
            <StatCard label="Flagged" value={statistics.flagged} icon={<Flag className="size-8 text-danger" />} />
            <StatCard label="Average Rating" value={statistics.averageRating.toFixed(2)} icon={<Star className="size-8 text-warning" />} />
          </>
        ) : null}
      </div>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center gap-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by student, artisan, or comment..."
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
          <Button variant={filters.flagged === undefined ? 'primary' : 'outline'} size="sm" onClick={() => handleFlaggedChange(undefined)}>All</Button>
          <Button variant={filters.flagged === true ? 'primary' : 'outline'} size="sm" onClick={() => handleFlaggedChange(true)}>Flagged</Button>
          <Button variant={filters.flagged === false ? 'primary' : 'outline'} size="sm" onClick={() => handleFlaggedChange(false)}>Not Flagged</Button>
        </div>
      </div>

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
              <Skeleton className="size-8" />
            </div>
          ))}
        </div>
      ) : reviews.length > 0 ? (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Rating</TableHead>
                <TableHead>Student</TableHead>
                <TableHead>Artisan</TableHead>
                <TableHead>Comment</TableHead>
                <TableHead>Flagged</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reviews.map((review) => (
                <TableRow key={review.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <RatingStars rating={review.rating} />
                      <span className="text-sm font-medium">{review.rating}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="size-8">
                        <AvatarImage src={review.student.profileImageUrl || undefined} alt={review.student.name} />
                        <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                          {getInitials(review.student.name)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium">{review.student.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{review.artisan.user.name}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm max-w-[260px] truncate block">{review.comment}</span>
                  </TableCell>
                  <TableCell>
                    {review.isFlagged ? <Flag className="size-4 text-danger" /> : <span className="text-sm text-muted-foreground">—</span>}
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{format(new Date(review.createdAt), 'MMM dd, yyyy')}</span>
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
          {reviewsData && (
            <div className="mt-4">
              <Pagination page={reviewsData.page} totalPages={reviewsData.totalPages} onPageChange={handlePageChange} />
            </div>
          )}
        </>
      ) : (
        <EmptyState
          title="No reviews found"
          description={hasFilters ? 'No reviews match your current filters.' : 'No reviews have been submitted yet.'}
          actionLabel={hasFilters ? 'Clear Filters' : undefined}
          onAction={hasFilters ? handleResetFilters : undefined}
        />
      )}

      <ReviewDetailsDrawer
        review={reviewDetails || selectedReview}
        isLoading={isLoadingDetails}
        isOpen={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false)
          setSelectedReview(null)
        }}
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
