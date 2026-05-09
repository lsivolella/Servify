export const PERFIS_COLABORADOR = [
  { value: 'adm', label: 'Administrador' },
  { value: 'colaborador', label: 'Colaborador' },
] as const

export function labelPerfilColaborador(value: string): string {
  const p = PERFIS_COLABORADOR.find((x) => x.value === value)
  return p?.label ?? value
}

export function perfilColaboradorFromInitial(cargo: string): string {
  return cargo === 'adm' || cargo === 'colaborador' ? cargo : ''
}
