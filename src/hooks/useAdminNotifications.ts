import { useEffect, useCallback } from 'react'
import { getAdminSocket } from '@/sockets/admin.socket'
import { mapEventToNotification, mapEventToActivityItem } from '@/modules/notifications/adminNotifications'
import { useNotificationStore } from '@/stores/notificationStore'
import toast from 'react-hot-toast'

export function useAdminNotifications() {
  const { addActivity } = useNotificationStore()

  const handleSocketEvent = useCallback((event: string, data: unknown) => {
    // Map to notification for toast
    const notification = mapEventToNotification(event, data)
    if (notification) {
      const toastOptions = {
        duration: notification.severity === 'critical' ? 8000 : 4000,
        style: notification.severity === 'critical' ? {
          background: '#ef4444',
          color: '#ffffff',
        } : undefined,
      }
      
      toast(notification.message, {
        ...toastOptions,
        icon: notification.severity === 'critical' ? '⚠️' : '🔔',
      })
    }

    // Map to activity item for feed
    const activityItem = mapEventToActivityItem(event, data)
    if (activityItem) {
      addActivity(activityItem)
    }
  }, [addActivity])

  useEffect(() => {
    const socket = getAdminSocket()
    socket.onNotification(handleSocketEvent)

    return () => {
      socket.offNotification(handleSocketEvent)
    }
  }, [handleSocketEvent])

  return null
}
