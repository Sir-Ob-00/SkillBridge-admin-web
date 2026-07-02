import { format } from 'date-fns'
import type { ReviewHistory } from '@/types/review.types'
import { Clock, EyeOff, Eye, AlertTriangle, Trash2, FileText } from 'lucide-react'

interface ReviewTimelineProps {
  history: ReviewHistory[]
}

function getActionIcon(action: ReviewHistory['action']) {
  switch (action) {
    case 'submitted':
      return FileText
    case 'hidden':
      return EyeOff
    case 'restored':
      return Eye
    case 'flagged':
      return AlertTriangle
    case 'removed':
      return Trash2
    case 'note_added':
      return FileText
    default:
      return Clock
  }
}

function getActionColor(action: ReviewHistory['action']): string {
  switch (action) {
    case 'submitted':
      return 'text-muted-foreground'
    case 'hidden':
      return 'text-muted-foreground'
    case 'restored':
      return 'text-success'
    case 'flagged':
      return 'text-warning'
    case 'removed':
      return 'text-danger'
    case 'note_added':
      return 'text-muted-foreground'
    default:
      return 'text-muted-foreground'
  }
}

function getActionLabel(action: ReviewHistory['action']): string {
  switch (action) {
    case 'submitted':
      return 'Review Submitted'
    case 'hidden':
      return 'Review Hidden'
    case 'restored':
      return 'Review Restored'
    case 'flagged':
      return 'Review Flagged'
    case 'removed':
      return 'Review Removed'
    case 'note_added':
      return 'Note Added'
    default:
      return action
  }
}

export function ReviewTimeline({ history }: ReviewTimelineProps) {
  if (!history || history.length === 0) {
    return (
      <div className="text-center py-8">
        <Clock className="size-8 text-muted-foreground mx-auto mb-2" />
        <p className="text-sm text-muted-foreground">No history available</p>
      </div>
    )
  }

  const sortedHistory = [...history].sort(
    (a, b) => new Date(a.performedAt).getTime() - new Date(b.performedAt).getTime(),
  )

  return (
    <div className="space-y-4">
      {sortedHistory.map((item, index) => {
        const Icon = getActionIcon(item.action)
        const color = getActionColor(item.action)
        const label = getActionLabel(item.action)
        const isLast = index === sortedHistory.length - 1

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
