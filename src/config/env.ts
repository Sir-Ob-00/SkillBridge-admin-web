const getEnv = (key: keyof ImportMetaEnv, fallback = ''): string => {
  const value = import.meta.env[key]
  return typeof value === 'string' && value.length > 0 ? value : fallback
}

export const env = {
  apiBaseUrl: getEnv('VITE_API_BASE_URL', 'http://localhost:3000/api'),
  appName: getEnv('VITE_APP_NAME', 'SkillBridge Admin'),
  appVersion: getEnv('VITE_APP_VERSION', '1.0.0'),
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
} as const
