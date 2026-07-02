import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import type { DisputeInfo } from '@/types/booking.types'

interface ResolveDisputeDialogProps {
  isOpen: boolean
  onClose: () => void
  onResolve: (resolution: string, adminNotes: string, decision: 'favor_student' | 'favor_artisan' | 'split', refundAmount?: number) => void
  isLoading?: boolean
  dispute?: DisputeInfo
}

export function ResolveDisputeDialog({
  isOpen,
  onClose,
  onResolve,
  isLoading = false,
  dispute,
}: ResolveDisputeDialogProps) {
  const [resolution, setResolution] = useState('')
  const [adminNotes, setAdminNotes] = useState('')
  const [decision, setDecision] = useState<'favor_student' | 'favor_artisan' | 'split'>('favor_student')
  const [showRefund, setShowRefund] = useState(false)
  const [refundAmount, setRefundAmount] = useState<number | undefined>(undefined)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!resolution.trim()) return

    onResolve(resolution, adminNotes, decision, refundAmount)
  }

  const handleDecisionChange = (newDecision: 'favor_student' | 'favor_artisan' | 'split') => {
    setDecision(newDecision)
    setShowRefund(newDecision === 'favor_student' || newDecision === 'split')
  }

  const handleClose = () => {
    setResolution('')
    setAdminNotes('')
    setDecision('favor_student')
    setRefundAmount(undefined)
    setShowRefund(false)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Resolve Dispute</DialogTitle>
          <DialogDescription>
            {dispute && (
              <span className="block mt-2">
                <strong>Reason:</strong> {dispute.reason}
                {dispute.description && (
                  <span className="block mt-1 text-sm">{dispute.description}</span>
                )}
              </span>
            )}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Decision</Label>
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant={decision === 'favor_student' ? 'primary' : 'outline'}
                  onClick={() => handleDecisionChange('favor_student')}
                >
                  Favor Student
                </Button>
                <Button
                  type="button"
                  variant={decision === 'favor_artisan' ? 'primary' : 'outline'}
                  onClick={() => handleDecisionChange('favor_artisan')}
                >
                  Favor Artisan
                </Button>
                <Button
                  type="button"
                  variant={decision === 'split' ? 'primary' : 'outline'}
                  onClick={() => handleDecisionChange('split')}
                >
                  Split Decision
                </Button>
              </div>
            </div>

            {showRefund && (
              <div className="space-y-2">
                <Label htmlFor="refundAmount">Refund Amount (Optional)</Label>
                <Input
                  id="refundAmount"
                  type="number"
                  placeholder="Enter refund amount"
                  value={refundAmount || ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRefundAmount(e.target.value ? parseFloat(e.target.value) : undefined)}
                  min="0"
                  step="0.01"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="resolution">Resolution *</Label>
              <Input
                id="resolution"
                placeholder="Describe how the dispute was resolved..."
                value={resolution}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setResolution(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="adminNotes">Admin Notes (Optional)</Label>
              <Input
                id="adminNotes"
                placeholder="Add any additional notes for future reference..."
                value={adminNotes}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAdminNotes(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || !resolution.trim()}>
              {isLoading ? 'Resolving...' : 'Resolve Dispute'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
