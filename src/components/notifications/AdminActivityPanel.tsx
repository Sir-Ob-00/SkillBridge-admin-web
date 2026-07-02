import { useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useNotificationStore } from '@/stores/notificationStore'
import { format } from 'date-fns'
import { Activity, CheckCircle, AlertTriangle, ShieldAlert, X, Bell } from 'lucide-react'

interface AdminActivityPanelProps {
  isOpen: boolean
  onClose: () => void
}

function getActivityIcon(type: string) {
  switch (type) {
    case 'verification':
      return CheckCircle
    case 'report':
      return AlertTriangle
    case 'review_flag':
      return ShieldAlert
    case 'booking':
      return Activity
    default:
      return Bell
  }
}

function getActivityColor(type: string): string {
  switch (type) {
    case 'verification':
      return 'text-success'
    case 'report':
      return 'text-danger'
    case 'review_flag':
      return 'text-warning'
    case 'booking':
      return 'text-primary'
    default:
      return 'text-muted-foreground'
  }
}

function getActivityBadgeVariant(type: string): 'default' | 'secondary' | 'danger' | 'outline' {
  switch (type) {
    case 'verification':
      return 'default'
    case 'report':
      return 'danger'
    case 'review_flag':
      return 'secondary'
    case 'booking':
      return 'outline'
    default:
      return 'outline'
  }
}

export function AdminActivityPanel({ isOpen, onClose }: AdminActivityPanelProps) {
  const { activities, unreadCount, markAsRead } = useNotificationStore()
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen && unreadCount > 0) {
      markAsRead()
    }
  }, [isOpen, unreadCount, markAsRead])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0
    }
  }, [activities])

  if (!isOpen) return null

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-base flex items-center gap-2">
          <Activity className="size-4" />
          Recent Activity
          {unreadCount > 0 && (
            <Badge variant="danger" className="ml-2">
              {unreadCount}
            </Badge>
          )}
        </CardTitle>
        <Button variant="ghost" size="icon" onClick={onClose} className="size-8">
          <X className="size-4" />
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <div ref={scrollRef} className="h-[400px] overflow-y-auto p-4 space-y-3">
            {activities.length === 0 ? (
              <div className="text-center py-8">
                <Activity className="size-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No recent activity</p>
              </div>
            ) : (
              activities.map((item) => {
                const Icon = getActivityIcon(item.type)
                const color = getActivityColor(item.type)
                const badgeVariant = getActivityBadgeVariant(item.type)
                
                return (
                  <div
                    key={item.id}
                    className="flex gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div className={`size-8 rounded-full bg-background flex items-center justify-center ${color}`}>
                      <Icon className="size-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-medium truncate">{item.title}</p>
                        <Badge variant={badgeVariant} className="text-xs ml-2 shrink-0">
                          {item.type}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mb-1">{item.description}</p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(item.timestamp), 'MMM dd, yyyy • HH:mm')}
                      </p>
                    </div>
                  </div>
                )
              })
            )}
          </div>
      </CardContent>
    </Card>
  )
}
