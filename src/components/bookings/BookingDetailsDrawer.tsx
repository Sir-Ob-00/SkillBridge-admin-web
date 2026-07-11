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
import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { BookingStatusBadge } from './BookingStatusBadge'
import { Copy, User, Briefcase, Calendar, Clock, DollarSign, X, Check } from 'lucide-react'
import type { Booking, BookingStatus } from '@/types/booking.types'

interface BookingDetailsDrawerProps {
  booking: Booking | null
  isLoading?: boolean
  isOpen: boolean
  onClose: () => void
  onStatusChange: (id: string, status: BookingStatus) => void
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

export function BookingDetailsDrawer({
  booking,
  isLoading,
  isOpen,
  onClose,
  onStatusChange,
  isActionLoading = false,
}: BookingDetailsDrawerProps) {
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false)
  const [isCompleteDialogOpen, setIsCompleteDialogOpen] = useState(false)
  const [cancelReason, setCancelReason] = useState('')
  const [completeNote, setCompleteNote] = useState('')

  const handleCopyBookingId = () => {
    if (booking) navigator.clipboard.writeText(booking.id)
  }

  const handleCancel = () => {
    if (!booking) return
    onStatusChange(booking.id, 'cancelled')
    setIsCancelDialogOpen(false)
    setCancelReason('')
  }

  const handleComplete = () => {
    if (!booking) return
    onStatusChange(booking.id, 'completed')
    setIsCompleteDialogOpen(false)
    setCompleteNote('')
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
            </div>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    )
  }

  if (!booking) return null

  const canCancel = booking.status === 'pending' || booking.status === 'accepted'
  const canComplete = booking.status === 'in_progress' || booking.status === 'accepted'

  return (
    <Drawer>
      <DrawerOverlay open={isOpen} onClose={onClose} />
      <DrawerContent open={isOpen} className="max-w-2xl">
        <DrawerHeader>
          <div className="flex items-center justify-between">
            <DrawerTitle>Booking Details</DrawerTitle>
            <Button variant="ghost" size="icon" onClick={handleCopyBookingId} className="size-8">
              <Copy className="size-4" />
            </Button>
          </div>
        </DrawerHeader>

        <DrawerBody className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold">{booking.serviceTitle}</h3>
              <p className="text-xs text-muted-foreground">{booking.id}</p>
            </div>
            <BookingStatusBadge status={booking.status} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex items-center gap-3">
              <Calendar className="size-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Created</p>
                <p className="text-sm font-medium">{format(new Date(booking.createdAt), 'MMM dd, yyyy')}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="size-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Scheduled</p>
                <p className="text-sm font-medium">
                  {booking.scheduledTime ? format(new Date(booking.scheduledTime), 'MMM dd, yyyy • HH:mm') : '—'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <DollarSign className="size-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Price</p>
                <p className="text-sm font-medium">GH₵ {booking.price}</p>
              </div>
            </div>
          </div>

          {booking.notes && (
            <div>
              <p className="text-xs text-muted-foreground">Notes</p>
              <p className="text-sm">{booking.notes}</p>
            </div>
          )}

          <Separator />

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex items-start gap-3">
              <Avatar className="size-10">
                <AvatarImage src={booking.student.profileImageUrl || undefined} alt={booking.student.name} />
                <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                  {getInitials(booking.student.name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <User className="size-3" /> Student
                </p>
                <p className="text-sm font-medium">{booking.student.name}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Avatar className="size-10">
                <AvatarImage src={booking.artisan.user.profileImageUrl || undefined} alt={booking.artisan.user.name} />
                <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                  {getInitials(booking.artisan.user.name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Briefcase className="size-3" /> Artisan
                </p>
                <p className="text-sm font-medium">{booking.artisan.user.name}</p>
              </div>
            </div>
          </div>
        </DrawerBody>

        <DrawerFooter className="flex-col gap-3">
          {canComplete && (
            <Button variant="primary" className="w-full" onClick={() => setIsCompleteDialogOpen(true)} disabled={isActionLoading}>
              <Check className="mr-2 size-4" />
              Mark Completed
            </Button>
          )}
          {canCancel && (
            <Button variant="danger" className="w-full" onClick={() => setIsCancelDialogOpen(true)} disabled={isActionLoading}>
              <X className="mr-2 size-4" />
              Cancel Booking
            </Button>
          )}
          <Button variant="ghost" onClick={onClose} className="w-full">
            Close
          </Button>
        </DrawerFooter>
      </DrawerContent>

      <Dialog open={isCancelDialogOpen} onOpenChange={(open) => !open && setIsCancelDialogOpen(false)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Booking</DialogTitle>
            <DialogDescription>Are you sure you want to cancel this booking? This action cannot be undone.</DialogDescription>
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
            <Button variant="outline" onClick={() => setIsCancelDialogOpen(false)} disabled={isActionLoading}>
              Go Back
            </Button>
            <Button variant="danger" onClick={handleCancel} disabled={isActionLoading}>
              Cancel Booking
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isCompleteDialogOpen} onOpenChange={(open) => !open && setIsCompleteDialogOpen(false)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mark Booking Completed</DialogTitle>
            <DialogDescription>This will mark the booking as completed.</DialogDescription>
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
            <Button variant="outline" onClick={() => setIsCompleteDialogOpen(false)} disabled={isActionLoading}>
              Go Back
            </Button>
            <Button variant="primary" onClick={handleComplete} disabled={isActionLoading}>
              Complete Booking
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Drawer>
  )
}
