import { format } from 'date-fns'
import type { BookingTimeline } from '@/types/booking.types'
import { Clock, CheckCircle, XCircle, AlertCircle, Play, Calendar, Ban } from 'lucide-react'

interface BookingTimelineProps {
  timeline: BookingTimeline[]
}

function getEventIcon(event: BookingTimeline['event']) {
  switch (event) {
    case 'created':
      return Calendar
    case 'accepted':
      return CheckCircle
    case 'rejected':
      return XCircle
    case 'started':
      return Play
    case 'completed':
      return CheckCircle
    case 'cancelled':
      return Ban
    case 'disputed':
      return AlertCircle
    case 'resolved':
      return CheckCircle
    default:
      return Clock
  }
}

function getEventColor(event: BookingTimeline['event']): string {
  switch (event) {
    case 'created':
      return 'text-muted-foreground'
    case 'accepted':
      return 'text-blue-500'
    case 'rejected':
      return 'text-danger'
    case 'started':
      return 'text-purple-500'
    case 'completed':
      return 'text-success'
    case 'cancelled':
      return 'text-muted-foreground'
    case 'disputed':
      return 'text-danger'
    case 'resolved':
      return 'text-success'
    default:
      return 'text-muted-foreground'
  }
}

function getEventLabel(event: BookingTimeline['event']): string {
  switch (event) {
    case 'created':
      return 'Booking Created'
    case 'accepted':
      return 'Artisan Accepted'
    case 'rejected':
      return 'Artisan Rejected'
    case 'started':
      return 'Work Started'
    case 'completed':
      return 'Booking Completed'
    case 'cancelled':
      return 'Booking Cancelled'
    case 'disputed':
      return 'Dispute Raised'
    case 'resolved':
      return 'Dispute Resolved'
    default:
      return event
  }
}

export function BookingTimeline({ timeline }: BookingTimelineProps) {
  if (!timeline || timeline.length === 0) {
    return (
      <div className="text-center py-8">
        <Clock className="size-8 text-muted-foreground mx-auto mb-2" />
        <p className="text-sm text-muted-foreground">No timeline available</p>
      </div>
    )
  }

  const sortedTimeline = [...timeline].sort(
    (a, b) => new Date(a.performedAt).getTime() - new Date(b.performedAt).getTime(),
  )

  return (
    <div className="space-y-4">
      {sortedTimeline.map((item, index) => {
        const Icon = getEventIcon(item.event)
        const color = getEventColor(item.event)
        const label = getEventLabel(item.event)
        const isLast = index === sortedTimeline.length - 1

        return (
          <div key={item.id} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div className={`size-8 rounded-full bg-muted flex items-center justify-center ${color}`}>
                <Icon className="size-4" />
              </div>
              {!isLast && <div className="w-0.5 h-full bg-border mt-2" />}
            </div>
            <div className="flex-1 pb-4">
              <div className="flex items-center justify-between mb-1">
                <p className="font-medium text-sm">{label}</p>
                <span className="text-xs text-muted-foreground">
                  {format(new Date(item.performedAt), 'MMM dd, yyyy • HH:mm')}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">By {item.performedBy}</p>
              {item.description && (
                <p className="text-sm text-muted-foreground mt-2 bg-muted/50 p-2 rounded">
                  {item.description}
                </p>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
