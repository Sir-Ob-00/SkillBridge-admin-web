import { useState } from 'react'
import { format } from 'date-fns'
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerBody,
  DrawerFooter,
  DrawerOverlay,
} from '@/components/ui/drawer'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ReportStatusBadge } from './ReportStatusBadge'
import { useAuthStore } from '@/store/auth.store'
import { User, ShieldAlert, FileText, Calendar, Copy, CheckCircle, XCircle, StickyNote } from 'lucide-react'
import type { Report } from '@/types/report.types'

interface ReportDetailsDrawerProps {
  report: Report | null
  isLoading?: boolean
  isOpen: boolean
  onClose: () => void
  onDecision: (
    id: string,
    action: 'assign' | 'resolve' | 'dismiss',
    payload?: { adminId?: string; resolution?: string; reason?: string; internalNote?: string },
  ) => void
  onAddNote?: (id: string, payload: { content: string; isInternal: boolean }) => void
  isActionLoading?: boolean
}

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .map((p) => p.charAt(0))
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export function ReportDetailsDrawer({
  report,
  isLoading,
  isOpen,
  onClose,
  onDecision,
  onAddNote,
  isActionLoading = false,
}: ReportDetailsDrawerProps) {
  const [isAssignOpen, setIsAssignOpen] = useState(false)
  const [isResolveOpen, setIsResolveOpen] = useState(false)
  const [isDismissOpen, setIsDismissOpen] = useState(false)
  const [isNoteOpen, setIsNoteOpen] = useState(false)
  const [adminId, setAdminId] = useState('')
  const [resolution, setResolution] = useState('')
  const [reason, setReason] = useState('')
  const [noteContent, setNoteContent] = useState('')
  const [isNoteInternal, setIsNoteInternal] = useState(true)

  const currentAdminId = useAuthStore((s) => s.admin?.id)

  if (isLoading) {
    return (
      <Drawer>
        <DrawerOverlay open={isOpen} onClose={onClose} />
        <DrawerContent open={isOpen}>
          <DrawerHeader>
            <Skeleton className="h-6 w-48" />
          </DrawerHeader>
          <DrawerBody>
            <div className="space-y-6">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    )
  }

  if (!report) return null

  const canAssign = report.status === 'open'
  const canResolve = report.status !== 'resolved'
  const canDismiss = report.status !== 'resolved'

  return (
    <Drawer>
      <DrawerOverlay open={isOpen} onClose={onClose} />
      <DrawerContent open={isOpen} className="max-w-2xl">
        <DrawerHeader>
          <div className="flex items-center justify-between">
            <DrawerTitle>Report Details</DrawerTitle>
            <Button variant="ghost" size="icon" onClick={() => navigator.clipboard.writeText(report.id)} className="size-8">
              <Copy className="size-4" />
            </Button>
          </div>
        </DrawerHeader>

        <DrawerBody className="space-y-6">
          <div className="flex items-center justify-between">
            <ReportStatusBadge status={report.status} />
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold">{report.reason}</h3>
            {report.details && <p className="text-sm text-muted-foreground">{report.details}</p>}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex items-center gap-3">
              <FileText className="size-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Report ID</p>
                <p className="text-sm font-medium">{report.id}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="size-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Created</p>
                <p className="text-sm font-medium">{format(new Date(report.createdAt), 'MMM dd, yyyy • HH:mm')}</p>
              </div>
            </div>
            {report.assignedTo && (
              <div className="flex items-center gap-3">
                <User className="size-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Assigned To</p>
                  <p className="text-sm font-medium">{report.assignedTo}</p>
                </div>
              </div>
            )}
          </div>

          <Separator />

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex items-start gap-3">
              <Avatar className="size-10">
                <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                  {getInitials(report.reporter.name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <User className="size-3" /> Reporter
                </p>
                <p className="text-sm font-medium">{report.reporter.name}</p>
                <p className="text-xs text-muted-foreground">{report.reporter.email} • {report.reporter.role}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Avatar className="size-10">
                <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                  {getInitials(report.target.name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <ShieldAlert className="size-3" /> Reported
                </p>
                <p className="text-sm font-medium">{report.target.name}</p>
                <p className="text-xs text-muted-foreground">{report.target.email} • {report.target.role}</p>
              </div>
            </div>
          </div>

          {report.resolution && (
            <div className="bg-muted/50 p-3 rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Resolution</p>
              <p className="text-sm">{report.resolution}</p>
            </div>
          )}
        </DrawerBody>

        <DrawerFooter className="flex-col gap-3">
          {canAssign && (
            <Button variant="outline" className="w-full" onClick={() => setIsAssignOpen(true)} disabled={isActionLoading}>
              <User className="mr-2 size-4" />
              Assign
            </Button>
          )}
          {canResolve && (
            <Button variant="primary" className="w-full" onClick={() => setIsResolveOpen(true)} disabled={isActionLoading}>
              <CheckCircle className="mr-2 size-4" />
              Resolve
            </Button>
          )}
          {canDismiss && (
            <Button variant="danger" className="w-full" onClick={() => setIsDismissOpen(true)} disabled={isActionLoading}>
              <XCircle className="mr-2 size-4" />
              Dismiss
            </Button>
          )}
          {onAddNote && (
            <Button variant="outline" className="w-full" onClick={() => setIsNoteOpen(true)} disabled={isActionLoading}>
              <StickyNote className="mr-2 size-4" />
              Add Note
            </Button>
          )}
          <Button variant="ghost" onClick={onClose} className="w-full">
            Close
          </Button>
        </DrawerFooter>
      </DrawerContent>

      <Dialog open={isAssignOpen} onOpenChange={(open) => {
        if (!open) setIsAssignOpen(false)
        else if (currentAdminId && !adminId) setAdminId(currentAdminId)
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Report</DialogTitle>
            <DialogDescription>Assign this report to an admin for follow-up.</DialogDescription>
          </DialogHeader>
          <div className="space-y-2 py-4">
            <Label htmlFor="adminId">Admin ID</Label>
            <Input id="adminId" placeholder="Admin user ID" value={adminId} defaultValue={currentAdminId} onChange={(e) => setAdminId(e.target.value)} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAssignOpen(false)} disabled={isActionLoading}>Cancel</Button>
            <Button
              variant="primary"
              onClick={() => {
                onDecision(report.id, 'assign', { adminId: adminId || currentAdminId })
                setIsAssignOpen(false)
              }}
              disabled={isActionLoading}
            >
              Assign
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isResolveOpen} onOpenChange={(open) => !open && setIsResolveOpen(false)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Resolve Report</DialogTitle>
            <DialogDescription>Provide a resolution for this report.</DialogDescription>
          </DialogHeader>
          <div className="space-y-2 py-4">
            <Label htmlFor="resolution">Resolution</Label>
            <Input id="resolution" placeholder="Resolution summary" value={resolution} onChange={(e) => setResolution(e.target.value)} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsResolveOpen(false)} disabled={isActionLoading}>Cancel</Button>
            <Button
              variant="primary"
              onClick={() => {
                onDecision(report.id, 'resolve', { resolution })
                setIsResolveOpen(false)
              }}
              disabled={isActionLoading}
            >
              Resolve
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDismissOpen} onOpenChange={(open) => !open && setIsDismissOpen(false)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Dismiss Report</DialogTitle>
            <DialogDescription>This action cannot be undone. The report will be marked as dismissed.</DialogDescription>
          </DialogHeader>
          <div className="space-y-2 py-4">
            <Label htmlFor="reason">Reason *</Label>
            <Input id="reason" placeholder="Reason for dismissal" value={reason} onChange={(e) => setReason(e.target.value)} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDismissOpen(false)} disabled={isActionLoading}>Cancel</Button>
            <Button
              variant="danger"
              onClick={() => {
                onDecision(report.id, 'dismiss', { reason })
                setIsDismissOpen(false)
              }}
              disabled={isActionLoading}
            >
              Dismiss
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isNoteOpen} onOpenChange={(open) => !open && setIsNoteOpen(false)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Note</DialogTitle>
            <DialogDescription>Add an internal or public note to this report.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="noteContent">Note</Label>
              <Textarea
                id="noteContent"
                placeholder="Write your note..."
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                rows={4}
              />
            </div>
            <div className="flex items-center gap-3">
              <Switch id="isInternal" checked={isNoteInternal} onCheckedChange={setIsNoteInternal} />
              <Label htmlFor="isInternal" className="cursor-pointer">Internal note (not visible to reporter)</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNoteOpen(false)} disabled={isActionLoading}>Cancel</Button>
            <Button
              variant="primary"
              onClick={() => {
                onAddNote?.(report.id, { content: noteContent, isInternal: isNoteInternal })
                setIsNoteOpen(false)
                setNoteContent('')
                setIsNoteInternal(true)
              }}
              disabled={isActionLoading || !noteContent.trim()}
            >
              Add Note
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Drawer>
  )
}
