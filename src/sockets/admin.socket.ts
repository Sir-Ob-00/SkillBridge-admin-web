import { io, Socket } from 'socket.io-client'
import type {
  ArtisanVerifiedPayload,
  ReportSubmittedPayload,
  ReviewFlaggedPayload,
  BookingCancelledPayload,
} from '@/types/notification.types'
import { useAuthStore } from '@/store/auth.store'
import { tokenUtils } from '@/utils/token'
import { env } from '@/config/env'
import { ROLES, type Role } from '@/constants/roles'

type NotificationCallback = (event: string, data: unknown) => void

const ADMIN_ROLES: Role[] = [ROLES.ADMIN, ROLES.SUPER_ADMIN]

class AdminSocket {
  private socket: Socket | null = null
  private isConnected = false
  private notificationCallbacks: Set<NotificationCallback> = new Set()
  private unsubscribeAuth: (() => void) | null = null

  constructor() {
    this.init()
  }

  /**
   * Decide whether we can/should connect right now:
   * - we need a valid admin access token (otherwise skip / wait)
   * - only admin / super_admin roles are allowed to connect
   * If conditions aren't met yet we subscribe to the auth store so we can
   * connect once a valid token becomes available (e.g. after login).
   */
  private init() {
    const accessToken = this.getAccessToken()

    if (!accessToken) {
      if (env.isDev) {
        console.log('[SOCKET] No admin access token available; deferring connection until authenticated')
      }
      this.subscribeToAuth()
      return
    }

    if (!this.hasAdminRole()) {
      if (env.isDev) {
        console.log('[SOCKET] Current user is not an admin/super_admin; socket connection skipped')
      }
      this.subscribeToAuth()
      return
    }

    this.connect()
  }

  private getAccessToken(): string | null {
    const { accessToken } = useAuthStore.getState()
    return tokenUtils.isValid(accessToken) ? accessToken : null
  }

  private hasAdminRole(): boolean {
    const { roles } = useAuthStore.getState()
    return roles.some((role) => ADMIN_ROLES.includes(role))
  }

  /**
   * React to auth state changes:
   * - connect once a token appears and the user has an admin role (post-login)
   * - disconnect/clean up once the token disappears (logout)
   */
  private subscribeToAuth() {
    if (this.unsubscribeAuth) return
    this.unsubscribeAuth = useAuthStore.subscribe((state, prevState) => {
      const hadToken = tokenUtils.isValid(prevState.accessToken)
      const hasToken = tokenUtils.isValid(state.accessToken)

      if (!hadToken && hasToken && !this.socket && this.hasAdminRole()) {
        if (env.isDev) {
          console.log('[SOCKET] Access token available after login; connecting admin socket')
        }
        this.connect()
      } else if (hadToken && !hasToken && this.socket) {
        if (env.isDev) {
          console.log('[SOCKET] Access token removed (logout); disconnecting admin socket')
        }
        this.disconnect()
      }
    })
  }

  private connect() {
    try {
      const accessToken = this.getAccessToken()
      if (!accessToken) {
        if (env.isDev) {
          console.warn('[SOCKET] Refusing to connect: access token is undefined/null')
        }
        return
      }

      this.socket = io(env.socketUrl, {
        path: env.socketPath,
        transports: ['polling', 'websocket'],
        auth: {
          token: accessToken,
        },
        reconnection: true,
        timeout: 20000,
      })

      this.socket.on('connect', () => {
        this.isConnected = true
        if (env.isDev) {
          console.log('[SOCKET] Socket connected:', this.socket?.id)
        }
        this.joinAdminRoom()
      })

      this.socket.on('disconnect', (reason: Socket.DisconnectReason) => {
        this.isConnected = false
        if (env.isDev) {
          console.log('[SOCKET] Socket disconnected:', reason)
        }
      })

      this.socket.on('reconnect', () => {
        this.isConnected = true
        if (env.isDev) {
          console.log('[SOCKET] Socket reconnected:', this.socket?.id)
        }
        this.joinAdminRoom()
      })

      this.socket.on('connect_error', (error: Error) => {
        if (env.isDev) {
          console.error('[SOCKET] connect_error:', error.message)
        }
      })

      // Listen for admin events
      this.setupEventListeners()
    } catch (error) {
      if (env.isDev) {
        console.error('[SOCKET] Failed to initialize socket:', error)
      }
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
    if (this.unsubscribeAuth) {
      this.unsubscribeAuth()
      this.unsubscribeAuth = null
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
