import { format } from 'date-fns'
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerTitle,
} from '@/components/ui/drawer'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { AuditLogStatusBadge } from '@/components/audit-logs/AuditLogStatusBadge'
import type { AuditLog } from '@/types/auditLog.types'
import { Copy, FileText, Globe, Tag } from 'lucide-react'

interface AuditLogDrawerProps {
  log: AuditLog | null
  isLoading?: boolean
  isOpen: boolean
  onClose: () => void
}

function getInitials(firstName: string, lastName: string): string {
  return `${firstName[0]}${lastName[0]}`.toUpperCase()
}

function formatLabel(value: string): string {
  return value
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (character) => character.toUpperCase())
}

function formatJsonValue(value: unknown): string {
  if (value === null || value === undefined) return ''
  if (typeof value === 'string') return value

  try {
    return JSON.stringify(value, null, 2)
  } catch {
    return String(value)
  }
}

function DetailRow({
  label,
  value,
}: {
  label: string
  value: React.ReactNode
}) {
  return (
    <div className="space-y-1">
      <p className="text-xs text-muted-foreground">{label}</p>
      <div className="text-sm font-medium text-foreground">{value}</div>
    </div>
  )
}

function JsonSection({
  title,
  value,
}: {
  title: string
  value: unknown
}) {
  const formatted = formatJsonValue(value)

  if (!formatted) return null

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-foreground">{title}</p>
      <pre className="max-h-64 overflow-auto rounded-lg border border-border bg-muted/40 p-4 font-mono text-xs leading-5 whitespace-pre-wrap break-words">
        {formatted}
      </pre>
    </div>
  )
}

export function AuditLogDrawer({
  log,
  isLoading = false,
  isOpen,
  onClose,
}: AuditLogDrawerProps) {
  const handleCopyId = () => {
    if (!log) return
    void navigator.clipboard.writeText(log.id)
  }

  if (isLoading) {
    return (
      <Drawer>
        <DrawerOverlay open={isOpen} onClose={onClose} />
        <DrawerContent open={isOpen} className="max-w-none sm:max-w-xl lg:max-w-4xl">
          <DrawerHeader>
            <Skeleton className="h-6 w-56" />
          </DrawerHeader>
          <DrawerBody className="space-y-4">
            <Skeleton className="h-28 w-full" />
            <Skeleton className="h-28 w-full" />
            <Skeleton className="h-28 w-full" />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    )
  }

  if (!log) return null

  return (
    <Drawer>
      <DrawerOverlay open={isOpen} onClose={onClose} />
      <DrawerContent open={isOpen} className="max-w-none sm:max-w-xl lg:max-w-4xl">
        <DrawerHeader>
          <div className="flex items-start justify-between gap-4">
            <div>
              <DrawerTitle>Audit Log Details</DrawerTitle>
              <p className="mt-1 text-sm text-muted-foreground">{log.id}</p>
            </div>
            <Button variant="ghost" size="icon" onClick={handleCopyId} aria-label="Copy log ID">
              <Copy className="size-4" />
            </Button>
          </div>
        </DrawerHeader>

        <DrawerBody className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Activity Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline">
                  <Tag className="mr-1 size-3" />
                  {formatLabel(log.action)}
                </Badge>
                <AuditLogStatusBadge status={log.status} />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <DetailRow
                  label="Log ID"
                  value={<span className="font-mono text-xs">{log.id}</span>}
                />
                <DetailRow
                  label="Timestamp"
                  value={format(new Date(log.timestamp), 'MMM dd, yyyy • HH:mm:ss')}
                />
                <DetailRow
                  label="Resource Affected"
                  value={
                    <span>
                      {log.resource}
                      {log.resourceId ? (
                        <span className="ml-2 font-mono text-xs text-muted-foreground">
                          {log.resourceId}
                        </span>
                      ) : null}
                    </span>
                  }
                />
                <DetailRow
                  label="IP Address"
                  value={log.ipAddress ?? '—'}
                />
                <DetailRow
                  label="User Agent"
                  value={log.userAgent ?? '—'}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Administrator</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <Avatar className="size-12">
                  {log.administrator.avatar ? (
                    <AvatarImage
                      src={log.administrator.avatar}
                      alt={`${log.administrator.firstName} ${log.administrator.lastName}`}
                    />
                  ) : null}
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {getInitials(log.administrator.firstName, log.administrator.lastName)}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <p className="font-medium">
                    {log.administrator.firstName} {log.administrator.lastName}
                  </p>
                  <p className="text-sm text-muted-foreground">{log.administrator.email}</p>
                  {log.administrator.role ? (
                    <Badge variant="outline" className="w-fit text-xs capitalize">
                      {log.administrator.role.replace(/_/g, ' ')}
                    </Badge>
                  ) : null}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Values</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <JsonSection title="Before Value" value={log.beforeValue} />
              <JsonSection title="After Value" value={log.afterValue} />
              <JsonSection title="Payload" value={log.payload} />
              <JsonSection title="Metadata" value={log.metadata} />
              {!log.beforeValue && !log.afterValue && !log.payload && !log.metadata ? (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <FileText className="size-4" />
                  No structured payload available for this log entry.
                </div>
              ) : null}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Context</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <DetailRow label="Action Performed" value={formatLabel(log.action)} />
              <DetailRow label="Resource Name" value={log.resource} />
              <DetailRow label="Status" value={<AuditLogStatusBadge status={log.status} />} />
              <DetailRow label="IP Source" value={log.ipAddress ?? '—'} />
            </CardContent>
          </Card>
        </DrawerBody>

        <DrawerFooter className="justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Globe className="size-4" />
            <span>Read-only audit history</span>
          </div>
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
