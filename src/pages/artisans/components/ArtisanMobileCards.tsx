import { format } from 'date-fns'
import { Eye, Ban, Trash2, Check, Briefcase, Star } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/common/StatusBadge'
import type { Artisan } from '@/types/artisan.types'
import { getInitials, getStatusVariant, getVerificationVariant } from '../utils/artisanHelpers'

interface ArtisanMobileCardsProps {
  artisans: Artisan[]
  onViewDetails: (artisan: Artisan) => void
  onStatusToggle: (id: string, status: 'active' | 'suspended') => void
  onVerify: (id: string, payload: { status: 'verified' | 'rejected'; note?: string }) => void
  onDelete: (id: string) => void
}

export function ArtisanMobileCards({ artisans, onViewDetails, onStatusToggle, onVerify, onDelete }: ArtisanMobileCardsProps) {
  return (
    <div className="space-y-4 md:hidden">
      {artisans.map((artisan) => (
        <Card key={artisan.id}>
          <CardContent className="space-y-3 p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <Avatar className="size-10">
                  <AvatarImage src={artisan.avatar || undefined} alt={`${artisan.firstName} ${artisan.lastName}`} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs">{getInitials(artisan.firstName, artisan.lastName)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{artisan.businessName}</p>
                  <p className="text-sm text-muted-foreground">{artisan.firstName} {artisan.lastName}</p>
                </div>
              </div>
              <StatusBadge status={artisan.status} variant={getStatusVariant(artisan.status)} />
            </div>
            <div className="grid gap-2 text-sm">
              <div className="flex items-center justify-between"><span className="text-muted-foreground">Category</span><span className="flex items-center gap-1"><Briefcase className="size-3 text-muted-foreground" />{artisan.category}</span></div>
              <div className="flex items-center justify-between"><span className="text-muted-foreground">Rating</span><span className="flex items-center gap-1"><Star className="size-3 fill-yellow-400 text-yellow-400" />{artisan.rating.toFixed(1)} ({artisan.totalReviews})</span></div>
              <div className="flex items-center justify-between"><span className="text-muted-foreground">Joined</span><span>{format(new Date(artisan.joinedAt), 'MMM dd, yyyy')}</span></div>
              <div className="flex items-center justify-between"><span className="text-muted-foreground">Bookings</span><span className="font-medium">{artisan.totalBookings}</span></div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" onClick={() => onViewDetails(artisan)}>
                <Eye className="mr-2 size-4" />
                View Profile
              </Button>
              {artisan.status === 'active' ? (
                <Button variant="outline" onClick={() => onStatusToggle(artisan.id, 'suspended')}>
                  <Ban className="mr-2 size-4" />
                  Suspend
                </Button>
              ) : (
                <Button variant="outline" onClick={() => onStatusToggle(artisan.id, 'active')}>
                  <Check className="mr-2 size-4" />
                  Activate
                </Button>
              )}
              {artisan.verificationStatus === 'pending' && (
                <>
                  <Button variant="outline" onClick={() => onVerify(artisan.id, { status: 'verified' })}>
                    <Check className="mr-2 size-4" />
                    Verify
                  </Button>
                  <Button variant="outline" onClick={() => onVerify(artisan.id, { status: 'rejected' })}>
                    <Ban className="mr-2 size-4" />
                    Reject
                  </Button>
                </>
              )}
              <Button variant="outline" onClick={() => onDelete(artisan.id)} className="col-span-2 text-danger">
                <Trash2 className="mr-2 size-4" />
                Delete
              </Button>
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Verification</span>
              <StatusBadge status={artisan.verificationStatus} variant={getVerificationVariant(artisan.verificationStatus)} />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
