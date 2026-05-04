/** CPF: 000.000.000-00 */
export function maskCpf(value: string): string {
  const d = value.replace(/\D/g, '').slice(0, 11)
  if (!d.length) return ''
  if (d.length <= 3) return d
  if (d.length <= 6) return `${d.slice(0, 3)}.${d.slice(3)}`
  if (d.length <= 9) {
    return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6)}`
  }
  return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`
}

/**
 * Telefone BR: (00) 0000-0000 ou (00) 00000-0000
 * 9 na primeira posição após DDD = celular (9 dígitos).
 */
export function maskPhoneBr(value: string): string {
  const d = value.replace(/\D/g, '').slice(0, 11)
  if (!d.length) return ''
  if (d.length <= 2) return `(${d}`
  const ddd = d.slice(0, 2)
  const rest = d.slice(2)
  if (!rest.length) return `(${ddd}) `
  const mobile = rest[0] === '9'

  if (mobile) {
    if (rest.length <= 5) return `(${ddd}) ${rest}`
    return `(${ddd}) ${rest.slice(0, 5)}-${rest.slice(5, 9)}`
  }
  if (rest.length <= 4) return `(${ddd}) ${rest}`
  return `(${ddd}) ${rest.slice(0, 4)}-${rest.slice(4, 8)}`
}

/**
 * E-mail: remove espaços e caracteres inválidos para digitação comum.
 * (Permite letras acentuadas no domínio via Unicode.)
 */
export function maskEmailInput(value: string): string {
  const noSpaces = value.replace(/\s/g, '')
  return noSpaces.replace(
    /[^\p{L}\p{N}@._+\-%]/gu,
    '',
  )
}
