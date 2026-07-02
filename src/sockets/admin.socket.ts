import { io, Socket } from 'socket.io-client'
import type {
  ArtisanVerifiedPayload,
  ReportSubmittedPayload,
  ReviewFlaggedPayload,
  BookingCancelledPayload,
} from '@/types/notification.types'

type NotificationCallback = (event: string, data: unknown) => void

class AdminSocket {
  private socket: Socket | null = null
  private isConnected = false
  private notificationCallbacks: Set<NotificationCallback> = new Set()

  constructor() {
    this.connect()
  }

  private connect() {
    try {
      const socketUrl = import.meta.env.VITE_SOCKET_URL || window.location.origin
      
      this.socket = io(socketUrl, {
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      })

      this.socket.on('connect', () => {
        this.isConnected = true
        console.log('Socket connected')
        this.joinAdminRoom()
      })

      this.socket.on('disconnect', () => {
        this.isConnected = false
        console.log('Socket disconnected')
      })

      this.socket.on('reconnect', () => {
        this.isConnected = true
        console.log('Socket reconnected')
        this.joinAdminRoom()
      })

      this.socket.on('connect_error', (error: Error) => {
        console.error('Socket connection error:', error)
      })

      // Listen for admin events
      this.setupEventListeners()
    } catch (error) {
      console.error('Failed to initialize socket:', error)
    }
  }

  private joinAdminRoom() {
    if (this.socket && this.isConnected) {
      this.socket.emit('join_admin_room')
      console.log('Joined admin room')
    }
  }

  private setupEventListeners() {
    if (!this.socket) return

    // Artisan Verification
    this.socket.on('artisan_verified', (data: ArtisanVerifiedPayload) => {
      this.notify('artisan_verified', data)
    })

    // Report Submitted
    this.socket.on('report_submitted', (data: ReportSubmittedPayload) => {
      this.notify('report_submitted', data)
    })

    // Review Flagged
    this.socket.on('review_flagged', (data: ReviewFlaggedPayload) => {
      this.notify('review_flagged', data)
    })

    // Booking Cancelled
    this.socket.on('booking_cancelled', (data: BookingCancelledPayload) => {
      this.notify('booking_cancelled', data)
    })
  }

  private notify(event: string, data: unknown) {
    this.notificationCallbacks.forEach((callback) => {
      try {
        callback(event, data)
      } catch (error) {
        console.error('Error in notification callback:', error)
      }
    })
  }

  onNotification(callback: NotificationCallback) {
    this.notificationCallbacks.add(callback)
  }

  offNotification(callback: NotificationCallback) {
    this.notificationCallbacks.delete(callback)
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
      this.isConnected = false
    }
  }

  getConnectionStatus() {
    return this.isConnected
  }
}

// Singleton instance
let adminSocketInstance: AdminSocket | null = null

export function getAdminSocket(): AdminSocket {
  if (!adminSocketInstance) {
    adminSocketInstance = new AdminSocket()
  }
  return adminSocketInstance
}

export function disconnectAdminSocket() {
  if (adminSocketInstance) {
    adminSocketInstance.disconnect()
    adminSocketInstance = null
  }
}
