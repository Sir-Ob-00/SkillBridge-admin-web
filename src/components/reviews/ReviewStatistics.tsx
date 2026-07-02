import { Card, CardContent } from '@/components/ui/card'
import type { ReviewStatistics } from '@/types/review.types'
import { Star, EyeOff, AlertTriangle, Trash2, Calendar, TrendingUp } from 'lucide-react'

interface ReviewStatisticsProps {
  statistics: ReviewStatistics
}

export function ReviewStatistics({ statistics }: ReviewStatisticsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Reviews</p>
              <p className="text-2xl font-bold">{statistics.totalReviews}</p>
            </div>
            <Star className="size-8 text-primary" />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Average Rating</p>
              <p className="text-2xl font-bold">{statistics.averageRating.toFixed(1)}</p>
            </div>
            <TrendingUp className="size-8 text-success" />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Hidden Reviews</p>
              <p className="text-2xl font-bold text-muted-foreground">{statistics.hiddenReviews}</p>
            </div>
            <EyeOff className="size-8 text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Flagged Reviews</p>
              <p className="text-2xl font-bold text-warning">{statistics.flaggedReviews}</p>
            </div>
            <AlertTriangle className="size-8 text-warning" />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Removed Reviews</p>
              <p className="text-2xl font-bold text-danger">{statistics.removedReviews}</p>
            </div>
            <Trash2 className="size-8 text-danger" />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Today's Reviews</p>
              <p className="text-2xl font-bold">{statistics.todayReviews}</p>
            </div>
            <Calendar className="size-8 text-primary" />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">This Month</p>
              <p className="text-2xl font-bold">{statistics.monthReviews}</p>
            </div>
            <Calendar className="size-8 text-primary" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
