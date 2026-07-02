import { format } from 'date-fns'
import type { ReportTimeline } from '@/types/report.types'
import { Clock, User, FileText, CheckCircle, XCircle, AlertTriangle } from 'lucide-react'

interface ReportTimelineProps {
  timeline: ReportTimeline[]
}

function getActionIcon(action: ReportTimeline['action']) {
  switch (action) {
    case 'submitted':
      return FileText
    case 'assigned':
      return User
    case 'status_changed':
      return AlertTriangle
    case 'note_added':
      return FileText
    case 'resolved':
      return CheckCircle
    case 'dismissed':
      return XCircle
    default:
      return Clock
  }
}

function getActionColor(action: ReportTimeline['action']): string {
  switch (action) {
    case 'submitted':
      return 'text-muted-foreground'
    case 'assigned':
      return 'text-blue-500'
    case 'status_changed':
      return 'text-purple-500'
    case 'note_added':
      return 'text-muted-foreground'
    case 'resolved':
      return 'text-success'
    case 'dismissed':
      return 'text-muted-foreground'
    default:
      return 'text-muted-foreground'
  }
}

function getActionLabel(action: ReportTimeline['action']): string {
  switch (action) {
    case 'submitted':
      return 'Report Submitted'
    case 'assigned':
      return 'Report Assigned'
    case 'status_changed':
      return 'Status Changed'
    case 'note_added':
      return 'Note Added'
    case 'resolved':
      return 'Report Resolved'
    case 'dismissed':
      return 'Report Dismissed'
    default:
      return action
  }
}

export function ReportTimeline({ timeline }: ReportTimelineProps) {
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
        const Icon = getActionIcon(item.action)
        const color = getActionColor(item.action)
        const label = getActionLabel(item.action)
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
              {item.notes && (
                <p className="text-sm text-muted-foreground mt-2 bg-muted/50 p-2 rounded">
                  {item.notes}
                </p>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
