/** URL pública do front em produção (Render). */
export const PRODUCTION_FRONTEND_URL =
  'https://plf-es-2026-1-ti2-1381100-grupo3-servify.onrender.com'

/** URL pública da API em produção (Render). */
export const PRODUCTION_API_URL = 'https://backend-shbt.onrender.com'

export function getFrontendBaseUrl(): string {
  const fromEnv = import.meta.env.VITE_APP_BASE_URL
  if (fromEnv !== undefined && String(fromEnv).trim()) {
    return String(fromEnv).trim().replace(/\/+$/, '')
  }
  if (import.meta.env.DEV) {
    return 'http://localhost:5173'
  }
  return PRODUCTION_FRONTEND_URL
}

export function getGoogleOAuthCallbackUrl(): string {
  return `${getFrontendBaseUrl()}/oauth/google/callback`
}
