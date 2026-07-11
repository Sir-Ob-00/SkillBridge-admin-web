import { StatTileGrid, type StatTileItem } from '@/components/common/StatTile'
import type { ReviewStatistics } from '@/types/review.types'
import { Star, EyeOff, AlertTriangle, Trash2, Calendar, TrendingUp } from 'lucide-react'

interface ReviewStatisticsProps {
  statistics: ReviewStatistics
}

export function ReviewStatistics({ statistics }: ReviewStatisticsProps) {
  const items: StatTileItem[] = [
    { label: 'Total Reviews', value: statistics.totalReviews, icon: Star },
    {
      label: 'Average Rating',
      value: statistics.averageRating.toFixed(1),
      icon: TrendingUp,
      iconClassName: 'text-success',
    },
    {
      label: 'Hidden Reviews',
      value: statistics.hiddenReviews,
      icon: EyeOff,
      valueClassName: 'text-muted-foreground',
      iconClassName: 'text-muted-foreground',
    },
    {
      label: 'Flagged Reviews',
      value: statistics.flaggedReviews,
      icon: AlertTriangle,
      valueClassName: 'text-warning',
      iconClassName: 'text-warning',
    },
    {
      label: 'Removed Reviews',
      value: statistics.removedReviews,
      icon: Trash2,
      valueClassName: 'text-danger',
      iconClassName: 'text-danger',
    },
    { label: "Today's Reviews", value: statistics.todayReviews, icon: Calendar },
    { label: 'This Month', value: statistics.monthReviews, icon: Calendar },
  ]

  return <StatTileGrid items={items} />
}
