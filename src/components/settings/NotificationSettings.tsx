import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import type { NotificationSettings } from '@/types/settings.types'

const notificationSettingsSchema = z.object({
  enableEmailNotifications: z.boolean(),
  enablePushNotifications: z.boolean(),
  enableInAppNotifications: z.boolean(),
})

interface NotificationSettingsProps {
  settings: NotificationSettings | null
  isLoading: boolean
  onSave: (data: NotificationSettings) => void
  onReset: () => void
  isDirty: boolean
}

export function NotificationSettings({ settings, isLoading, onSave, onReset, isDirty }: NotificationSettingsProps) {
  const {
    register,
    handleSubmit,
  } = useForm<NotificationSettings>({
    resolver: zodResolver(notificationSettingsSchema),
    defaultValues: settings || {
      enableEmailNotifications: true,
      enablePushNotifications: true,
      enableInAppNotifications: true,
    },
  })

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
        <CardTitle>Notification Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSave)} className="space-y-4">
          <div className="space-y-2 flex items-center justify-between p-3 border border-border rounded-lg">
            <div>
              <label htmlFor="enableEmailNotifications" className="text-sm font-medium">
                Enable Email Notifications
              </label>
              <p className="text-xs text-muted-foreground">Send notifications via email</p>
            </div>
            <input
              id="enableEmailNotifications"
              type="checkbox"
              {...register('enableEmailNotifications')}
              className="size-4"
            />
          </div>

          <div className="space-y-2 flex items-center justify-between p-3 border border-border rounded-lg">
            <div>
              <label htmlFor="enablePushNotifications" className="text-sm font-medium">
                Enable Push Notifications
              </label>
              <p className="text-xs text-muted-foreground">Send push notifications to devices</p>
            </div>
            <input
              id="enablePushNotifications"
              type="checkbox"
              {...register('enablePushNotifications')}
              className="size-4"
            />
          </div>

          <div className="space-y-2 flex items-center justify-between p-3 border border-border rounded-lg">
            <div>
              <label htmlFor="enableInAppNotifications" className="text-sm font-medium">
                Enable In-App Notifications
              </label>
              <p className="text-xs text-muted-foreground">Show notifications within the app</p>
            </div>
            <input
              id="enableInAppNotifications"
              type="checkbox"
              {...register('enableInAppNotifications')}
              className="size-4"
            />
          </div>

          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={onReset} disabled={!isDirty}>
              Reset
            </Button>
            <Button type="submit" disabled={!isDirty}>
              Save Changes
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
