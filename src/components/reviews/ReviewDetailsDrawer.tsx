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
import { RatingStars } from './RatingStars'
import { ReviewTimeline } from './ReviewTimeline'
import { ReviewStatusBadge } from './ReviewStatusBadge'
import { ModerationDialog } from './ModerationDialog'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import type { Review } from '@/types/review.types'
import {
  Mail,
  Phone,
  Calendar,
  FileText,
  User,
  Briefcase,
  EyeOff,
  Eye,
  AlertTriangle,
  Trash2,
  Copy,
  Star,
} from 'lucide-react'

interface ReviewDetailsDrawerProps {
  review: Review | null
  isLoading?: boolean
  isOpen: boolean
  onClose: () => void
  onHide: (id: string, reason?: string, note?: string) => void
  onRestore: (id: string, note?: string) => void
  onFlag: (id: string, reason: string, note?: string) => void
  onDelete: (id: string, reason: string) => void
  onViewStudent?: (studentId: string) => void
  onViewArtisan?: (artisanId: string) => void
}

function getInitials(firstName: string, lastName: string): string {
  return `${firstName[0]}${lastName[0]}`.toUpperCase()
}

export function ReviewDetailsDrawer({
  review,
  isLoading,
  isOpen,
  onClose,
  onHide,
  onRestore,
  onFlag,
  onDelete,
  onViewStudent,
  onViewArtisan,
}: ReviewDetailsDrawerProps) {
  const [isHideDialogOpen, setIsHideDialogOpen] = useState(false)
  const [isRestoreDialogOpen, setIsRestoreDialogOpen] = useState(false)
  const [isFlagDialogOpen, setIsFlagDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isActionLoading, setIsActionLoading] = useState(false)

  const handleCopyBookingId = () => {
    if (review) {
      navigator.clipboard.writeText(review.bookingId)
    }
  }

  const handleHide = (reason: string, note?: string) => {
    if (!review) return
    setIsActionLoading(true)
    try {
      onHide(review.id, reason, note)
      setIsHideDialogOpen(false)
    } finally {
      setIsActionLoading(false)
    }
  }

  const handleRestore = (_reason: string, note?: string) => {
    if (!review) return
    setIsActionLoading(true)
    try {
      onRestore(review.id, note)
      setIsRestoreDialogOpen(false)
    } finally {
      setIsActionLoading(false)
    }
  }

  const handleFlag = (reason: string, _note?: string) => {
    if (!review) return
    setIsActionLoading(true)
    try {
      onFlag(review.id, reason)
      setIsFlagDialogOpen(false)
    } finally {
      setIsActionLoading(false)
    }
  }

  const handleDelete = (reason: string, _note?: string) => {
    if (!review) return
    setIsActionLoading(true)
    try {
      onDelete(review.id, reason)
      setIsDeleteDialogOpen(false)
      onClose()
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

  if (!review) return null

  const canHide = review.status === 'visible'
  const canRestore = review.status === 'hidden'
  const canFlag = review.status === 'visible' || review.status === 'hidden'
  const canDelete = review.status !== 'removed'

  return (
    <Drawer>
      <DrawerOverlay open={isOpen} onClose={onClose} />
      <DrawerContent open={isOpen} className="max-w-4xl">
        <DrawerHeader>
          <div className="flex items-center justify-between">
            <DrawerTitle>Review Details</DrawerTitle>
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
          {/* Review Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Review Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <RatingStars rating={review.rating} className="size-6" />
                  <span className="text-2xl font-bold">{review.rating.toFixed(1)}</span>
                </div>
                <p className="text-sm">{review.comment}</p>
                <Separator />
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex items-center gap-3">
                    <FileText className="size-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Review ID</p>
                      <p className="text-sm font-medium">{review.id}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <FileText className="size-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Booking ID</p>
                      <p className="text-sm font-medium">{review.bookingId}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="size-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Submitted</p>
                      <p className="text-sm font-medium">
                        {format(new Date(review.createdAt), 'MMM dd, yyyy • HH:mm')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="size-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Last Updated</p>
                      <p className="text-sm font-medium">
                        {format(new Date(review.updatedAt), 'MMM dd, yyyy • HH:mm')}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-sm text-muted-foreground">Status:</p>
                  <ReviewStatusBadge status={review.status} />
                </div>
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
                  <AvatarImage src={review.studentAvatar || undefined} alt={`${review.studentFirstName} ${review.studentLastName}`} />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {getInitials(review.studentFirstName, review.studentLastName)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h4 className="font-medium">
                    {review.studentFirstName} {review.studentLastName}
                  </h4>
                  <div className="mt-2 grid gap-2 sm:grid-cols-2">
                    <div className="flex items-center gap-2">
                      <Mail className="size-3 text-muted-foreground" />
                      <span className="text-sm">{review.studentEmail}</span>
                    </div>
                    {review.studentPhone && (
                      <div className="flex items-center gap-2">
                        <Phone className="size-3 text-muted-foreground" />
                        <span className="text-sm">{review.studentPhone}</span>
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
                    onClick={() => onViewStudent(review.studentId)}
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
                  <AvatarImage src={review.artisanAvatar || undefined} alt={`${review.artisanFirstName} ${review.artisanLastName}`} />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {getInitials(review.artisanFirstName, review.artisanLastName)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h4 className="font-medium">
                    {review.artisanFirstName} {review.artisanLastName}
                  </h4>
                  {review.artisanBusinessName && (
                    <p className="text-sm text-muted-foreground">{review.artisanBusinessName}</p>
                  )}
                  <div className="mt-2 flex flex-wrap gap-2">
                    <Badge variant="outline">{review.categoryName}</Badge>
                    {review.artisanAverageRating && (
                      <div className="flex items-center gap-1">
                        <Star className="size-3 text-yellow-400 fill-yellow-400" />
                        <span className="text-sm">{review.artisanAverageRating.toFixed(1)}</span>
                      </div>
                    )}
                  </div>
                  <div className="mt-2 grid gap-2 sm:grid-cols-2">
                    <div className="flex items-center gap-2">
                      <Mail className="size-3 text-muted-foreground" />
                      <span className="text-sm">{review.artisanEmail}</span>
                    </div>
                    {review.artisanPhone && (
                      <div className="flex items-center gap-2">
                        <Phone className="size-3 text-muted-foreground" />
                        <span className="text-sm">{review.artisanPhone}</span>
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
                    onClick={() => onViewArtisan(review.artisanId)}
                  >
                    View Artisan
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Booking Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <FileText className="size-4" />
                Booking Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Booking ID</span>
                  <span className="text-sm font-medium">{review.bookingId}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Service</span>
                  <span className="text-sm font-medium">{review.categoryName}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Moderation History */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Moderation History</CardTitle>
            </CardHeader>
            <CardContent>
              <ReviewTimeline history={[]} />
            </CardContent>
          </Card>

          {/* Admin Notes */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Admin Notes</CardTitle>
            </CardHeader>
            <CardContent>
              {review.adminNotes ? (
                <p className="text-sm">{review.adminNotes}</p>
              ) : (
                <p className="text-sm text-muted-foreground">No admin notes</p>
              )}
            </CardContent>
          </Card>

          {/* Moderation Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Moderation Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {canHide && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsHideDialogOpen(true)}
                    disabled={isActionLoading}
                  >
                    <EyeOff className="size-4 mr-1" />
                    Hide Review
                  </Button>
                )}
                {canRestore && (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => setIsRestoreDialogOpen(true)}
                    disabled={isActionLoading}
                  >
                    <Eye className="size-4 mr-1" />
                    Restore Review
                  </Button>
                )}
                {canFlag && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsFlagDialogOpen(true)}
                    disabled={isActionLoading}
                  >
                    <AlertTriangle className="size-4 mr-1" />
                    Flag Review
                  </Button>
                )}
                {canDelete && (
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => setIsDeleteDialogOpen(true)}
                    disabled={isActionLoading}
                  >
                    <Trash2 className="size-4 mr-1" />
                    Delete Review
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

      {/* Hide Review Dialog */}
      <ModerationDialog
        isOpen={isHideDialogOpen}
        onClose={() => setIsHideDialogOpen(false)}
        onConfirm={handleHide}
        isLoading={isActionLoading}
        title="Hide Review"
        description="This review will be hidden from public view but retained in the system."
        confirmText="Hide Review"
        reasonRequired={false}
      />

      {/* Restore Review Dialog */}
      <ModerationDialog
        isOpen={isRestoreDialogOpen}
        onClose={() => setIsRestoreDialogOpen(false)}
        onConfirm={handleRestore}
        isLoading={isActionLoading}
        title="Restore Review"
        description="This review will be restored to public view."
        confirmText="Restore Review"
        reasonRequired={false}
      />

      {/* Flag Review Dialog */}
      <ModerationDialog
        isOpen={isFlagDialogOpen}
        onClose={() => setIsFlagDialogOpen(false)}
        onConfirm={handleFlag}
        isLoading={isActionLoading}
        title="Flag Review"
        description="Flag this review for further investigation."
        confirmText="Flag Review"
        reasonRequired={true}
      />

      {/* Delete Review Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={(open) => {
        if (!open) setIsDeleteDialogOpen(false)
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Review</DialogTitle>
            <DialogDescription>
              This action cannot be undone. The review will be permanently removed from the system.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={(e) => {
            e.preventDefault()
            const reason = (e.target as HTMLFormElement).reason.value
            handleDelete(reason)
          }}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="reason">Reason *</Label>
                <Input
                  id="reason"
                  placeholder="Enter the reason for deletion..."
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDeleteDialogOpen(false)}
                disabled={isActionLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="danger"
                disabled={isActionLoading}
              >
                Delete Review
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Drawer>
  )
}
