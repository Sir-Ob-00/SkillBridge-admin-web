import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { AlertTriangle } from 'lucide-react'
import type { PlatformSettings } from '@/types/settings.types'

const platformSettingsSchema = z.object({
  maintenanceMode: z.boolean(),
  allowNewRegistrations: z.boolean(),
  showFeaturedArtisans: z.boolean(),
})

interface PlatformSettingsProps {
  settings: PlatformSettings | null
  isLoading: boolean
  onSave: (data: PlatformSettings) => void
  onReset: () => void
  isDirty: boolean
}

export function PlatformSettings({ settings, isLoading, onSave, onReset, isDirty }: PlatformSettingsProps) {
  const {
    register,
    handleSubmit,
    watch,
  } = useForm<PlatformSettings>({
    resolver: zodResolver(platformSettingsSchema),
    defaultValues: settings || {
      maintenanceMode: false,
      allowNewRegistrations: true,
      showFeaturedArtisans: true,
    },
  })

  const maintenanceMode = watch('maintenanceMode')

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Platform Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSave)} className="space-y-4">
          <div className="space-y-2 flex items-center justify-between p-3 border border-border rounded-lg">
            <div>
              <label htmlFor="maintenanceMode" className="text-sm font-medium flex items-center gap-2">
                Maintenance Mode
                {maintenanceMode && <AlertTriangle className="size-4 text-warning" />}
              </label>
              <p className="text-xs text-muted-foreground">Put the platform in maintenance mode</p>
            </div>
            <input
              id="maintenanceMode"
              type="checkbox"
              {...register('maintenanceMode')}
              className="size-4"
            />
          </div>

          <div className="space-y-2 flex items-center justify-between p-3 border border-border rounded-lg">
            <div>
              <label htmlFor="allowNewRegistrations" className="text-sm font-medium">
                Allow New Registrations
              </label>
              <p className="text-xs text-muted-foreground">Allow new users to register</p>
            </div>
            <input
              id="allowNewRegistrations"
              type="checkbox"
              {...register('allowNewRegistrations')}
              className="size-4"
            />
          </div>

          <div className="space-y-2 flex items-center justify-between p-3 border border-border rounded-lg">
            <div>
              <label htmlFor="showFeaturedArtisans" className="text-sm font-medium">
                Show Featured Artisans
              </label>
              <p className="text-xs text-muted-foreground">Display featured artisans on the homepage</p>
            </div>
            <input
              id="showFeaturedArtisans"
              type="checkbox"
              {...register('showFeaturedArtisans')}
              className="size-4"
            />
          </div>

          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={onReset} disabled={!isDirty}>
              Reset
            </Button>
            <Button type="submit" disabled={!isDirty} variant={maintenanceMode ? 'danger' : 'primary'}>
              Save Changes
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
