import { useState } from 'react'
import { Drawer, DrawerBody, DrawerContent, DrawerFooter, DrawerHeader, DrawerOverlay, DrawerTitle } from '@/components/ui/drawer'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { StatusBadge } from '@/components/common/StatusBadge'
import { format } from 'date-fns'
import { Ban, Check, Mail, Phone, MapPin, Star, Briefcase, Image as ImageIcon, Loader2, ArrowUpDown } from 'lucide-react'
import type { Artisan } from '@/types/artisan.types'
import { artisanStatus, artisanStatusVariant, artisanVerificationVariant } from '@/types/artisan.types'
import { formatStatusLabel } from '@/components/common/StatusBadge'

interface ArtisanDetailsDrawerProps {
  artisan: Artisan | null
  isLoading?: boolean
  isOpen: boolean
  onClose: () => void
  onStatusChange: (id: string, status: 'active' | 'suspended') => void
  onApplicationStatusChange?: (id: string, status: string, notes?: string) => Promise<void>
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

const APPLICATION_STATUS_OPTIONS = ['UNDER_REVIEW', 'ACTIVE', 'REJECTED', 'CHANGES_REQUESTED'] as const

export function ArtisanDetailsDrawer({
  artisan,
  isLoading,
  isOpen,
  onClose,
  onStatusChange,
  onApplicationStatusChange,
}: ArtisanDetailsDrawerProps) {
  const [isActionLoading, setIsActionLoading] = useState(false)
  const [showStatusActions, setShowStatusActions] = useState(false)
  const [selectedAppStatus, setSelectedAppStatus] = useState<string | null>(null)
  const [statusNotes, setStatusNotes] = useState('')

  const handleStatusToggle = async () => {
    if (!artisan) return
    const status = artisanStatus(artisan) === 'active' ? 'suspended' : 'active'
    setIsActionLoading(true)
    try {
      await onStatusChange(artisan.id, status)
    } finally {
      setIsActionLoading(false)
    }
  }

  const handleApplicationStatusChange = async (newStatus: string) => {
    if (!artisan || !onApplicationStatusChange) return
    setIsActionLoading(true)
    try {
      await onApplicationStatusChange(artisan.id, newStatus, statusNotes || undefined)
      setShowStatusActions(false)
      setSelectedAppStatus(null)
      setStatusNotes('')
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
            <DrawerTitle>Artisan Details</DrawerTitle>
          </DrawerHeader>
          <DrawerBody className="flex items-center justify-center py-12">
            <Loader2 className="size-8 animate-spin text-muted-foreground" />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    )
  }

  if (!artisan) return null

  const status = artisanStatus(artisan)

  return (
    <Drawer>
      <DrawerOverlay open={isOpen} onClose={onClose} />
      <DrawerContent open={isOpen} className="max-w-2xl">
        <DrawerHeader>
          <DrawerTitle>Artisan Details</DrawerTitle>
        </DrawerHeader>

        <DrawerBody className="space-y-6">
          {/* Profile */}
          <div className="flex items-start gap-4">
            <Avatar className="size-16">
              <AvatarImage src={artisan.user.profileImageUrl || undefined} alt={artisan.user.name} />
              <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                {getInitials(artisan.user.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="text-xl font-semibold">{artisan.businessName || artisan.user.name}</h3>
              <p className="text-sm text-muted-foreground">{artisan.user.name}</p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <StatusBadge status={artisan.verification} variant={artisanVerificationVariant(artisan.verification)} />
                <StatusBadge status={status} variant={artisanStatusVariant(status)} />
              </div>
            </div>
          </div>

          <Separator />

          {/* Contact */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex items-center gap-3">
              <Mail className="size-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="text-sm font-medium">{artisan.user.email}</p>
              </div>
            </div>
            {artisan.user.phone && (
              <div className="flex items-center gap-3">
                <Phone className="size-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Phone</p>
                  <p className="text-sm font-medium">{artisan.user.phone}</p>
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
            {artisan.pricingFrom && (
              <div className="flex items-center gap-3">
                <Briefcase className="size-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Pricing From</p>
                  <p className="text-sm font-medium">GH₵ {artisan.pricingFrom}</p>
                </div>
              </div>
            )}
          </div>

          {artisan.bio && (
            <p className="text-sm text-muted-foreground">{artisan.bio}</p>
          )}

          <Separator />

          {/* Metrics */}
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="text-center">
              <p className="text-2xl font-bold flex items-center justify-center gap-1">
                <Star className="size-5 fill-yellow-400 text-yellow-400" />
                {artisan.rating ? Number(artisan.rating).toFixed(1) : '—'}
              </p>
              <p className="text-xs text-muted-foreground">Rating</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{artisan.reviewCount ?? 0}</p>
              <p className="text-xs text-muted-foreground">Reviews</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{format(new Date(artisan.createdAt), 'MMM yyyy')}</p>
              <p className="text-xs text-muted-foreground">Joined</p>
            </div>
          </div>

          {/* Portfolio */}
          {artisan.portfolio && artisan.portfolio.length > 0 && (
            <>
              <Separator />
              <div>
                <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                  <ImageIcon className="size-4" />
                  Portfolio
                </h4>
                <div className="grid grid-cols-3 gap-2">
                  {artisan.portfolio.map((item) => (
                    <img
                      key={item.id}
                      src={item.imageUrl}
                      alt={item.caption || 'Portfolio'}
                      className="aspect-square w-full object-cover rounded-lg border border-border"
                    />
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Application status */}
          <Separator />
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Application Status</span>
              <StatusBadge status={formatStatusLabel(artisan.applicationStatus)} variant="warning" />
            </div>
            {artisan.rejectionReason && (
              <div className="text-xs text-danger">Rejection reason: {artisan.rejectionReason}</div>
            )}
            {onApplicationStatusChange && (
              <>
                {!showStatusActions ? (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => setShowStatusActions(true)}
                  >
                    <ArrowUpDown className="mr-2 size-4" />
                    Change Status
                  </Button>
                ) : (
                  <div className="space-y-3 rounded-md border border-border p-3">
                    <p className="text-xs font-medium text-muted-foreground">Select new status</p>
                    <div className="flex flex-wrap gap-2">
                      {APPLICATION_STATUS_OPTIONS.map((option) => {
                        const isActive = selectedAppStatus === option
                        const variant = option === 'ACTIVE' ? 'primary' as const
                          : option === 'REJECTED' ? 'danger' as const
                          : 'outline' as const
                        return (
                          <Button
                            key={option}
                            size="sm"
                            variant={isActive ? variant : 'outline'}
                            onClick={() => {
                              setSelectedAppStatus(option)
                              if (option !== 'rejected' && option !== 'changes_requested') {
                                setStatusNotes('')
                              }
                            }}
                          >
                            {formatStatusLabel(option)}
                          </Button>
                        )
                      })}
                    </div>
                    {(selectedAppStatus === 'REJECTED' || selectedAppStatus === 'CHANGES_REQUESTED') && (
                      <div className="space-y-2">
                        <Label htmlFor="status-notes" className="text-xs">
                          {selectedAppStatus === 'REJECTED' ? 'Rejection reason' : 'Message to artisan'}
                        </Label>
                        <Input
                          id="status-notes"
                          value={statusNotes}
                          onChange={(e) => setStatusNotes(e.target.value)}
                          placeholder={
                            selectedAppStatus === 'REJECTED'
                              ? 'Enter rejection reason...'
                              : 'Describe what changes are needed...'
                          }
                        />
                      </div>
                    )}
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="primary"
                        disabled={!selectedAppStatus || isActionLoading}
                        onClick={() => selectedAppStatus && handleApplicationStatusChange(selectedAppStatus)}
                      >
                        {isActionLoading ? (
                          <Loader2 className="mr-2 size-4 animate-spin" />
                        ) : (
                          <Check className="mr-2 size-4" />
                        )}
                        Apply
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setShowStatusActions(false)
                          setSelectedAppStatus(null)
                          setStatusNotes('')
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </DrawerBody>

        <DrawerFooter className="flex-col gap-3">
          <Button
            variant="outline"
            className="w-full"
            onClick={handleStatusToggle}
            disabled={isActionLoading}
          >
            {status === 'active' ? (
              <>
                <Ban className="mr-2 size-4" />
                Suspend Artisan
              </>
            ) : (
              <>
                <Check className="mr-2 size-4" />
                Activate Artisan
              </>
            )}
          </Button>
          <Button variant="ghost" onClick={onClose} className="w-full">
            Close
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
