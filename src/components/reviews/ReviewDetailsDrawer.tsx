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
import { RatingStars } from './RatingStars'
import { Flag, User, Briefcase, FileText, Calendar, Copy } from 'lucide-react'
import type { Review } from '@/types/review.types'

interface ReviewDetailsDrawerProps {
  review: Review | null
  isLoading?: boolean
  isOpen: boolean
  onClose: () => void
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

export function ReviewDetailsDrawer({ review, isLoading, isOpen, onClose }: ReviewDetailsDrawerProps) {
  const handleCopy = () => {
    if (review) navigator.clipboard.writeText(review.id)
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

  if (!review) return null

  return (
    <Drawer>
      <DrawerOverlay open={isOpen} onClose={onClose} />
      <DrawerContent open={isOpen} className="max-w-2xl">
        <DrawerHeader>
          <div className="flex items-center justify-between">
            <DrawerTitle>Review Details</DrawerTitle>
            <Button variant="ghost" size="icon" onClick={handleCopy} className="size-8">
              <Copy className="size-4" />
            </Button>
          </div>
        </DrawerHeader>

        <DrawerBody className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <RatingStars rating={review.rating} className="size-6" />
              <span className="text-2xl font-bold">{review.rating}</span>
              {review.isFlagged && (
                <span className="flex items-center gap-1 text-sm text-danger">
                  <Flag className="size-4" /> Flagged
                </span>
              )}
            </div>
            <p className="text-sm">{review.comment}</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
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
                <p className="text-sm font-medium">{format(new Date(review.createdAt), 'MMM dd, yyyy • HH:mm')}</p>
              </div>
            </div>
          </div>

          <Separator />

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex items-start gap-3">
              <Avatar className="size-10">
                <AvatarImage src={review.student.profileImageUrl || undefined} alt={review.student.name} />
                <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                  {getInitials(review.student.name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <User className="size-3" /> Student
                </p>
                <p className="text-sm font-medium">{review.student.name}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Avatar className="size-10">
                <AvatarImage src={review.artisan.user.profileImageUrl || undefined} alt={review.artisan.user.name} />
                <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                  {getInitials(review.artisan.user.name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Briefcase className="size-3" /> Artisan
                </p>
                <p className="text-sm font-medium">{review.artisan.user.name}</p>
              </div>
            </div>
          </div>
        </DrawerBody>

        <DrawerFooter>
          <Button variant="ghost" onClick={onClose} className="w-full">
            Close
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
