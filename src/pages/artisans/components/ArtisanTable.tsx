import { format } from 'date-fns'
import { MoreVertical, Eye, Ban, Trash2, Check, Shield, Briefcase, Star } from 'lucide-react'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/common/Table'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/common/StatusBadge'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import type { Artisan } from '@/types/artisan.types'
import { getInitials, getStatusVariant, getVerificationVariant } from '../utils/artisanHelpers'

interface ArtisanTableProps {
  artisans: Artisan[]
  onViewDetails: (artisan: Artisan) => void
  onStatusToggle: (id: string, status: 'active' | 'suspended') => void
  onVerify: (id: string, payload: { status: 'verified' | 'rejected'; note?: string }) => void
  onDelete: (id: string) => void
}

export function ArtisanTable({ artisans, onViewDetails, onStatusToggle, onVerify, onDelete }: ArtisanTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Artisan</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Rating</TableHead>
          <TableHead>Verification</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Joined</TableHead>
          <TableHead>Bookings</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {artisans.map((artisan) => (
          <TableRow key={artisan.id}>
            <TableCell>
              <div className="flex items-center gap-3">
                <Avatar className="size-8">
                  <AvatarImage src={artisan.avatar || undefined} alt={`${artisan.firstName} ${artisan.lastName}`} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                    {getInitials(artisan.firstName, artisan.lastName)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-sm">{artisan.businessName}</p>
                  <p className="text-xs text-muted-foreground">{artisan.firstName} {artisan.lastName}</p>
                </div>
              </div>
            </TableCell>
            <TableCell>
              <span className="text-sm flex items-center gap-1">
                <Briefcase className="size-3 text-muted-foreground" />
                {artisan.category}
              </span>
            </TableCell>
            <TableCell>
              <span className="text-sm flex items-center gap-1">
                <Star className="size-3 fill-yellow-400 text-yellow-400" />
                {artisan.rating.toFixed(1)} ({artisan.totalReviews})
              </span>
            </TableCell>
            <TableCell>
              <StatusBadge status={artisan.verificationStatus} variant={getVerificationVariant(artisan.verificationStatus)} />
            </TableCell>
            <TableCell>
              <StatusBadge status={artisan.status} variant={getStatusVariant(artisan.status)} />
            </TableCell>
            <TableCell>
              <span className="text-sm">{format(new Date(artisan.joinedAt), 'MMM dd, yyyy')}</span>
            </TableCell>
            <TableCell>
              <span className="text-sm font-medium">{artisan.totalBookings}</span>
            </TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="size-8">
                    <MoreVertical className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onViewDetails(artisan)}>
                    <Eye className="mr-2 size-4" />
                    View Profile
                  </DropdownMenuItem>
                  {artisan.verificationStatus === 'pending' && (
                    <>
                      <DropdownMenuItem onClick={() => onVerify(artisan.id, { status: 'verified' })}>
                        <Shield className="mr-2 size-4" />
                        Verify
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onVerify(artisan.id, { status: 'rejected' })} className="text-danger">
                        <Ban className="mr-2 size-4" />
                        Reject
                      </DropdownMenuItem>
                    </>
                  )}
                  {artisan.status === 'active' ? (
                    <DropdownMenuItem onClick={() => onStatusToggle(artisan.id, 'suspended')}>
                      <Ban className="mr-2 size-4" />
                      Suspend
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem onClick={() => onStatusToggle(artisan.id, 'active')}>
                      <Check className="mr-2 size-4" />
                      Activate
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={() => onDelete(artisan.id)} className="text-danger">
                    <Trash2 className="mr-2 size-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

