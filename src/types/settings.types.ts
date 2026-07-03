export interface GeneralSettings {
  platformName: string
  supportEmail: string
  supportPhone: string
  defaultLanguage: string
  timeZone: string
}

export interface BookingSettings {
  maxBookingDays: number
  cancellationWindow: number
  allowInstantBooking: boolean
  enableBookingNotifications: boolean
}

export interface NotificationSettings {
  enableEmailNotifications: boolean
  enablePushNotifications: boolean
  enableInAppNotifications: boolean
}

export interface PlatformSettings {
  maintenanceMode: boolean
  allowNewRegistrations: boolean
  showFeaturedArtisans: boolean
}

export interface SystemSettings {
  general: GeneralSettings
  booking: BookingSettings
  notifications: NotificationSettings
  platform: PlatformSettings
}

export interface UpdateSettingsPayload {
  general?: Partial<GeneralSettings>
  booking?: Partial<BookingSettings>
  notifications?: Partial<NotificationSettings>
  platform?: Partial<PlatformSettings>
}
