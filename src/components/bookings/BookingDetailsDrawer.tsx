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
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { BookingTimeline } from './BookingTimeline'
import { BookingStatusBadge } from './BookingStatusBadge'
import { ResolveDisputeDialog } from './ResolveDisputeDialog'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import type { Booking } from '@/types/booking.types'
import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  DollarSign,
  Clock,
  AlertCircle,
  Copy,
  User,
  Briefcase,
  CreditCard,
  FileText,
  X,
  Check,
} from 'lucide-react'

interface BookingDetailsDrawerProps {
  booking: Booking | null
  isLoading?: boolean
  isOpen: boolean
  onClose: () => void
  onCancel: (id: string, reason?: string) => void
  onComplete: (id: string, note?: string) => void
  onResolveDispute: (id: string, resolution: string, adminNotes: string, decision: 'favor_student' | 'favor_artisan' | 'split', refundAmount?: number) => void
  onViewStudent?: (studentId: string) => void
  onViewArtisan?: (artisanId: string) => void
}

function getInitials(firstName: string, lastName: string): string {
  return `${firstName[0]}${lastName[0]}`.toUpperCase()
}

function getPaymentStatusVariant(status: string): 'success' | 'warning' | 'danger' | 'secondary' {
  switch (status) {
    case 'paid':
      return 'success'
    case 'failed':
      return 'danger'
    case 'refunded':
      return 'secondary'
    case 'partial_refund':
      return 'warning'
    case 'pending':
    default:
      return 'warning'
  }
}

export function BookingDetailsDrawer({
  booking,
  isLoading,
  isOpen,
  onClose,
  onCancel,
  onComplete,
  onResolveDispute,
  onViewStudent,
  onViewArtisan,
}: BookingDetailsDrawerProps) {
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false)
  const [isCompleteDialogOpen, setIsCompleteDialogOpen] = useState(false)
  const [isResolveDisputeDialogOpen, setIsResolveDisputeDialogOpen] = useState(false)
  const [cancelReason, setCancelReason] = useState('')
  const [completeNote, setCompleteNote] = useState('')
  const [isActionLoading, setIsActionLoading] = useState(false)

  const handleCopyBookingId = () => {
    if (booking) {
      navigator.clipboard.writeText(booking.id)
    }
  }

  const handleCancel = () => {
    if (!booking) return
    setIsActionLoading(true)
    try {
      onCancel(booking.id, cancelReason)
      setIsCancelDialogOpen(false)
      setCancelReason('')
    } finally {
      setIsActionLoading(false)
    }
  }

  const handleComplete = () => {
    if (!booking) return
    setIsActionLoading(true)
    try {
      onComplete(booking.id, completeNote)
      setIsCompleteDialogOpen(false)
      setCompleteNote('')
    } finally {
      setIsActionLoading(false)
    }
  }

  const handleResolveDispute = (resolution: string, adminNotes: string, decision: 'favor_student' | 'favor_artisan' | 'split', refundAmount?: number) => {
    if (!booking) return
    setIsActionLoading(true)
    try {
      onResolveDispute(booking.id, resolution, adminNotes, decision, refundAmount)
      setIsResolveDisputeDialogOpen(false)
    } finally {
      setIsActionLoading(false)
    }
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

  if (!booking) return null

  const canCancel = booking.status === 'pending' || booking.status === 'accepted'
  const canComplete = booking.status === 'in_progress'
  const canResolveDispute = booking.status === 'disputed'

  return (
    <Drawer>
      <DrawerOverlay open={isOpen} onClose={onClose} />
      <DrawerContent open={isOpen} className="max-w-4xl">
        <DrawerHeader>
          <div className="flex items-center justify-between">
            <DrawerTitle>Booking Details</DrawerTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCopyBookingId}
              className="size-8"
            >
              <Copy className="size-4" />
            </Button>
          </div>
        </DrawerHeader>

        <DrawerBody className="space-y-6">
          {/* Booking Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Booking Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-center gap-3">
                  <FileText className="size-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Booking ID</p>
                    <p className="text-sm font-medium">{booking.id}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="size-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Created Date</p>
                    <p className="text-sm font-medium">
                      {format(new Date(booking.createdAt), 'MMM dd, yyyy')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="size-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Scheduled Date</p>
                    <p className="text-sm font-medium">
                      {format(new Date(booking.scheduledDate), 'MMM dd, yyyy • HH:mm')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Briefcase className="size-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Service Category</p>
                    <p className="text-sm font-medium">{booking.categoryName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <DollarSign className="size-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Estimated Cost</p>
                    <p className="text-sm font-medium">
                      {booking.estimatedCost ? `${booking.payment.currency} ${booking.estimatedCost.toFixed(2)}` : 'N/A'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="size-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Final Cost</p>
                    <p className="text-sm font-medium">
                      {booking.finalCost ? `${booking.payment.currency} ${booking.finalCost.toFixed(2)}` : 'Pending'}
                    </p>
                  </div>
                </div>
              </div>
              <Separator className="my-4" />
              <div className="flex items-center gap-2">
                <p className="text-sm text-muted-foreground">Status:</p>
                <BookingStatusBadge status={booking.status} />
              </div>
            </CardContent>
          </Card>

          {/* Student Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <User className="size-4" />
                Student Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-4">
                <Avatar className="size-12">
                  <AvatarImage src={booking.studentAvatar || undefined} alt={`${booking.studentFirstName} ${booking.studentLastName}`} />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {getInitials(booking.studentFirstName, booking.studentLastName)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h4 className="font-medium">
                    {booking.studentFirstName} {booking.studentLastName}
                  </h4>
                  <div className="mt-2 grid gap-2 sm:grid-cols-2">
                    <div className="flex items-center gap-2">
                      <Mail className="size-3 text-muted-foreground" />
                      <span className="text-sm">{booking.studentEmail}</span>
                    </div>
                    {booking.studentPhone && (
                      <div className="flex items-center gap-2">
                        <Phone className="size-3 text-muted-foreground" />
                        <span className="text-sm">{booking.studentPhone}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              {onViewStudent && (
                <div className="mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onViewStudent(booking.studentId)}
                  >
                    View Student
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Artisan Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Briefcase className="size-4" />
                Artisan Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-4">
                <Avatar className="size-12">
                  <AvatarImage src={booking.artisanAvatar || undefined} alt={`${booking.artisanFirstName} ${booking.artisanLastName}`} />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {getInitials(booking.artisanFirstName, booking.artisanLastName)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h4 className="font-medium">
                    {booking.artisanFirstName} {booking.artisanLastName}
                  </h4>
                  {booking.artisanBusinessName && (
                    <p className="text-sm text-muted-foreground">{booking.artisanBusinessName}</p>
                  )}
                  <div className="mt-2 flex flex-wrap gap-2">
                    <Badge variant="outline">{booking.categoryName}</Badge>
                    {booking.artisanRating && (
                      <Badge variant="outline">⭐ {booking.artisanRating.toFixed(1)}</Badge>
                    )}
                    {booking.artisanVerificationStatus && (
                      <Badge variant={booking.artisanVerificationStatus === 'verified' ? 'default' : 'secondary'}>
                        {booking.artisanVerificationStatus === 'verified' ? 'Verified' : 'Unverified'}
                      </Badge>
                    )}
                  </div>
                  <div className="mt-2 grid gap-2 sm:grid-cols-2">
                    <div className="flex items-center gap-2">
                      <Mail className="size-3 text-muted-foreground" />
                      <span className="text-sm">{booking.artisanEmail}</span>
                    </div>
                    {booking.artisanPhone && (
                      <div className="flex items-center gap-2">
                        <Phone className="size-3 text-muted-foreground" />
                        <span className="text-sm">{booking.artisanPhone}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              {onViewArtisan && (
                <div className="mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onViewArtisan(booking.artisanId)}
                  >
                    View Artisan
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Location Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <MapPin className="size-4" />
                Location Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm font-medium">{booking.location.address}</p>
                <p className="text-sm text-muted-foreground">{booking.location.city}</p>
                {booking.location.region && (
                  <p className="text-sm text-muted-foreground">{booking.location.region}</p>
                )}
                {booking.location.gpsCoordinates && (
                  <p className="text-xs text-muted-foreground mt-2">
                    GPS: {booking.location.gpsCoordinates.latitude.toFixed(6)}, {booking.location.gpsCoordinates.longitude.toFixed(6)}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Payment Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <CreditCard className="size-4" />
                Payment Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-center gap-3">
                  <DollarSign className="size-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Amount</p>
                    <p className="text-sm font-medium">
                      {booking.payment.currency} {booking.payment.amount.toFixed(2)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <CreditCard className="size-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Payment Status</p>
                    <p className="text-sm font-medium">
                      <Badge variant={getPaymentStatusVariant(booking.payment.status) === 'success' ? 'default' : 'secondary'}>
                        {booking.payment.status}
                      </Badge>
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <DollarSign className="size-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Commission</p>
                    <p className="text-sm font-medium">
                      {booking.payment.currency} {booking.payment.commission.toFixed(2)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <DollarSign className="size-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Net Amount</p>
                    <p className="text-sm font-medium">
                      {booking.payment.currency} {booking.payment.netAmount.toFixed(2)}
                    </p>
                  </div>
                </div>
                {booking.payment.paymentMethod && (
                  <div className="flex items-center gap-3">
                    <CreditCard className="size-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Payment Method</p>
                      <p className="text-sm font-medium">{booking.payment.paymentMethod}</p>
                    </div>
                  </div>
                )}
                {booking.payment.transactionReference && (
                  <div className="flex items-center gap-3">
                    <FileText className="size-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Transaction Reference</p>
                      <p className="text-sm font-medium">{booking.payment.transactionReference}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Booking Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Booking Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <BookingTimeline timeline={[]} />
            </CardContent>
          </Card>

          {/* Dispute Information */}
          {booking.dispute && (
            <Card className="border-danger">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2 text-danger">
                  <AlertCircle className="size-4" />
                  Dispute Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Reason</p>
                    <p className="text-sm font-medium">{booking.dispute.reason}</p>
                  </div>
                  {booking.dispute.description && (
                    <div>
                      <p className="text-xs text-muted-foreground">Description</p>
                      <p className="text-sm">{booking.dispute.description}</p>
                    </div>
                  )}
                  <div className="grid gap-2 sm:grid-cols-2">
                    <div>
                      <p className="text-xs text-muted-foreground">Reported By</p>
                      <p className="text-sm font-medium">{booking.dispute.reportedBy}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Reported At</p>
                      <p className="text-sm font-medium">
                        {format(new Date(booking.dispute.reportedAt), 'MMM dd, yyyy • HH:mm')}
                      </p>
                    </div>
                  </div>
                  {booking.dispute.resolution && (
                    <div>
                      <p className="text-xs text-muted-foreground">Resolution</p>
                      <p className="text-sm font-medium">{booking.dispute.resolution}</p>
                    </div>
                  )}
                  {booking.dispute.adminNotes && (
                    <div>
                      <p className="text-xs text-muted-foreground">Admin Notes</p>
                      <p className="text-sm">{booking.dispute.adminNotes}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Admin Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Admin Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {canCancel && (
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => setIsCancelDialogOpen(true)}
                    disabled={isActionLoading}
                  >
                    <X className="size-4 mr-1" />
                    Cancel Booking
                  </Button>
                )}
                {canComplete && (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => setIsCompleteDialogOpen(true)}
                    disabled={isActionLoading}
                  >
                    <Check className="size-4 mr-1" />
                    Force Complete
                  </Button>
                )}
                {canResolveDispute && (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => setIsResolveDisputeDialogOpen(true)}
                    disabled={isActionLoading}
                  >
                    <AlertCircle className="size-4 mr-1" />
                    Resolve Dispute
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

      {/* Cancel Booking Dialog */}
      <Dialog open={isCancelDialogOpen} onOpenChange={(open) => {
        if (!open) {
          setIsCancelDialogOpen(false)
          setCancelReason('')
        }
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Booking</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this booking? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 py-4">
            <Label htmlFor="cancelReason">Reason (Optional)</Label>
            <Input
              id="cancelReason"
              placeholder="Enter the reason for cancellation..."
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsCancelDialogOpen(false)
                setCancelReason('')
              }}
              disabled={isActionLoading}
            >
              Go Back
            </Button>
            <Button
              variant="danger"
              onClick={handleCancel}
              disabled={isActionLoading}
            >
              Cancel Booking
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Force Complete Dialog */}
      <Dialog open={isCompleteDialogOpen} onOpenChange={(open) => {
        if (!open) {
          setIsCompleteDialogOpen(false)
          setCompleteNote('')
        }
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Force Complete Booking</DialogTitle>
            <DialogDescription>
              This will mark the booking as completed. Use this only for exceptional situations.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 py-4">
            <Label htmlFor="completeNote">Note (Optional)</Label>
            <Input
              id="completeNote"
              placeholder="Add a note for the completion..."
              value={completeNote}
              onChange={(e) => setCompleteNote(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsCompleteDialogOpen(false)
                setCompleteNote('')
              }}
              disabled={isActionLoading}
            >
              Go Back
            </Button>
            <Button
              variant="primary"
              onClick={handleComplete}
              disabled={isActionLoading}
            >
              Complete Booking
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Resolve Dispute Dialog */}
      <ResolveDisputeDialog
        isOpen={isResolveDisputeDialogOpen}
        onClose={() => setIsResolveDisputeDialogOpen(false)}
        onResolve={handleResolveDispute}
        isLoading={isActionLoading}
        dispute={booking.dispute}
      />
    </Drawer>
  )
}
