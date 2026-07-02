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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ReportTimeline } from './ReportTimeline'
import { EvidenceViewer } from './EvidenceViewer'
import { ReportStatusBadge } from './ReportStatusBadge'
import { ReportNotes } from './ReportNotes'
import { AssignReportDialog } from './AssignReportDialog'
import { ResolveReportDialog } from './ResolveReportDialog'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { Report, ReportPriority } from '@/types/report.types'
import {
  Mail,
  Phone,
  Calendar,
  FileText,
  User,
  AlertTriangle,
  CheckCircle,
  XCircle,
  ShieldAlert,
  Copy,
} from 'lucide-react'

interface ReportDetailsDrawerProps {
  report: Report | null
  isLoading?: boolean
  isOpen: boolean
  onClose: () => void
  onAssign: (id: string, adminId: string, note?: string) => void
  onResolve: (id: string, resolution: string, internalNote?: string) => void
  onDismiss: (id: string, reason: string, internalNote?: string) => void
  onAddNote: (id: string, content: string) => void
  availableAdmins?: { id: string; name: string }[]
}

function getInitials(firstName: string, lastName: string): string {
  return `${firstName[0]}${lastName[0]}`.toUpperCase()
}

function getPriorityColor(priority: ReportPriority): string {
  switch (priority) {
    case 'critical':
      return 'text-danger'
    case 'high':
      return 'text-orange-500'
    case 'medium':
      return 'text-yellow-500'
    case 'low':
      return 'text-muted-foreground'
    default:
      return 'text-muted-foreground'
  }
}

export function ReportDetailsDrawer({
  report,
  isLoading,
  isOpen,
  onClose,
  onAssign,
  onResolve,
  onDismiss,
  onAddNote,
  availableAdmins = [],
}: ReportDetailsDrawerProps) {
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false)
  const [isResolveDialogOpen, setIsResolveDialogOpen] = useState(false)
  const [isDismissDialogOpen, setIsDismissDialogOpen] = useState(false)
  const [isActionLoading, setIsActionLoading] = useState(false)

  const handleCopyReportId = () => {
    if (report) {
      navigator.clipboard.writeText(report.id)
    }
  }

  const handleAssign = (adminId: string, note?: string) => {
    if (!report) return
    setIsActionLoading(true)
    try {
      onAssign(report.id, adminId, note)
      setIsAssignDialogOpen(false)
    } finally {
      setIsActionLoading(false)
    }
  }


  const handleResolve = (resolution: string, internalNote?: string) => {
    if (!report) return
    setIsActionLoading(true)
    try {
      onResolve(report.id, resolution, internalNote)
      setIsResolveDialogOpen(false)
      onClose()
    } finally {
      setIsActionLoading(false)
    }
  }

  const handleDismiss = (reason: string, internalNote?: string) => {
    if (!report) return
    setIsActionLoading(true)
    try {
      onDismiss(report.id, reason, internalNote)
      setIsDismissDialogOpen(false)
      onClose()
    } finally {
      setIsActionLoading(false)
    }
  }

  const handleAddNote = (content: string) => {
    if (!report) return
    onAddNote(report.id, content)
  }

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
              <Skeleton className="h-20 w-full" />
            </div>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    )
  }

  if (!report) return null

  const canAssign = report.status === 'open'
  const canResolve = report.status !== 'resolved' && report.status !== 'dismissed'
  const canDismiss = report.status !== 'resolved' && report.status !== 'dismissed'

  return (
    <Drawer>
      <DrawerOverlay open={isOpen} onClose={onClose} />
      <DrawerContent open={isOpen} className="max-w-4xl">
        <DrawerHeader>
          <div className="flex items-center justify-between">
            <DrawerTitle>Report Details</DrawerTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCopyReportId}
              className="size-8"
            >
              <Copy className="size-4" />
            </Button>
          </div>
        </DrawerHeader>

        <DrawerBody className="space-y-6">
          {/* Report Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Report Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Badge variant={report.priority === 'critical' ? 'danger' : 'outline'}>
                    <AlertTriangle className={`size-3 mr-1 ${getPriorityColor(report.priority)}`} />
                    {report.priority.toUpperCase()}
                  </Badge>
                  <ReportStatusBadge status={report.status} />
                </div>
                <h3 className="text-lg font-semibold">{report.title}</h3>
                <p className="text-sm">{report.description}</p>
                {report.reason && (
                  <div className="bg-muted/50 p-3 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Reason</p>
                    <p className="text-sm">{report.reason}</p>
                  </div>
                )}
                <Separator />
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
                      <p className="text-sm font-medium">
                        {format(new Date(report.createdAt), 'MMM dd, yyyy • HH:mm')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="size-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Last Updated</p>
                      <p className="text-sm font-medium">
                        {format(new Date(report.updatedAt), 'MMM dd, yyyy • HH:mm')}
                      </p>
                    </div>
                  </div>
                  {report.assignedAdminName && (
                    <div className="flex items-center gap-3">
                      <User className="size-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Assigned To</p>
                        <p className="text-sm font-medium">{report.assignedAdminName}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Reporter Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <User className="size-4" />
                Reporter Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-4">
                <Avatar className="size-12">
                  <AvatarImage src={report.reporter.avatar || undefined} alt={`${report.reporter.firstName} ${report.reporter.lastName}`} />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {getInitials(report.reporter.firstName, report.reporter.lastName)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h4 className="font-medium">
                    {report.reporter.firstName} {report.reporter.lastName}
                  </h4>
                  <Badge variant="outline" className="text-xs capitalize">
                    {report.reporter.type}
                  </Badge>
                  <div className="mt-2 grid gap-2 sm:grid-cols-2">
                    <div className="flex items-center gap-2">
                      <Mail className="size-3 text-muted-foreground" />
                      <span className="text-sm">{report.reporter.email}</span>
                    </div>
                    {report.reporter.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="size-3 text-muted-foreground" />
                        <span className="text-sm">{report.reporter.phone}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Reported Entity */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <ShieldAlert className="size-4" />
                Reported Entity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-4">
                <Avatar className="size-12">
                  <AvatarImage src={report.reportedEntity.avatar || undefined} alt={report.reportedEntity.name} />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {report.reportedEntity.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h4 className="font-medium">{report.reportedEntity.name}</h4>
                  <Badge variant="outline" className="text-xs capitalize">
                    {report.reportedEntity.type}
                  </Badge>
                  {report.reportedEntity.email && (
                    <div className="mt-2 flex items-center gap-2">
                      <Mail className="size-3 text-muted-foreground" />
                      <span className="text-sm">{report.reportedEntity.email}</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Evidence */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Evidence</CardTitle>
            </CardHeader>
            <CardContent>
              <EvidenceViewer evidence={report.evidence} />
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Report Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <ReportTimeline timeline={report.timeline} />
            </CardContent>
          </Card>

          {/* Internal Notes */}
          <ReportNotes
            notes={report.notes}
            onAddNote={handleAddNote}
            isLoading={isActionLoading}
          />

          {/* Resolution Panel */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Resolution Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {canAssign && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsAssignDialogOpen(true)}
                    disabled={isActionLoading}
                  >
                    <User className="size-4 mr-1" />
                    Assign
                  </Button>
                )}
                {canResolve && (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => setIsResolveDialogOpen(true)}
                    disabled={isActionLoading}
                  >
                    <CheckCircle className="size-4 mr-1" />
                    Resolve
                  </Button>
                )}
                {canDismiss && (
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => setIsDismissDialogOpen(true)}
                    disabled={isActionLoading}
                  >
                    <XCircle className="size-4 mr-1" />
                    Dismiss
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </DrawerBody>

        <DrawerFooter>
          <Button variant="ghost" onClick={onClose} className="w-full">
            Close
          </Button>
        </DrawerFooter>
      </DrawerContent>

      {/* Assign Dialog */}
      <AssignReportDialog
        isOpen={isAssignDialogOpen}
        onClose={() => setIsAssignDialogOpen(false)}
        onAssign={handleAssign}
        isLoading={isActionLoading}
        availableAdmins={availableAdmins}
      />

      {/* Resolve Dialog */}
      <ResolveReportDialog
        isOpen={isResolveDialogOpen}
        onClose={() => setIsResolveDialogOpen(false)}
        onResolve={handleResolve}
        isLoading={isActionLoading}
      />

      {/* Dismiss Dialog */}
      <Dialog open={isDismissDialogOpen} onOpenChange={(open) => {
        if (!open) setIsDismissDialogOpen(false)
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Dismiss Report</DialogTitle>
            <DialogDescription>
              This action cannot be undone. The report will be marked as dismissed.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={(e) => {
            e.preventDefault()
            const reason = (e.target as HTMLFormElement).reason.value
            const internalNote = (e.target as HTMLFormElement).internalNote.value
            handleDismiss(reason, internalNote)
          }}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="reason">Reason *</Label>
                <Input
                  id="reason"
                  placeholder="Enter the reason for dismissal..."
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="internalNote">Internal Note (Optional)</Label>
                <Input
                  id="internalNote"
                  placeholder="Add internal notes..."
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDismissDialogOpen(false)}
                disabled={isActionLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="danger"
                disabled={isActionLoading}
              >
                Dismiss Report
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Drawer>
  )
}
