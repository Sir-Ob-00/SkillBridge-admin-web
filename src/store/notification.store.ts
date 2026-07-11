import { create } from 'zustand'
import type { AdminActivityItem } from '@/types/notification.types'

interface NotificationStore {
  activities: AdminActivityItem[]
  unreadCount: number
  addActivity: (activity: AdminActivityItem) => void
  clearActivities: () => void
  markAsRead: () => void
}

export const useNotificationStore = create<NotificationStore>((set) => ({
  activities: [],
  unreadCount: 0,
  
  addActivity: (activity) => {
    set((state) => ({
      activities: [activity, ...state.activities].slice(0, 50),
      unreadCount: state.unreadCount + 1,
    }))
  },
  
  clearActivities: () => {
    set({ activities: [], unreadCount: 0 })
  },
  
  markAsRead: () => {
    set({ unreadCount: 0 })
  },
}))
