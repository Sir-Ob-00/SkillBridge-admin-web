import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import type { BookingSettings } from '@/types/settings.types'

const bookingSettingsSchema = z.object({
  maxBookingDays: z.number().min(1, 'Must be at least 1 day').max(365, 'Cannot exceed 365 days'),
  cancellationWindow: z.number().min(0, 'Cannot be negative').max(168, 'Cannot exceed 168 hours (7 days)'),
  allowInstantBooking: z.boolean(),
  enableBookingNotifications: z.boolean(),
})

interface BookingSettingsProps {
  settings: BookingSettings | null
  isLoading: boolean
  onSave: (data: BookingSettings) => void
  onReset: () => void
  isDirty: boolean
}

export function BookingSettings({ settings, isLoading, onSave, onReset, isDirty }: BookingSettingsProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BookingSettings>({
    resolver: zodResolver(bookingSettingsSchema),
    defaultValues: settings || {
      maxBookingDays: 30,
      cancellationWindow: 24,
      allowInstantBooking: false,
      enableBookingNotifications: true,
    },
  })

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Booking Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSave)} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="maxBookingDays" className="text-sm font-medium">
                Maximum Booking Days
              </label>
              <Input
                id="maxBookingDays"
                type="number"
                {...register('maxBookingDays', { valueAsNumber: true })}
                placeholder="30"
              />
              {errors.maxBookingDays && (
                <p className="text-sm text-danger">{errors.maxBookingDays.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="cancellationWindow" className="text-sm font-medium">
                Cancellation Window (hours)
              </label>
              <Input
                id="cancellationWindow"
                type="number"
                {...register('cancellationWindow', { valueAsNumber: true })}
                placeholder="24"
              />
              {errors.cancellationWindow && (
                <p className="text-sm text-danger">{errors.cancellationWindow.message}</p>
              )}
            </div>

            <div className="space-y-2 flex items-center justify-between p-3 border border-border rounded-lg">
              <div>
                <label htmlFor="allowInstantBooking" className="text-sm font-medium">
                  Allow Instant Booking
                </label>
                <p className="text-xs text-muted-foreground">Allow bookings without prior approval</p>
              </div>
              <input
                id="allowInstantBooking"
                type="checkbox"
                {...register('allowInstantBooking')}
                className="size-4"
              />
            </div>

            <div className="space-y-2 flex items-center justify-between p-3 border border-border rounded-lg">
              <div>
                <label htmlFor="enableBookingNotifications" className="text-sm font-medium">
                  Enable Booking Notifications
                </label>
                <p className="text-xs text-muted-foreground">Send notifications for booking events</p>
              </div>
              <input
                id="enableBookingNotifications"
                type="checkbox"
                {...register('enableBookingNotifications')}
                className="size-4"
              />
            </div>
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
