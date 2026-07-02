import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import type { VerificationStatus } from '@/types/verification.types'

interface DecisionPanelProps {
  currentStatus: VerificationStatus
  onApprove: (note?: string) => void
  onReject: (reason: string) => void
  onRequestInfo: (message: string) => void
  isLoading?: boolean
}

export function DecisionPanel({
  currentStatus,
  onApprove,
  onReject,
  onRequestInfo,
  isLoading = false,
}: DecisionPanelProps) {
  const [rejectReason, setRejectReason] = useState('')
  const [requestInfoMessage, setRequestInfoMessage] = useState('')
  const [showRejectInput, setShowRejectInput] = useState(false)
  const [showRequestInfoInput, setShowRequestInfoInput] = useState(false)

  const handleApprove = () => {
    if (confirm('Are you sure you want to approve this verification? The artisan will become visible in the marketplace.')) {
      onApprove()
    }
  }

  const handleReject = () => {
    if (!rejectReason.trim()) {
      alert('Please provide a reason for rejection')
      return
    }
    if (confirm('Are you sure you want to reject this verification? The artisan will need to resubmit.')) {
      onReject(rejectReason.trim())
      setRejectReason('')
      setShowRejectInput(false)
    }
  }

  const handleRequestInfo = () => {
    if (!requestInfoMessage.trim()) {
      alert('Please provide a message for the artisan')
      return
    }
    onRequestInfo(requestInfoMessage.trim())
    setRequestInfoMessage('')
    setShowRequestInfoInput(false)
  }

  const canApprove = currentStatus === 'pending' || currentStatus === 'requires_more_info'
  const canReject = currentStatus === 'pending' || currentStatus === 'requires_more_info'
  const canRequestInfo = currentStatus === 'pending'

  return (
    <div className="border-t border-border pt-4 space-y-3">
      <p className="text-sm font-medium">Verification Decision</p>
      
      <div className="flex flex-col gap-2">
        {canApprove && (
          <Button
            variant="primary"
            onClick={handleApprove}
            disabled={isLoading}
            className="w-full"
          >
            <CheckCircle className="size-4 mr-2" />
            Approve Verification
          </Button>
        )}

        {canReject && (
          <>
            {!showRejectInput ? (
              <Button
                variant="danger"
                onClick={() => setShowRejectInput(true)}
                disabled={isLoading}
                className="w-full"
              >
                <XCircle className="size-4 mr-2" />
                Reject Verification
              </Button>
            ) : (
              <div className="space-y-2">
                <Input
                  placeholder="Reason for rejection (required)"
                  value={rejectReason}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRejectReason(e.target.value)}
                  autoFocus
                />
                <div className="flex gap-2">
                  <Button
                    variant="danger"
                    onClick={handleReject}
                    disabled={!rejectReason.trim() || isLoading}
                    className="flex-1"
                  >
                    <XCircle className="size-4 mr-2" />
                    Confirm Reject
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowRejectInput(false)
                      setRejectReason('')
                    }}
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </>
        )}

        {canRequestInfo && (
          <>
            {!showRequestInfoInput ? (
              <Button
                variant="outline"
                onClick={() => setShowRequestInfoInput(true)}
                disabled={isLoading}
                className="w-full"
              >
                <AlertCircle className="size-4 mr-2" />
                Request More Information
              </Button>
            ) : (
              <div className="space-y-2">
                <Input
                  placeholder="Message to artisan (required)"
                  value={requestInfoMessage}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRequestInfoMessage(e.target.value)}
                  autoFocus
                />
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={handleRequestInfo}
                    disabled={!requestInfoMessage.trim() || isLoading}
                    className="flex-1"
                  >
                    <AlertCircle className="size-4 mr-2" />
                    Send Request
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setShowRequestInfoInput(false)
                      setRequestInfoMessage('')
                    }}
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </>
        )}

        {currentStatus === 'approved' && (
          <div className="text-center py-2 px-4 bg-success/10 border border-success/20 rounded-lg">
            <p className="text-sm text-success font-medium">This verification has been approved</p>
          </div>
        )}

        {currentStatus === 'rejected' && (
          <div className="text-center py-2 px-4 bg-danger/10 border border-danger/20 rounded-lg">
            <p className="text-sm text-danger font-medium">This verification has been rejected</p>
          </div>
        )}
      </div>
    </div>
  )
}
