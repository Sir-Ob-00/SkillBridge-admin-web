export const tokenUtils = {
  isValid(token: string | null | undefined): boolean {
    return typeof token === 'string' && token.trim().length > 0
  },

  getBearerHeader(token: string | null | undefined): string | null {
    if (!this.isValid(token)) return null
    return `Bearer ${token}`
  },
}

export { tokenUtils as token }
