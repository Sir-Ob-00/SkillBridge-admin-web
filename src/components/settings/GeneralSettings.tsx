import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import type { GeneralSettings } from '@/types/settings.types'

const generalSettingsSchema = z.object({
  platformName: z.string().min(1, 'Platform name is required'),
  supportEmail: z.string().email('Invalid email address'),
  supportPhone: z.string().min(1, 'Support phone is required'),
  defaultLanguage: z.string().min(1, 'Default language is required'),
  timeZone: z.string().min(1, 'Time zone is required'),
})

interface GeneralSettingsProps {
  settings: GeneralSettings | null
  isLoading: boolean
  onSave: (data: GeneralSettings) => void
  onReset: () => void
  isDirty: boolean
}

export function GeneralSettings({ settings, isLoading, onSave, onReset, isDirty }: GeneralSettingsProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<GeneralSettings>({
    resolver: zodResolver(generalSettingsSchema),
    defaultValues: settings || {
      platformName: '',
      supportEmail: '',
      supportPhone: '',
      defaultLanguage: '',
      timeZone: '',
    },
  })

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>General Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSave)} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="platformName" className="text-sm font-medium">
                Platform Name
              </label>
              <Input
                id="platformName"
                {...register('platformName')}
                placeholder="SkillBridge"
              />
              {errors.platformName && (
                <p className="text-sm text-danger">{errors.platformName.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="defaultLanguage" className="text-sm font-medium">
                Default Language
              </label>
              <Input
                id="defaultLanguage"
                {...register('defaultLanguage')}
                placeholder="en-US"
              />
              {errors.defaultLanguage && (
                <p className="text-sm text-danger">{errors.defaultLanguage.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="supportEmail" className="text-sm font-medium">
                Support Email
              </label>
              <Input
                id="supportEmail"
                type="email"
                {...register('supportEmail')}
                placeholder="support@skillbridge.com"
              />
              {errors.supportEmail && (
                <p className="text-sm text-danger">{errors.supportEmail.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="supportPhone" className="text-sm font-medium">
                Support Phone
              </label>
              <Input
                id="supportPhone"
                {...register('supportPhone')}
                placeholder="+1 (555) 123-4567"
              />
              {errors.supportPhone && (
                <p className="text-sm text-danger">{errors.supportPhone.message}</p>
              )}
            </div>

            <div className="space-y-2 md:col-span-2">
              <label htmlFor="timeZone" className="text-sm font-medium">
                Time Zone
              </label>
              <Input
                id="timeZone"
                {...register('timeZone')}
                placeholder="UTC"
              />
              {errors.timeZone && (
                <p className="text-sm text-danger">{errors.timeZone.message}</p>
              )}
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
