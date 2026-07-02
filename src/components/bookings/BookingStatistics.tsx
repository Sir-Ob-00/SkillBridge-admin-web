import { Card, CardContent } from '@/components/ui/card'
import type { BookingStatistics } from '@/types/booking.types'
import { Calendar, Clock, CheckCircle, XCircle, AlertCircle, TrendingUp } from 'lucide-react'

interface BookingStatisticsProps {
  statistics: BookingStatistics
}

export function BookingStatistics({ statistics }: BookingStatisticsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Bookings</p>
              <p className="text-2xl font-bold">{statistics.totalBookings}</p>
            </div>
            <Calendar className="size-8 text-primary" />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Pending</p>
              <p className="text-2xl font-bold text-warning">{statistics.pending}</p>
            </div>
            <Clock className="size-8 text-warning" />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Active Jobs</p>
              <p className="text-2xl font-bold text-blue-500">{statistics.activeJobs}</p>
            </div>
            <TrendingUp className="size-8 text-blue-500" />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Completed</p>
              <p className="text-2xl font-bold text-success">{statistics.completed}</p>
            </div>
            <CheckCircle className="size-8 text-success" />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Cancelled</p>
              <p className="text-2xl font-bold text-muted-foreground">{statistics.cancelled}</p>
            </div>
            <XCircle className="size-8 text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Disputed</p>
              <p className="text-2xl font-bold text-danger">{statistics.disputed}</p>
            </div>
            <AlertCircle className="size-8 text-danger" />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Today's Bookings</p>
              <p className="text-2xl font-bold">{statistics.todayBookings}</p>
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
              <p className="text-2xl font-bold">{statistics.monthBookings}</p>
            </div>
            <Calendar className="size-8 text-primary" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
