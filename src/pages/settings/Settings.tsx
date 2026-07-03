import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { PageContainer } from '@/components/layout/PageContainer'
import { PageHeader } from '@/components/feedback/PageHeader'
import { ErrorState } from '@/components/common/ErrorState'
import { Button } from '@/components/ui/button'
import { GeneralSettings as GeneralSettingsComponent } from '@/components/settings/GeneralSettings'
import { BookingSettings as BookingSettingsComponent } from '@/components/settings/BookingSettings'
import { NotificationSettings as NotificationSettingsComponent } from '@/components/settings/NotificationSettings'
import { PlatformSettings as PlatformSettingsComponent } from '@/components/settings/PlatformSettings'
import { getSettings, updateSettings } from '@/services/settings.service'
import type { GeneralSettings, BookingSettings, NotificationSettings, PlatformSettings } from '@/types/settings.types'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import toast from 'react-hot-toast'

export default function Settings() {
  const queryClient = useQueryClient()
  const [activeTab, setActiveTab] = useState('general')
  const [showMaintenanceConfirm, setShowMaintenanceConfirm] = useState(false)
  const [pendingSettings, setPendingSettings] = useState<PlatformSettings | null>(null)

  const { data: settings, isLoading, error, refetch } = useQuery({
    queryKey: ['settings'],
    queryFn: getSettings,
  })

  const updateMutation = useMutation({
    mutationFn: updateSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] })
      toast.success('Settings updated successfully')
    },
    onError: () => {
      toast.error('Failed to update settings')
    },
  })

  const handleSaveGeneral = (data: GeneralSettings) => {
    updateMutation.mutate({ general: data })
  }

  const handleSaveBooking = (data: BookingSettings) => {
    updateMutation.mutate({ booking: data })
  }

  const handleSaveNotifications = (data: NotificationSettings) => {
    updateMutation.mutate({ notifications: data })
  }

  const handleSavePlatform = (data: PlatformSettings) => {
    if (data.maintenanceMode && !settings?.platform.maintenanceMode) {
      setPendingSettings(data)
      setShowMaintenanceConfirm(true)
    } else {
      updateMutation.mutate({ platform: data })
    }
  }

  const handleConfirmMaintenance = () => {
    if (pendingSettings) {
      updateMutation.mutate({ platform: pendingSettings })
      setShowMaintenanceConfirm(false)
      setPendingSettings(null)
    }
  }

  const handleReset = () => {
    refetch()
  }

  if (error) {
    return (
      <PageContainer>
        <PageHeader
          title="Settings"
          description="Configure platform-wide settings and preferences."
        />
        <ErrorState
          title="Failed to load settings"
          description="There was an error fetching the settings. Please try again."
          onRetry={() => refetch()}
        />
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <PageHeader
        title="Settings"
        description="Configure platform-wide settings and preferences."
      />

      <div className="space-y-6">
        <div className="flex gap-2 border-b border-border">
          <Button
            variant={activeTab === 'general' ? 'primary' : 'ghost'}
            onClick={() => setActiveTab('general')}
            className="rounded-none border-b-2"
          >
            General
          </Button>
          <Button
            variant={activeTab === 'booking' ? 'primary' : 'ghost'}
            onClick={() => setActiveTab('booking')}
            className="rounded-none border-b-2"
          >
            Booking
          </Button>
          <Button
            variant={activeTab === 'notifications' ? 'primary' : 'ghost'}
            onClick={() => setActiveTab('notifications')}
            className="rounded-none border-b-2"
          >
            Notifications
          </Button>
          <Button
            variant={activeTab === 'platform' ? 'primary' : 'ghost'}
            onClick={() => setActiveTab('platform')}
            className="rounded-none border-b-2"
          >
            Platform
          </Button>
        </div>

        {activeTab === 'general' && (
          <GeneralSettingsComponent
            settings={settings?.general || null}
            isLoading={isLoading}
            onSave={handleSaveGeneral}
            onReset={handleReset}
            isDirty={false}
          />
        )}

        {activeTab === 'booking' && (
          <BookingSettingsComponent
            settings={settings?.booking || null}
            isLoading={isLoading}
            onSave={handleSaveBooking}
            onReset={handleReset}
            isDirty={false}
          />
        )}

        {activeTab === 'notifications' && (
          <NotificationSettingsComponent
            settings={settings?.notifications || null}
            isLoading={isLoading}
            onSave={handleSaveNotifications}
            onReset={handleReset}
            isDirty={false}
          />
        )}

        {activeTab === 'platform' && (
          <PlatformSettingsComponent
            settings={settings?.platform || null}
            isLoading={isLoading}
            onSave={handleSavePlatform}
            onReset={handleReset}
            isDirty={false}
          />
        )}
      </div>

      <ConfirmDialog
        open={showMaintenanceConfirm}
        onOpenChange={setShowMaintenanceConfirm}
        title="Enable Maintenance Mode"
        description="This will put the platform in maintenance mode and prevent users from accessing the platform. Are you sure you want to continue?"
        confirmLabel="Enable Maintenance Mode"
        cancelLabel="Cancel"
        onConfirm={handleConfirmMaintenance}
        isLoading={updateMutation.isPending}
        variant="danger"
      />
    </PageContainer>
  )
}
