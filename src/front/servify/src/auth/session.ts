export type SessionUser = {
  id: number
  perfilId: number
  perfilNome: string
  /** adm | colaborador | cliente (vem do login) */
  cargo?: string
  nome: string
  email: string
}

export type Session = {
  user: SessionUser
}

const STORAGE_KEY = 'servify.session'

export function getSession(): Session | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as unknown
    if (!parsed || typeof parsed !== 'object') return null
    const user = (parsed as { user?: unknown }).user
    if (!user || typeof user !== 'object') return null
    return parsed as Session
  } catch {
    return null
  }
}

export function setSession(session: Session): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(session))
}

export function clearSession(): void {
  localStorage.removeItem(STORAGE_KEY)
}

export function isAuthenticated(): boolean {
  return Boolean(getSession()?.user?.email)
}

/** Texto curto para exibir o perfil de acesso na UI */
export function formatPerfilAcesso(user: SessionUser): string {
  const c = (user.cargo ?? '').toLowerCase().trim()
  if (c === 'adm') return 'Administrador'
  if (c === 'colaborador') return 'Colaborador'
  if (c === 'cliente') return 'Cliente'
  const nome = user.perfilNome?.trim()
  if (nome) return nome
  return 'Usuário'
}

export function initialsFromNome(nome: string): string {
  const t = nome.trim()
  if (!t) return '?'
  const parts = t.split(/\s+/).filter(Boolean)
  if (parts.length >= 2) {
    const a = parts[0][0]
    const b = parts[parts.length - 1][0]
    if (a && b) return (a + b).toUpperCase()
  }
  return t.slice(0, 2).toUpperCase()
}

