import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { StatusHistoryItem } from '@/types/artisanApplication.types'
import { format } from 'date-fns'
import { CheckCircle, Clock, XCircle, AlertCircle } from 'lucide-react'

interface StatusTimelineProps {
  history: StatusHistoryItem[]
}

export function StatusTimeline({ history }: StatusTimelineProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="size-4 text-success" />
      case 'rejected':
        return <XCircle className="size-4 text-danger" />
      case 'changes_requested':
        return <AlertCircle className="size-4 text-warning" />
      case 'under_review':
        return <Clock className="size-4 text-primary" />
      case 'pending':
      default:
        return <Clock className="size-4 text-muted-foreground" />
    }
  }

  const getStatusLabel = (status: string) => {
    return status.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())
  }

  const sortedHistory = [...history].sort((a, b) => 
    new Date(b.changedAt).getTime() - new Date(a.changedAt).getTime()
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Status History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sortedHistory.map((item, index) => (
            <div key={item.id} className="flex gap-3">
              <div className="flex flex-col items-center">
                <div className="size-8 rounded-full bg-muted flex items-center justify-center">
                  {getStatusIcon(item.status)}
                </div>
                {index < sortedHistory.length - 1 && (
                  <div className="w-0.5 h-full bg-border mt-2" />
                )}
              </div>
              <div className="flex-1 pb-4">
                <div className="flex items-center justify-between">
                  <p className="font-medium">{getStatusLabel(item.status)}</p>
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(item.changedAt), 'MMM dd, yyyy • HH:mm')}
                  </p>
                </div>
                <p className="text-sm text-muted-foreground">Changed by: {item.changedBy}</p>
                {item.notes && (
                  <p className="text-sm mt-1 p-2 bg-muted rounded">{item.notes}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
