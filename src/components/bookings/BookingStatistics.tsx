import { StatTileGrid, type StatTileItem } from '@/components/common/StatTile'
import type { BookingStatistics } from '@/types/booking.types'
import { Calendar, Clock, CheckCircle, XCircle, AlertCircle, TrendingUp } from 'lucide-react'

interface BookingStatisticsProps {
  statistics: BookingStatistics
}

export function BookingStatistics({ statistics }: BookingStatisticsProps) {
  const items: StatTileItem[] = [
    { label: 'Total Bookings', value: statistics.totalBookings, icon: Calendar },
    {
      label: 'Pending',
      value: statistics.pending,
      icon: Clock,
      valueClassName: 'text-warning',
      iconClassName: 'text-warning',
    },
    {
      label: 'Active Jobs',
      value: statistics.activeJobs,
      icon: TrendingUp,
      valueClassName: 'text-blue-500',
      iconClassName: 'text-blue-500',
    },
    {
      label: 'Completed',
      value: statistics.completed,
      icon: CheckCircle,
      valueClassName: 'text-success',
      iconClassName: 'text-success',
    },
    {
      label: 'Cancelled',
      value: statistics.cancelled,
      icon: XCircle,
      valueClassName: 'text-muted-foreground',
      iconClassName: 'text-muted-foreground',
    },
    {
      label: 'Disputed',
      value: statistics.disputed,
      icon: AlertCircle,
      valueClassName: 'text-danger',
      iconClassName: 'text-danger',
    },
    { label: "Today's Bookings", value: statistics.todayBookings, icon: Calendar },
    { label: 'This Month', value: statistics.monthBookings, icon: Calendar },
  ]

  return <StatTileGrid items={items} />
}
