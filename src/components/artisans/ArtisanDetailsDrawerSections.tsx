import { format } from 'date-fns'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { StatusBadge } from '@/components/common/StatusBadge'
import { getDocumentStatusVariant, getInitials, getStatusVariant, getVerificationVariant } from '@/pages/artisans/utils/artisanHelpers'
import type { ArtisanDetails } from '@/types/artisan.types'
import {
  AlertTriangle,
  BookOpen,
  Calendar,
  CheckCircle,
  FileText,
  Image as ImageIcon,
  Mail,
  MapPin,
  Phone,
  Star,
  Trash2,
  Briefcase,
  XCircle,
} from 'lucide-react'

interface ArtisanDetailsDrawerSectionsProps {
  artisan: ArtisanDetails
  isActionLoading: boolean
  onVerify: (status: 'verified' | 'rejected') => void
  onStatusToggle: () => void
  onDelete: () => void
  onClose: () => void
}

export function ArtisanProfileSection({ artisan }: { artisan: ArtisanDetails }) {
  return (
    <div className="flex items-start gap-4">
      <Avatar className="size-16">
        <AvatarImage src={artisan.avatar || undefined} alt={`${artisan.firstName} ${artisan.lastName}`} />
        <AvatarFallback className="bg-primary text-primary-foreground text-lg">
          {getInitials(artisan.firstName, artisan.lastName)}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <h3 className="text-xl font-semibold">
          {artisan.firstName} {artisan.lastName}
        </h3>
        <p className="text-sm text-muted-foreground">{artisan.businessName}</p>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <StatusBadge status={artisan.status} variant={getStatusVariant(artisan.status)} />
          <StatusBadge
            status={artisan.verificationStatus}
            variant={getVerificationVariant(artisan.verificationStatus)}
          />
        </div>
      </div>
    </div>
  )
}

export function ArtisanContactSection({ artisan }: { artisan: ArtisanDetails }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="flex items-center gap-3">
        <Mail className="size-4 text-muted-foreground" />
        <div>
          <p className="text-xs text-muted-foreground">Email</p>
          <p className="text-sm font-medium">{artisan.email}</p>
        </div>
      </div>
      {artisan.phone && (
        <div className="flex items-center gap-3">
          <Phone className="size-4 text-muted-foreground" />
          <div>
            <p className="text-xs text-muted-foreground">Phone</p>
            <p className="text-sm font-medium">{artisan.phone}</p>
          </div>
        </div>
      )}
      {artisan.location && (
        <div className="flex items-center gap-3">
          <MapPin className="size-4 text-muted-foreground" />
          <div>
            <p className="text-xs text-muted-foreground">Location</p>
            <p className="text-sm font-medium">{artisan.location}</p>
          </div>
        </div>
      )}
      <div className="flex items-center gap-3">
        <Briefcase className="size-4 text-muted-foreground" />
        <div>
          <p className="text-xs text-muted-foreground">Category</p>
          <p className="text-sm font-medium">{artisan.category}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Calendar className="size-4 text-muted-foreground" />
        <div>
          <p className="text-xs text-muted-foreground">Joined</p>
          <p className="text-sm font-medium">{format(new Date(artisan.joinedAt), 'MMM dd, yyyy')}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Star className="size-4 fill-yellow-400 text-yellow-400" />
        <div>
          <p className="text-xs text-muted-foreground">Rating</p>
          <p className="text-sm font-medium">
            {artisan.rating.toFixed(1)} ({artisan.totalReviews} reviews)
          </p>
        </div>
      </div>
    </div>
  )
}

export function ArtisanVerificationSection({
  artisan,
  isActionLoading,
  onVerify,
}: Pick<ArtisanDetailsDrawerSectionsProps, 'artisan' | 'isActionLoading' | 'onVerify'>) {
  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <FileText className="size-4" />
          Verification Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Current Status</p>
            <StatusBadge
              status={artisan.verificationStatus}
              variant={getVerificationVariant(artisan.verificationStatus)}
            />
          </div>
          {artisan.verificationStatus === 'pending' && (
            <div className="flex gap-2">
              <Button size="sm" variant="primary" onClick={() => onVerify('verified')} disabled={isActionLoading}>
                <CheckCircle className="mr-2 size-4" />
                Approve
              </Button>
              <Button size="sm" variant="danger" onClick={() => onVerify('rejected')} disabled={isActionLoading}>
                <XCircle className="mr-2 size-4" />
                Reject
              </Button>
            </div>
          )}
        </div>

        {artisan.documents && artisan.documents.length > 0 && (
          <div>
            <p className="mb-2 text-xs text-muted-foreground">Submitted Documents</p>
            <div className="space-y-2">
              {artisan.documents.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between rounded-lg border border-border bg-background p-3">
                  <div className="flex items-center gap-3">
                    <FileText className="size-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">{doc.name}</p>
                      <p className="text-xs text-muted-foreground">{doc.type}</p>
                    </div>
                  </div>
                  <StatusBadge status={doc.status} variant={getDocumentStatusVariant(doc.status)} />
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export function ArtisanMetricsSection({ artisan }: { artisan: ArtisanDetails }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Performance Metrics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="text-center">
            <p className="text-2xl font-bold">{artisan.totalBookings}</p>
            <p className="text-xs text-muted-foreground">Total Bookings</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-success">{artisan.completedBookings}</p>
            <p className="text-xs text-muted-foreground">Completed</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-danger">{artisan.cancelledBookings}</p>
            <p className="text-xs text-muted-foreground">Cancelled</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-warning">{artisan.rating.toFixed(1)}</p>
            <p className="text-xs text-muted-foreground">Avg Rating</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function ArtisanPortfolioSection({ artisan }: { artisan: ArtisanDetails }) {
  if (!artisan.portfolio || artisan.portfolio.length === 0) return null

  return (
    <>
      <Separator />
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <ImageIcon className="size-4" />
            Portfolio
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            {artisan.portfolio.slice(0, 4).map((item) => (
              <div key={item.id} className="relative aspect-square overflow-hidden rounded-lg border border-border">
                <img src={item.imageUrl} alt={item.title} className="size-full object-cover" />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                  <p className="truncate text-xs font-medium text-white">{item.title}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  )
}

export function ArtisanReviewsSection({ artisan }: { artisan: ArtisanDetails }) {
  if (!artisan.reviews || artisan.reviews.length === 0) return null

  return (
    <>
      <Separator />
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Star className="size-4 fill-yellow-400 text-yellow-400" />
            Recent Reviews
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {artisan.reviews.slice(0, 3).map((review) => (
              <div key={review.id} className="rounded-lg border border-border p-3">
                <div className="mb-2 flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <Avatar className="size-6">
                      <AvatarImage src={review.studentAvatar || undefined} alt={review.studentName} />
                      <AvatarFallback className="text-xs">{review.studentName[0]}</AvatarFallback>
                    </Avatar>
                    <p className="text-sm font-medium">{review.studentName}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`size-3 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{review.comment}</p>
                <p className="mt-2 text-xs text-muted-foreground">{format(new Date(review.createdAt), 'MMM dd, yyyy')}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  )
}

export function ArtisanBookingsSection({ artisan }: { artisan: ArtisanDetails }) {
  if (!artisan.bookings || artisan.bookings.length === 0) return null

  return (
    <>
      <Separator />
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <BookOpen className="size-4" />
            Recent Bookings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {artisan.bookings.slice(0, 3).map((booking) => (
              <div key={booking.id} className="flex items-center justify-between rounded-lg border border-border p-3">
                <div className="flex-1">
                  <p className="text-sm font-medium">{booking.serviceName}</p>
                  <p className="text-xs text-muted-foreground">{booking.studentName}</p>
                </div>
                <div className="text-right">
                  <Badge variant={booking.status === 'completed' ? 'success' : 'secondary'}>{booking.status}</Badge>
                  <p className="mt-1 text-xs text-muted-foreground">{format(new Date(booking.scheduledDate), 'MMM dd')}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  )
}

export function ArtisanDetailsFooter({
  artisan,
  isActionLoading,
  onStatusToggle,
  onDelete,
  onClose,
}: Pick<ArtisanDetailsDrawerSectionsProps, 'artisan' | 'isActionLoading' | 'onStatusToggle' | 'onDelete' | 'onClose'>) {
  return (
    <div className="flex gap-2 w-full">
      {artisan.status === 'active' ? (
        <Button variant="outline" className="flex-1" onClick={onStatusToggle} disabled={isActionLoading}>
          <AlertTriangle className="mr-2 size-4" />
          Suspend
        </Button>
      ) : (
        <Button variant="outline" className="flex-1" onClick={onStatusToggle} disabled={isActionLoading}>
          <CheckCircle className="mr-2 size-4" />
          Activate
        </Button>
      )}
      <Button variant="danger" className="flex-1" onClick={onDelete} disabled={isActionLoading}>
        <Trash2 className="mr-2 size-4" />
        Delete
      </Button>
      <Button variant="ghost" onClick={onClose} className="w-full">
        Close
      </Button>
    </div>
  )
}
