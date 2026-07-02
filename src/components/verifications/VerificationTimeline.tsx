import { format } from 'date-fns'
import type { VerificationHistory } from '@/types/verification.types'
import { Clock, CheckCircle, XCircle, AlertCircle, FileText } from 'lucide-react'

interface VerificationTimelineProps {
  history: VerificationHistory[]
}

function getActionIcon(action: VerificationHistory['action']) {
  switch (action) {
    case 'submitted':
      return FileText
    case 'opened':
      return Clock
    case 'reviewed':
      return FileText
    case 'approved':
      return CheckCircle
    case 'rejected':
      return XCircle
    case 'requested_info':
      return AlertCircle
    default:
      return Clock
  }
}

function getActionColor(action: VerificationHistory['action']): string {
  switch (action) {
    case 'submitted':
      return 'text-muted-foreground'
    case 'opened':
      return 'text-muted-foreground'
    case 'reviewed':
      return 'text-muted-foreground'
    case 'approved':
      return 'text-success'
    case 'rejected':
      return 'text-danger'
    case 'requested_info':
      return 'text-warning'
    default:
      return 'text-muted-foreground'
  }
}

function getActionLabel(action: VerificationHistory['action']): string {
  switch (action) {
    case 'submitted':
      return 'Submitted'
    case 'opened':
      return 'Opened'
    case 'reviewed':
      return 'Reviewed'
    case 'approved':
      return 'Approved'
    case 'rejected':
      return 'Rejected'
    case 'requested_info':
      return 'Requested Information'
    default:
      return action
  }
}

export function VerificationTimeline({ history }: VerificationTimelineProps) {
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
              {item.note && (
                <p className="text-sm text-muted-foreground mt-2 bg-muted/50 p-2 rounded">
                  {item.note}
                </p>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
