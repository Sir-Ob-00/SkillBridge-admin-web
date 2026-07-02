import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { formatDistanceToNow } from 'date-fns'
import type { RecentActivityItem } from '@/types/dashboard.types'
import {
  UserPlus,
  CheckCircle,
  XCircle,
  FileText,
  Star,
  Calendar,
  AlertCircle,
} from 'lucide-react'

interface RecentActivityProps {
  activities: RecentActivityItem[]
  isLoading?: boolean
}

const activityIcons: Record<string, React.ReactNode> = {
  user_registration: <UserPlus className="size-4 text-success" />,
  verification_approved: <CheckCircle className="size-4 text-success" />,
  verification_rejected: <XCircle className="size-4 text-danger" />,
  verification_pending: <AlertCircle className="size-4 text-warning" />,
  booking_completed: <Calendar className="size-4 text-primary" />,
  booking_cancelled: <XCircle className="size-4 text-danger" />,
  review_submitted: <Star className="size-4 text-warning" />,
  report_submitted: <FileText className="size-4 text-danger" />,
  default: <AlertCircle className="size-4 text-muted-foreground" />,
}

export function RecentActivity({ activities, isLoading }: RecentActivityProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="size-8 rounded-full bg-muted animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-3/4 bg-muted rounded animate-pulse" />
                <div className="h-3 w-1/2 bg-muted rounded animate-pulse" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    )
  }

  if (activities.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground text-sm">
            No recent activity to display
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity, index) => {
            const icon = activityIcons[activity.type] || activityIcons.default
            const timeAgo = formatDistanceToNow(new Date(activity.createdAt), {
              addSuffix: true,
            })

            return (
              <div key={activity.id}>
                <div className="flex items-start gap-3">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted">
                    {icon}
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {activity.message}
                    </p>
                    <p className="text-xs text-muted-foreground">{timeAgo}</p>
                  </div>
                </div>
                {index < activities.length - 1 && (
                  <Separator className="my-4 ml-11" />
                )}
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
