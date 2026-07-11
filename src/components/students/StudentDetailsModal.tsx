import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { format } from 'date-fns'
import type { StudentDetails, StudentStatus } from '@/types/student.types'
import { studentStatus } from '@/types/student.types'
import { StatusBadge } from '@/components/common/StatusBadge'
import { Calendar, Mail, Phone, MapPin, BookOpen, AlertTriangle } from 'lucide-react'

interface StudentDetailsModalProps {
  student: StudentDetails | null
  isLoading?: boolean
  isOpen: boolean
  onClose: () => void
  onStatusChange: (id: string, status: 'active' | 'suspended') => void
  onDelete: (id: string) => void
}

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .map((part) => part.charAt(0))
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

function getStatusVariant(status: StudentStatus): 'success' | 'warning' {
  return status === 'active' ? 'success' : 'warning'
}

export function StudentDetailsModal({
  student,
  isLoading,
  isOpen,
  onClose,
  onStatusChange,
  onDelete,
}: StudentDetailsModalProps) {
  const [isActionLoading, setIsActionLoading] = useState(false)

  const handleStatusToggle = async () => {
    if (!student) return
    setIsActionLoading(true)
    try {
      const newStatus = studentStatus(student) === 'active' ? 'suspended' : 'active'
      await onStatusChange(student.id, newStatus)
    } finally {
      setIsActionLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!student) return
    if (!confirm('Are you sure you want to delete this student? This action cannot be undone.')) {
      return
    }
    setIsActionLoading(true)
    try {
      await onDelete(student.id)
      onClose()
    } finally {
      setIsActionLoading(false)
    }
  }

  if (isLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Student Details</DialogTitle>
          </DialogHeader>
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
        </DialogContent>
      </Dialog>
    )
  }

  if (!student) return null

  const status = studentStatus(student)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Student Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Profile Info */}
          <div className="flex items-start gap-4">
            <Avatar className="size-16">
              <AvatarImage src={student.profileImageUrl || undefined} alt={student.name} />
              <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                {getInitials(student.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="text-xl font-semibold">
                {student.name}
              </h3>
              <div className="mt-2 flex items-center gap-2">
                <StatusBadge
                  status={status}
                  variant={getStatusVariant(status)}
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
                <p className="text-sm font-medium">{student.email}</p>
              </div>
            </div>
            {student.phone && (
              <div className="flex items-center gap-3">
                <Phone className="size-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Phone</p>
                  <p className="text-sm font-medium">{student.phone}</p>
                </div>
              </div>
            )}
            {student.location && (
              <div className="flex items-center gap-3">
                <MapPin className="size-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Location</p>
                  <p className="text-sm font-medium">{student.location}</p>
                </div>
              </div>
            )}
            <div className="flex items-center gap-3">
              <Calendar className="size-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Joined</p>
                <p className="text-sm font-medium">
                  {format(new Date(student.createdAt), 'MMM dd, yyyy')}
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Activity Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Activity Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="text-center">
                  <p className="text-2xl font-bold">{student.totalBookings ?? 0}</p>
                  <p className="text-xs text-muted-foreground">Total Bookings</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-success">{student.completedBookings ?? 0}</p>
                  <p className="text-xs text-muted-foreground">Completed</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-danger">{student.cancelledBookings ?? 0}</p>
                  <p className="text-xs text-muted-foreground">Cancelled</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Account Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Account Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                variant="outline"
                className="w-full"
                onClick={handleStatusToggle}
                disabled={isActionLoading}
              >
                {status === 'active' ? 'Suspend Account' : 'Activate Account'}
              </Button>
              <Button
                variant="danger"
                className="w-full"
                onClick={handleDelete}
                disabled={isActionLoading}
              >
                <AlertTriangle className="size-4 mr-2" />
                Delete Account
              </Button>
            </CardContent>
          </Card>

          {/* Booking Preview */}
          {student.bookings && student.bookings.length > 0 && (
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
                    {student.bookings.slice(0, 5).map((booking) => (
                      <div
                        key={booking.id}
                        className="flex items-center justify-between rounded-lg border border-border p-3"
                      >
                        <div className="flex-1">
                          <p className="font-medium text-sm">{booking.serviceName}</p>
                          <p className="text-xs text-muted-foreground">
                            {booking.artisanName}
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
        </div>
      </DialogContent>
    </Dialog>
  )
}
