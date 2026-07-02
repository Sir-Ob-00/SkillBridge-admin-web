const STORAGE_PREFIX = 'skillbridge_admin_'

export const storage = {
  get<T>(key: string, fallback: T): T {
    try {
      const item = localStorage.getItem(`${STORAGE_PREFIX}${key}`)
      if (item === null) return fallback
      return JSON.parse(item) as T
    } catch {
      return fallback
    }
  },

  set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(`${STORAGE_PREFIX}${key}`, JSON.stringify(value))
    } catch {
      // Storage unavailable or quota exceeded
    }
  },

  remove(key: string): void {
    try {
      localStorage.removeItem(`${STORAGE_PREFIX}${key}`)
    } catch {
      // Storage unavailable
    }
  },

  clear(): void {
    try {
      const keys = Object.keys(localStorage)
      keys
        .filter((key) => key.startsWith(STORAGE_PREFIX))
        .forEach((key) => localStorage.removeItem(key))
    } catch {
      // Storage unavailable
    }
  },
}
