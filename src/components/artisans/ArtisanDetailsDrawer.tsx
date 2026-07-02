import { useState } from 'react'
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
import { format } from 'date-fns'
import type { ArtisanDetails, ArtisanStatus, VerificationStatus } from '@/types/artisan.types'
import { StatusBadge } from '@/components/common/StatusBadge'
import { Star, Calendar, Mail, Phone, MapPin, Briefcase, CheckCircle, XCircle, AlertTriangle, FileText, Image as ImageIcon, BookOpen, Trash2 } from 'lucide-react'

interface ArtisanDetailsDrawerProps {
  artisan: ArtisanDetails | null
  isLoading?: boolean
  isOpen: boolean
  onClose: () => void
  onStatusChange: (id: string, status: 'active' | 'suspended') => void
  onVerify: (id: string, payload: { status: 'verified' | 'rejected'; note?: string }) => void
  onDelete: (id: string) => void
}

function getInitials(firstName: string, lastName: string): string {
  return `${firstName[0]}${lastName[0]}`.toUpperCase()
}

function getStatusVariant(status: ArtisanStatus): 'success' | 'warning' | 'danger' | 'secondary' {
  switch (status) {
    case 'active':
      return 'success'
    case 'suspended':
      return 'warning'
    case 'rejected':
      return 'danger'
    case 'pending':
      return 'secondary'
    default:
      return 'secondary'
  }
}

function getVerificationVariant(status: VerificationStatus): 'success' | 'warning' | 'danger' | 'secondary' {
  switch (status) {
    case 'verified':
      return 'success'
    case 'pending':
      return 'warning'
    case 'rejected':
      return 'danger'
    case 'unverified':
      return 'secondary'
    default:
      return 'secondary'
  }
}

export function ArtisanDetailsDrawer({
  artisan,
  isLoading,
  isOpen,
  onClose,
  onStatusChange,
  onVerify,
  onDelete,
}: ArtisanDetailsDrawerProps) {
  const [isActionLoading, setIsActionLoading] = useState(false)
  const [verifyNote, setVerifyNote] = useState('')

  const handleStatusToggle = async () => {
    if (!artisan) return
    setIsActionLoading(true)
    try {
      const newStatus = artisan.status === 'active' ? 'suspended' : 'active'
      await onStatusChange(artisan.id, newStatus)
    } finally {
      setIsActionLoading(false)
    }
  }

  const handleVerify = async (status: 'verified' | 'rejected') => {
    if (!artisan) return
    const confirmMessage = status === 'verified' 
      ? 'Are you sure you want to verify this artisan? They will become visible in the marketplace.'
      : 'Are you sure you want to reject this artisan? They will need to resubmit their verification.'
    
    if (!confirm(confirmMessage)) return
    
    setIsActionLoading(true)
    try {
      await onVerify(artisan.id, { status, note: verifyNote || undefined })
      setVerifyNote('')
    } finally {
      setIsActionLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!artisan) return
    if (!confirm('Are you sure you want to delete this artisan? This action cannot be undone.')) {
      return
    }
    setIsActionLoading(true)
    try {
      await onDelete(artisan.id)
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
              <div className="flex items-center gap-4">
                <Skeleton className="size-16 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>
              <Separator />
              <div className="space-y-4">
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
              </div>
            </div>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    )
  }

  if (!artisan) return null

  return (
    <Drawer>
      <DrawerOverlay open={isOpen} onClose={onClose} />
      <DrawerContent open={isOpen}>
        <DrawerHeader>
          <DrawerTitle>Artisan Details</DrawerTitle>
        </DrawerHeader>

        <DrawerBody className="space-y-6">
          {/* Basic Profile */}
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
              <div className="mt-2 flex items-center gap-2 flex-wrap">
                <StatusBadge
                  status={artisan.status}
                  variant={getStatusVariant(artisan.status)}
                />
                <StatusBadge
                  status={artisan.verificationStatus}
                  variant={getVerificationVariant(artisan.verificationStatus)}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Contact Information */}
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
                <p className="text-sm font-medium">
                  {format(new Date(artisan.joinedAt), 'MMM dd, yyyy')}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Star className="size-4 text-muted-foreground fill-yellow-400 text-yellow-400" />
              <div>
                <p className="text-xs text-muted-foreground">Rating</p>
                <p className="text-sm font-medium">
                  {artisan.rating.toFixed(1)} ({artisan.totalReviews} reviews)
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Verification Status Panel */}
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
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
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => handleVerify('verified')}
                      disabled={isActionLoading}
                    >
                      <CheckCircle className="size-4 mr-2" />
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => handleVerify('rejected')}
                      disabled={isActionLoading}
                    >
                      <XCircle className="size-4 mr-2" />
                      Reject
                    </Button>
                  </div>
                )}
              </div>
              
              {artisan.documents && artisan.documents.length > 0 && (
                <div>
                  <p className="text-xs text-muted-foreground mb-2">Submitted Documents</p>
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
                        <StatusBadge
                          status={doc.status}
                          variant={doc.status === 'approved' ? 'success' : doc.status === 'rejected' ? 'danger' : 'warning'}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Performance Metrics */}
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

          {/* Portfolio Section */}
          {artisan.portfolio && artisan.portfolio.length > 0 && (
            <>
              <Separator />
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <ImageIcon className="size-4" />
                    Portfolio
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    {artisan.portfolio.slice(0, 4).map((item) => (
                      <div key={item.id} className="relative aspect-square rounded-lg overflow-hidden border border-border">
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="size-full object-cover"
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                          <p className="text-xs text-white font-medium truncate">{item.title}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {/* Reviews Section */}
          {artisan.reviews && artisan.reviews.length > 0 && (
            <>
              <Separator />
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Star className="size-4 fill-yellow-400 text-yellow-400" />
                    Recent Reviews
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {artisan.reviews.slice(0, 3).map((review) => (
                      <div key={review.id} className="rounded-lg border border-border p-3">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Avatar className="size-6">
                              <AvatarImage src={review.studentAvatar || undefined} alt={review.studentName} />
                              <AvatarFallback className="text-xs">
                                {review.studentName[0]}
                              </AvatarFallback>
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
                        <p className="text-xs text-muted-foreground mt-2">
                          {format(new Date(review.createdAt), 'MMM dd, yyyy')}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {/* Bookings Preview */}
          {artisan.bookings && artisan.bookings.length > 0 && (
            <>
              <Separator />
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <BookOpen className="size-4" />
                    Recent Bookings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {artisan.bookings.slice(0, 3).map((booking) => (
                      <div
                        key={booking.id}
                        className="flex items-center justify-between rounded-lg border border-border p-3"
                      >
                        <div className="flex-1">
                          <p className="font-medium text-sm">{booking.serviceName}</p>
                          <p className="text-xs text-muted-foreground">
                            {booking.studentName}
                          </p>
                        </div>
                        <div className="text-right">
                          <Badge variant={booking.status === 'completed' ? 'success' : 'secondary'}>
                            {booking.status}
                          </Badge>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {format(new Date(booking.scheduledDate), 'MMM dd')}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </DrawerBody>

        <DrawerFooter className="flex-col gap-3">
          <div className="flex gap-2 w-full">
            {artisan.status === 'active' ? (
              <Button
                variant="outline"
                className="flex-1"
                onClick={handleStatusToggle}
                disabled={isActionLoading}
              >
                <AlertTriangle className="size-4 mr-2" />
                Suspend
              </Button>
            ) : (
              <Button
                variant="outline"
                className="flex-1"
                onClick={handleStatusToggle}
                disabled={isActionLoading}
              >
                <CheckCircle className="size-4 mr-2" />
                Activate
              </Button>
            )}
            <Button
              variant="danger"
              className="flex-1"
              onClick={handleDelete}
              disabled={isActionLoading}
            >
              <Trash2 className="size-4 mr-2" />
              Delete
            </Button>
          </div>
          <Button variant="ghost" onClick={onClose} className="w-full">
            Close
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
