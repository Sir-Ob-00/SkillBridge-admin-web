import { useState } from 'react'
import { Drawer, DrawerBody, DrawerContent, DrawerFooter, DrawerHeader, DrawerOverlay, DrawerTitle } from '@/components/ui/drawer'
import { Separator } from '@/components/ui/separator'
import type { ArtisanDetails } from '@/types/artisan.types'
import {
  ArtisanBookingsSection,
  ArtisanContactSection,
  ArtisanDetailsFooter,
  ArtisanMetricsSection,
  ArtisanPortfolioSection,
  ArtisanProfileSection,
  ArtisanReviewsSection,
  ArtisanVerificationSection,
} from './ArtisanDetailsDrawerSections'
import { ArtisanDetailsDrawerSkeleton } from './ArtisanDetailsDrawerSkeleton'

interface ArtisanDetailsDrawerProps {
  artisan: ArtisanDetails | null
  isLoading?: boolean
  isOpen: boolean
  onClose: () => void
  onStatusChange: (id: string, status: 'active' | 'suspended') => void
  onVerify: (id: string, payload: { status: 'verified' | 'rejected'; note?: string }) => void
  onDelete: (id: string) => void
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

    const confirmMessage =
      status === 'verified'
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
    return <ArtisanDetailsDrawerSkeleton isOpen={isOpen} onClose={onClose} />
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
          <ArtisanProfileSection artisan={artisan} />

          <Separator />

          <ArtisanContactSection artisan={artisan} />

          <Separator />

          <ArtisanVerificationSection artisan={artisan} isActionLoading={isActionLoading} onVerify={handleVerify} />

          <ArtisanMetricsSection artisan={artisan} />

          <ArtisanPortfolioSection artisan={artisan} />

          <ArtisanReviewsSection artisan={artisan} />

          <ArtisanBookingsSection artisan={artisan} />
        </DrawerBody>

        <DrawerFooter className="flex-col gap-3">
          <ArtisanDetailsFooter
            artisan={artisan}
            isActionLoading={isActionLoading}
            onStatusToggle={handleStatusToggle}
            onDelete={handleDelete}
            onClose={onClose}
          />
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
