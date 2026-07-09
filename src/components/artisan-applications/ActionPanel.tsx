import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import type { ApplicationStatus, ApproveApplicationPayload, RejectApplicationPayload, RequestChangesPayload } from '@/types/artisanApplication.types'
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'

interface ActionPanelProps {
  applicationId: string
  currentStatus: ApplicationStatus
  onApprove: (id: string, payload: ApproveApplicationPayload) => void
  onReject: (id: string, payload: RejectApplicationPayload) => void
  onRequestChanges: (id: string, payload: RequestChangesPayload) => void
  isLoading?: boolean
}

export function ActionPanel({ applicationId, currentStatus, onApprove, onReject, onRequestChanges, isLoading }: ActionPanelProps) {
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false)
  const [changesDialogOpen, setChangesDialogOpen] = useState(false)
  const [rejectReason, setRejectReason] = useState('')
  const [rejectNotes, setRejectNotes] = useState('')
  const [changeNotes, setChangeNotes] = useState('')
  const [requestedChanges, setRequestedChanges] = useState('')

  const canApprove = currentStatus === 'under_review' || currentStatus === 'pending'
  const canReject = currentStatus === 'under_review' || currentStatus === 'pending'
  const canRequestChanges = currentStatus === 'under_review' || currentStatus === 'pending'

  const handleApprove = () => {
    onApprove(applicationId, { notes: '' })
    toast.success('Application approved successfully')
  }

  const handleReject = () => {
    if (!rejectReason.trim()) {
      toast.error('Please provide a rejection reason')
      return
    }
    onReject(applicationId, { reason: rejectReason, notes: rejectNotes })
    setRejectDialogOpen(false)
    setRejectReason('')
    setRejectNotes('')
    toast.success('Application rejected')
  }

  const handleRequestChanges = () => {
    if (!changeNotes.trim()) {
      toast.error('Please provide notes for the requested changes')
      return
    }
    const changesArray = requestedChanges
      .split('\n')
      .map(c => c.trim())
      .filter(c => c.length > 0)
    
    onRequestChanges(applicationId, { notes: changeNotes, requestedChanges: changesArray })
    setChangesDialogOpen(false)
    setChangeNotes('')
    setRequestedChanges('')
    toast.success('Changes requested successfully')
  }

  return (
    <Card className="sticky top-4">
      <CardHeader>
        <CardTitle>Review Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button
          className="w-full"
          onClick={handleApprove}
          disabled={!canApprove || isLoading}
        >
          <CheckCircle className="mr-2 size-4" />
          Approve Application
        </Button>

        <Button
          variant="outline"
          className="w-full"
          onClick={() => setChangesDialogOpen(true)}
          disabled={!canRequestChanges || isLoading}
        >
          <AlertCircle className="mr-2 size-4" />
          Request Changes
        </Button>

        <Button
          variant="danger"
          className="w-full"
          onClick={() => setRejectDialogOpen(true)}
          disabled={!canReject || isLoading}
        >
          <XCircle className="mr-2 size-4" />
          Reject Application
        </Button>

        {!canApprove && !canReject && !canRequestChanges && (
          <p className="text-sm text-muted-foreground text-center">
            No actions available for this status
          </p>
        )}
      </CardContent>

      {/* Reject Dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Application</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reject-reason">Rejection Reason *</Label>
              <textarea
                id="reject-reason"
                placeholder="Provide a clear reason for rejection..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-border rounded-md bg-background"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reject-notes">Additional Notes</Label>
              <textarea
                id="reject-notes"
                placeholder="Any additional context..."
                value={rejectNotes}
                onChange={(e) => setRejectNotes(e.target.value)}
                rows={2}
                className="w-full px-3 py-2 border border-border rounded-md bg-background"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleReject}>
              Reject Application
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Request Changes Dialog */}
      <Dialog open={changesDialogOpen} onOpenChange={setChangesDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request Changes</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="change-notes">Notes *</Label>
              <textarea
                id="change-notes"
                placeholder="Describe what needs to be changed..."
                value={changeNotes}
                onChange={(e) => setChangeNotes(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-border rounded-md bg-background"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="requested-changes">Specific Changes (one per line)</Label>
              <textarea
                id="requested-changes"
                placeholder="Update profile photo&#10;Add more portfolio items&#10;Complete business description..."
                value={requestedChanges}
                onChange={(e) => setRequestedChanges(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-border rounded-md bg-background"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setChangesDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleRequestChanges}>
              Request Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
