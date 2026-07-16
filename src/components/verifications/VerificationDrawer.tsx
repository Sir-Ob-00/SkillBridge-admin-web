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
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { StatusBadge } from '@/components/common/StatusBadge'
import { Loader2, Mail, Phone, MapPin, Briefcase, Calendar, CheckCircle, XCircle, AlertCircle, ImageIcon } from 'lucide-react'
import type { VerificationRequest } from '@/services/verifications.service'
import { artisanVerificationVariant } from '@/types/artisan.types'

interface VerificationDrawerProps {
  verification: VerificationRequest | null
  isLoading?: boolean
  isOpen: boolean
  onClose: () => void
  onDecision: (
    id: string,
    action: 'approve' | 'reject' | 'request' | 'note',
    payload?: { note?: string },
  ) => void
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

export function VerificationDrawer({
  verification,
  isLoading,
  isOpen,
  onClose,
  onDecision,
}: VerificationDrawerProps) {
  const [note, setNote] = useState('')
  const [rejectReason, setRejectReason] = useState('')
  const [requestMessage, setRequestMessage] = useState('')

  if (isLoading) {
    return (
      <Drawer>
        <DrawerOverlay open={isOpen} onClose={onClose} />
        <DrawerContent open={isOpen}>
          <DrawerHeader>
            <DrawerTitle>Verification Details</DrawerTitle>
          </DrawerHeader>
          <DrawerBody className="flex items-center justify-center py-12">
            <Loader2 className="size-8 animate-spin text-muted-foreground" />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    )
  }

  if (!verification) return null

  const handleApprove = () => onDecision(verification.id, 'approve', { note: note || undefined })
  const handleReject = () => {
    if (!rejectReason.trim()) {
      alert('A rejection reason is required')
      return
    }
    onDecision(verification.id, 'reject', { note: rejectReason })
  }
  const handleRequest = () => {
    if (!requestMessage.trim()) {
      alert('A message is required')
      return
    }
    onDecision(verification.id, 'request', { note: requestMessage })
  }
  const handleAddNote = () => {
    if (!note.trim()) {
      alert('A note is required')
      return
    }
    onDecision(verification.id, 'note', { note })
  }

  return (
    <Drawer>
      <DrawerOverlay open={isOpen} onClose={onClose} />
      <DrawerContent open={isOpen} className="max-w-2xl">
        <DrawerHeader>
          <DrawerTitle>Verification Details</DrawerTitle>
        </DrawerHeader>

        <DrawerBody className="space-y-6">
          <div className="flex items-start gap-4">
            <Avatar className="size-16">
              <AvatarImage src={verification.user.profileImageUrl || undefined} alt={verification.user.name} />
              <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                {getInitials(verification.user.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="text-xl font-semibold">{verification.businessName || verification.user.name}</h3>
              <p className="text-sm text-muted-foreground">{verification.user.name}</p>
              <div className="mt-2">
                <StatusBadge status={verification.verification} variant={artisanVerificationVariant(verification.verification)} />
              </div>
            </div>
          </div>

          <Separator />

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex items-center gap-3">
              <Mail className="size-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="text-sm font-medium">{verification.user.email}</p>
              </div>
            </div>
            {verification.user.phone && (
              <div className="flex items-center gap-3">
                <Phone className="size-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Phone</p>
                  <p className="text-sm font-medium">{verification.user.phone}</p>
                </div>
              </div>
            )}
            {verification.location && (
              <div className="flex items-center gap-3">
                <MapPin className="size-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Location</p>
                  <p className="text-sm font-medium">{verification.location}</p>
                </div>
              </div>
            )}
            {verification.pricingFrom && (
              <div className="flex items-center gap-3">
                <Briefcase className="size-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Pricing From</p>
                  <p className="text-sm font-medium">GH₵ {verification.pricingFrom}</p>
                </div>
              </div>
            )}
            <div className="flex items-center gap-3">
              <Calendar className="size-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Submitted</p>
                <p className="text-sm font-medium">
                  {verification.submittedAt ? format(new Date(verification.submittedAt), 'MMM dd, yyyy') : '—'}
                </p>
              </div>
            </div>
          </div>

          {verification.bio && <p className="text-sm text-muted-foreground">{verification.bio}</p>}

          {verification.reviewNotes && (
            <div className="rounded-md border border-border bg-muted/40 p-3">
              <p className="text-xs text-muted-foreground">Review Notes</p>
              <p className="text-sm">{verification.reviewNotes}</p>
            </div>
          )}

          {verification.rejectionReason && (
            <div className="rounded-md border border-border bg-muted/40 p-3">
              <p className="text-xs text-muted-foreground">Rejection Reason</p>
              <p className="text-sm">{verification.rejectionReason}</p>
            </div>
          )}

          <Separator />

          <div className="space-y-3">
            <h4 className="text-sm font-semibold flex items-center gap-2">
              <ImageIcon className="size-4 text-muted-foreground" />
              Verification Document
            </h4>
            {verification.verificationDoc ? (
              <div className="space-y-3">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <p className="text-xs text-muted-foreground">Institution</p>
                    <p className="text-sm font-medium">{verification.verificationDoc.institution || '—'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Student ID</p>
                    <p className="text-sm font-medium">{verification.verificationDoc.studentId || '—'}</p>
                  </div>
                </div>
                {verification.verificationDoc.verificationImageUrl ? (
                  <div className="rounded-md border border-border overflow-hidden">
                    <img
                      src={verification.verificationDoc.verificationImageUrl}
                      alt="Student ID verification"
                      className="w-full h-auto max-h-80 object-contain bg-muted"
                    />
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-32 rounded-md border border-dashed border-border bg-muted/30 text-muted-foreground text-sm">
                    No verification photo uploaded
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center h-32 rounded-md border border-dashed border-border bg-muted/30 text-muted-foreground text-sm">
                Verification image unavailable
              </div>
            )}
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="note">Review Note (optional)</Label>
              <Input
                id="note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Add an internal note"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reject">Rejection Reason</Label>
              <Input
                id="reject"
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Reason for rejection"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="request">Request Changes Message</Label>
              <Input
                id="request"
                value={requestMessage}
                onChange={(e) => setRequestMessage(e.target.value)}
                placeholder="Message to send to the artisan"
              />
            </div>
          </div>
        </DrawerBody>

        <DrawerFooter className="flex-col gap-3">
          <Button variant="primary" className="w-full" onClick={handleApprove}>
            <CheckCircle className="mr-2 size-4" />
            Approve
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={handleRequest}>
              <AlertCircle className="mr-2 size-4" />
              Request Changes
            </Button>
            <Button variant="danger" className="flex-1" onClick={handleReject}>
              <XCircle className="mr-2 size-4" />
              Reject
            </Button>
          </div>
          <Button variant="secondary" className="w-full" onClick={handleAddNote}>
            <AlertCircle className="mr-2 size-4" />
            Add Internal Note
          </Button>
          <Button variant="ghost" onClick={onClose} className="w-full">
            Close
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
