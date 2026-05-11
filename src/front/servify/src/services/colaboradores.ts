import { apiGetJson } from './api'

type UsuarioApi = Record<string, unknown>

export type StatusColaborador = 'ativo' | 'pendente'

export type Colaborador = {
  id: string
  nome: string | null
  email: string
  telefone: string
  cpf: string
  cidade: string
  cargo: string
  status: StatusColaborador
  cep: string
  logradouro: string
  numero: string
  complemento: string
  bairro: string
  uf: string
}

function asString(v: unknown): string {
  return typeof v === 'string' ? v : v == null ? '' : String(v)
}

function pickFirstString(obj: UsuarioApi, keys: string[]): string {
  for (const k of keys) {
    const v = obj[k]
    if (typeof v === 'string' && v.trim()) return v
    if (typeof v === 'number' && Number.isFinite(v)) return String(v)
  }
  return ''
}

/** perfil no BD: 1 Administrador, 2 Colaborador, 3 Cliente */
function cargoFromPerfilId(perfilId: unknown): string {
  const n = typeof perfilId === 'number' ? perfilId : Number(perfilId)
  if (n === 1) return 'adm'
  if (n === 2) return 'colaborador'
  return ''
}

function cargoFromApi(obj: UsuarioApi): string {
  const explicit = pickFirstString(obj, ['cargo', 'perfil', 'role', 'tipo'])
  if (explicit) {
    const low = explicit.toLowerCase()
    if (low === 'administrador' || low === 'adm') return 'adm'
    if (low === 'colaborador') return 'colaborador'
    return explicit
  }
  return cargoFromPerfilId(obj.perfilId)
}

export function colaboradorFromApi(raw: unknown): Colaborador | null {
  if (!raw || typeof raw !== 'object') return null
  const obj = raw as UsuarioApi

  const id = pickFirstString(obj, ['id', 'uuid', 'codigo', 'cod', 'userId'])
  const nomeRaw = pickFirstString(obj, ['nome', 'name'])
  const nome = nomeRaw ? nomeRaw : null
  const email = pickFirstString(obj, ['email', 'mail'])
  const telefone = pickFirstString(obj, ['telefone', 'phone', 'celular'])
  const cpf = pickFirstString(obj, ['cpf', 'documento'])

  const cidadeRaw =
    pickFirstString(obj, ['cidade', 'city']) ||
    pickFirstString(obj, ['municipio', 'localidade'])
  const uf = pickFirstString(obj, ['uf', 'estado', 'state']).toUpperCase()
  const cidade =
    cidadeRaw && uf ? `${cidadeRaw} - ${uf}` : cidadeRaw || (uf ? uf : '')

  const endereco =
    typeof obj.endereco === 'object' && obj.endereco
      ? (obj.endereco as UsuarioApi)
      : null

  const cep =
    pickFirstString(obj, ['cep']) || (endereco ? pickFirstString(endereco, ['cep']) : '')
  const logradouro =
    pickFirstString(obj, ['logradouro', 'rua']) ||
    (endereco ? pickFirstString(endereco, ['logradouro', 'rua']) : '')
  const numero =
    pickFirstString(obj, ['numero', 'num']) ||
    (endereco ? pickFirstString(endereco, ['numero', 'num']) : '')
  const complemento =
    pickFirstString(obj, ['complemento']) ||
    (endereco ? pickFirstString(endereco, ['complemento']) : '')
  const bairro =
    pickFirstString(obj, ['bairro']) ||
    (endereco ? pickFirstString(endereco, ['bairro']) : '')

  const cargo = cargoFromApi(obj)
  const status: StatusColaborador =
    nome && nome.trim() ? 'ativo' : 'pendente'

  if (!id && !email) return null

  return {
    id: id || email || nome || crypto.randomUUID(),
    nome,
    email,
    telefone,
    cpf,
    cidade,
    cargo: cargo || 'colaborador',
    status,
    cep,
    logradouro,
    numero: asString(numero),
    complemento,
    bairro,
    uf,
  }
}

export async function getColaboradores(): Promise<Colaborador[]> {
  const data = await apiGetJson<unknown>('/usuarios/colaboradores')

  const arr = Array.isArray(data)
    ? data
    : data && typeof data === 'object' && Array.isArray((data as { data?: unknown }).data)
      ? (data as { data: unknown[] }).data
      : []

  return arr.map(colaboradorFromApi).filter((x): x is Colaborador => Boolean(x))
}
