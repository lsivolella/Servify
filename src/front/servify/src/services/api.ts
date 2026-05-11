export type ApiError = Error & { status?: number }

/**
 * URL base da API.
 * - Produção: use `VITE_API_BASE_URL` (ex.: mesma origem ou CDN da API).
 * - Desenvolvimento: se não houver env, usa `http://localhost:8080` para o
 *   navegador chamar a API diretamente (aparece como :8080 no DevTools).
 *   O backend precisa liberar CORS para `http://localhost:5173` (ou a porta do Vite).
 * - Para forçar proxy do Vite (URL relativa, aparece :5173 no DevTools), crie
 *   `.env.development` com `VITE_API_BASE_URL=` (vazio).
 */
function resolveApiBaseUrl(): string {
  const raw = import.meta.env.VITE_API_BASE_URL
  if (raw !== undefined) {
    return String(raw).trim().replace(/\/+$/, '')
  }
  if (import.meta.env.DEV) {
    return 'http://localhost:8080'
  }
  return ''
}

const API_BASE_URL = resolveApiBaseUrl()

function joinUrl(base: string, path: string): string {
  if (!base) return path.startsWith('/') ? path : `/${path}`
  if (!path) return base
  return `${base.replace(/\/+$/, '')}/${path.replace(/^\/+/, '')}`
}

async function parseErrorMessage(res: Response): Promise<string> {
  try {
    const contentType = res.headers.get('content-type') ?? ''
    if (contentType.includes('application/json')) {
      const data = (await res.json()) as unknown
      if (data && typeof data === 'object') {
        const msg =
          (data as { message?: unknown; error?: unknown }).message ??
          (data as { message?: unknown; error?: unknown }).error
        if (typeof msg === 'string' && msg.trim()) return msg
      }
    } else {
      const text = await res.text()
      if (text?.trim()) return text.trim()
    }
  } catch {
    // ignora
  }
  return `Falha na requisição (HTTP ${res.status}).`
}

export async function apiGetJson<T>(
  path: string,
  init?: Omit<RequestInit, 'method'>,
): Promise<T> {
  const url = joinUrl(API_BASE_URL, path)
  const res = await fetch(url, {
    ...init,
    method: 'GET',
    headers: {
      Accept: 'application/json',
      ...(init?.headers ?? {}),
    },
  })

  if (!res.ok) {
    const err = new Error(await parseErrorMessage(res)) as ApiError
    err.status = res.status
    throw err
  }

  return (await res.json()) as T
}

export async function apiPostJson<T>(
  path: string,
  body: unknown,
  init?: Omit<RequestInit, 'method' | 'body'>,
): Promise<T> {
  const url = joinUrl(API_BASE_URL, path)
  const res = await fetch(url, {
    ...init,
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const err = new Error(await parseErrorMessage(res)) as ApiError
    err.status = res.status
    throw err
  }

  return (await res.json()) as T
}

