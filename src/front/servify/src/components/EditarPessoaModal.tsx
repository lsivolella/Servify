import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import Accordion from '@mui/material/Accordion'
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionSummary from '@mui/material/AccordionSummary'
import Alert from '@mui/material/Alert'
import Autocomplete from '@mui/material/Autocomplete'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Dialog from '@mui/material/Dialog'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import MenuItem from '@mui/material/MenuItem'
import Switch from '@mui/material/Switch'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import BadgeOutlined from '@mui/icons-material/BadgeOutlined'
import CloseOutlined from '@mui/icons-material/CloseOutlined'
import EditOutlined from '@mui/icons-material/EditOutlined'
import EmailOutlined from '@mui/icons-material/EmailOutlined'
import ExpandMore from '@mui/icons-material/ExpandMore'
import HomeOutlined from '@mui/icons-material/HomeOutlined'
import LocationOnOutlined from '@mui/icons-material/LocationOnOutlined'
import PersonOutlined from '@mui/icons-material/PersonOutlined'
import PhoneOutlined from '@mui/icons-material/PhoneOutlined'
import SignpostOutlined from '@mui/icons-material/SignpostOutlined'
import WorkOutlineOutlined from '@mui/icons-material/WorkOutlineOutlined'
import type { EditarPessoaValues } from '../types/editarPessoa'
import {
  fetchMunicipiosBrasil,
  filterMunicipios,
  type MunicipioBrasil,
} from '../services/ibgeMunicipios'
import {
  cepDigits,
  fetchAddressByCep,
  formatCepDisplay,
} from '../services/viacep'
import { maskCpf, maskEmailInput, maskPhoneBr } from '../utils/masks'
import {
  labelPerfilColaborador,
  perfilColaboradorFromInitial,
  PERFIS_COLABORADOR,
} from '../utils/perfilColaborador'

const NAVY = '#1e3a5f'
const BORDER = '#e2e8f0'

const UFS_BR = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG',
  'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO',
] as const

type EditarPessoaModalProps = {
  open: boolean
  tipo: 'cliente' | 'colaborador'
  initial: EditarPessoaValues
  onClose: () => void
  onSave: (data: EditarPessoaValues) => void
}

function fieldShellSx() {
  return {
    '& .MuiOutlinedInput-root': {
      borderRadius: '10px',
      '& fieldset': { borderColor: BORDER },
    },
  } as const
}

export default function EditarPessoaModal({
  open,
  tipo,
  initial,
  onClose,
  onSave,
}: EditarPessoaModalProps) {
  const isColaborador = tipo === 'colaborador'
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [telefone, setTelefone] = useState('')
  const [cpf, setCpf] = useState('')
  const [cidadeInput, setCidadeInput] = useState('')
  const [cargo, setCargo] = useState('')
  const [ativo, setAtivo] = useState(true)
  const [cep, setCep] = useState('')
  const [logradouro, setLogradouro] = useState('')
  const [numero, setNumero] = useState('')
  const [complemento, setComplemento] = useState('')
  const [bairro, setBairro] = useState('')
  const [uf, setUf] = useState('')
  const [erroLocal, setErroLocal] = useState<string | null>(null)

  const [municipios, setMunicipios] = useState<MunicipioBrasil[]>([])
  const [munLoading, setMunLoading] = useState(false)
  const [munErro, setMunErro] = useState<string | null>(null)

  const [enderecoExpandido, setEnderecoExpandido] = useState(false)

  const cepLookupAbort = useRef<AbortController | null>(null)

  useEffect(() => {
    if (!open) return
    queueMicrotask(() => {
      setNome(initial.nome)
      setEmail(initial.email)
      setTelefone(initial.telefone)
      setCpf(initial.cpf)
      setCidadeInput(initial.cidade)
      setCargo(perfilColaboradorFromInitial(initial.cargo))
      setAtivo(initial.ativo)
      setCep(initial.cep ?? '')
      setLogradouro(initial.logradouro ?? '')
      setNumero(initial.numero ?? '')
      setComplemento(initial.complemento ?? '')
      setBairro(initial.bairro ?? '')
      setUf(initial.uf ?? '')
      setErroLocal(null)
      const temEndereco =
        Boolean(initial.cep?.trim()) ||
        Boolean(initial.logradouro?.trim()) ||
        Boolean(initial.bairro?.trim())
      setEnderecoExpandido(temEndereco)
    })
  }, [open, initial])

  useEffect(() => {
    if (!open) return
    let cancel = false
    queueMicrotask(() => {
      if (cancel) return
      setMunLoading(true)
      setMunErro(null)
    })
    fetchMunicipiosBrasil()
      .then((list) => {
        if (!cancel) setMunicipios(list)
      })
      .catch(() => {
        if (!cancel) {
          setMunErro('Não foi possível carregar a lista de cidades (IBGE).')
        }
      })
      .finally(() => {
        if (!cancel) {
          queueMicrotask(() => {
            if (!cancel) setMunLoading(false)
          })
        }
      })
    return () => {
      cancel = true
    }
  }, [open])

  const municipiosFiltrados = useMemo(
    () => filterMunicipios(municipios, cidadeInput, 80),
    [municipios, cidadeInput],
  )

  useEffect(() => {
    const d = cepDigits(cep)
    if (d.length !== 8) return

    cepLookupAbort.current?.abort()
    const ac = new AbortController()
    cepLookupAbort.current = ac

    const t = window.setTimeout(() => {
      fetchAddressByCep(d, ac.signal)
        .then((addr) => {
          if (!addr || ac.signal.aborted) return
          setLogradouro(addr.logradouro)
          setBairro(addr.bairro)
          setUf(addr.uf)
          setCidadeInput(`${addr.cidade} - ${addr.uf}`)
        })
        .catch(() => {})
    }, 450)

    return () => {
      window.clearTimeout(t)
      ac.abort()
    }
  }, [cep])

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const nomeTrim = nome.trim()
    const emailTrim = email.trim()
    if (!nomeTrim) {
      setErroLocal('Informe o nome completo.')
      return
    }
    if (!emailTrim || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailTrim)) {
      setErroLocal('Informe um email válido.')
      return
    }
    if (isColaborador && !cargo.trim()) {
      setErroLocal('Selecione um perfil.')
      return
    }
    setErroLocal(null)
    onSave({
      nome: nomeTrim,
      email: emailTrim,
      telefone: telefone.trim(),
      cpf: cpf.trim(),
      cidade: cidadeInput.trim(),
      cargo: isColaborador ? cargo.trim() : '',
      ativo,
      cep: cepDigits(cep),
      logradouro: logradouro.trim(),
      numero: numero.trim(),
      complemento: complemento.trim(),
      bairro: bairro.trim(),
      uf: uf.trim().toUpperCase(),
    })
  }

  const titulo =
    tipo === 'cliente' ? 'Editar Cliente' : 'Editar Colaborador'

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      scroll="body"
      slotProps={{
        backdrop: {
          sx: {
            backdropFilter: 'blur(8px)',
            bgcolor: 'rgba(15, 23, 42, 0.48)',
          },
        },
        paper: {
          sx: {
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow:
              '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0,0,0,0.03)',
          },
        },
      }}
    >
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ bgcolor: '#ffffff' }}
      >
        <Box sx={{ position: 'relative', px: { xs: 2.5, sm: 3 }, pt: 3, pb: 2 }}>
          <IconButton
            aria-label="Fechar"
            onClick={onClose}
            sx={{
              position: 'absolute',
              top: 12,
              right: 12,
              color: '#64748b',
            }}
          >
            <CloseOutlined />
          </IconButton>

          <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start', pr: 4 }}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                bgcolor: '#e0f2fe',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <EditOutlined sx={{ color: NAVY, fontSize: 26 }} />
            </Box>
            <Box sx={{ minWidth: 0, pt: 0.25 }}>
              <Typography
                variant="h6"
                component="h2"
                sx={{
                  fontWeight: 700,
                  color: NAVY,
                  fontSize: '1.125rem',
                  letterSpacing: '-0.02em',
                  lineHeight: 1.3,
                }}
              >
                {titulo}
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: '#64748b', mt: 0.5, fontSize: '0.875rem' }}
              >
                Atualize as informações e o status
              </Typography>
            </Box>
          </Box>
        </Box>

        <Box
          sx={{
            px: { xs: 2.5, sm: 3 },
            pb: 2,
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
            gap: 2.25,
          }}
        >
          <Box>
            <FieldLabel htmlFor="ep-nome">Nome completo</FieldLabel>
            <TextField
              id="ep-nome"
              name="nome"
              fullWidth
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              autoComplete="name"
              placeholder="Nome completo"
              variant="outlined"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonOutlined sx={{ color: '#9ca3af', fontSize: 22 }} />
                    </InputAdornment>
                  ),
                },
              }}
              sx={fieldShellSx()}
            />
          </Box>
          <Box>
            <FieldLabel htmlFor="ep-email">E-mail</FieldLabel>
            <TextField
              id="ep-email"
              name="email"
              fullWidth
              type="email"
              value={email}
              onChange={(e) => setEmail(maskEmailInput(e.target.value))}
              autoComplete="email"
              placeholder="email@exemplo.com"
              variant="outlined"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailOutlined sx={{ color: '#9ca3af', fontSize: 22 }} />
                    </InputAdornment>
                  ),
                },
              }}
              sx={fieldShellSx()}
            />
          </Box>
          <Box>
            <FieldLabel htmlFor="ep-tel">Telefone</FieldLabel>
            <TextField
              id="ep-tel"
              name="telefone"
              fullWidth
              value={telefone}
              onChange={(e) => setTelefone(maskPhoneBr(e.target.value))}
              placeholder="(00) 00000-0000"
              variant="outlined"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <PhoneOutlined sx={{ color: '#9ca3af', fontSize: 22 }} />
                    </InputAdornment>
                  ),
                },
              }}
              sx={fieldShellSx()}
            />
          </Box>
          <Box>
            <FieldLabel htmlFor="ep-cpf">CPF</FieldLabel>
            <TextField
              id="ep-cpf"
              name="cpf"
              fullWidth
              value={cpf}
              onChange={(e) => setCpf(maskCpf(e.target.value))}
              placeholder="000.000.000-00"
              variant="outlined"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <BadgeOutlined sx={{ color: '#9ca3af', fontSize: 22 }} />
                    </InputAdornment>
                  ),
                },
              }}
              sx={fieldShellSx()}
            />
          </Box>
          <Box sx={{ gridColumn: { xs: 'span 1', sm: 'span 1' } }}>
            <FieldLabel htmlFor="ep-cidade-autocomplete">Cidade</FieldLabel>
            <Autocomplete
              id="ep-cidade-autocomplete"
              freeSolo
              options={municipiosFiltrados}
              loading={munLoading}
              getOptionLabel={(o) =>
                typeof o === 'string' ? o : o.label
              }
              filterOptions={(x) => x}
              inputValue={cidadeInput}
              onInputChange={(_, v, reason) => {
                if (reason === 'input' || reason === 'clear') {
                  setCidadeInput(v)
                }
              }}
              onChange={(_, v) => {
                if (v && typeof v === 'object') {
                  setCidadeInput(v.label)
                  setUf(v.uf)
                }
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  name="cidade"
                  placeholder={
                    munLoading
                      ? 'Carregando cidades…'
                      : 'Busque cidade em todo o Brasil'
                  }
                  variant="outlined"
                  slotProps={{
                    ...params.slotProps,
                    input: {
                      ...params.slotProps.input,
                      startAdornment: (
                        <>
                          <InputAdornment position="start">
                            <LocationOnOutlined sx={{ color: '#9ca3af', fontSize: 22 }} />
                          </InputAdornment>
                          {params.slotProps.input.startAdornment}
                        </>
                      ),
                      endAdornment: (
                        <>
                          {munLoading ? (
                            <CircularProgress
                              color="inherit"
                              size={20}
                              sx={{ mr: 1 }}
                            />
                          ) : null}
                          {params.slotProps.input.endAdornment}
                        </>
                      ),
                    },
                  }}
                  sx={fieldShellSx()}
                />
              )}
            />
            {munErro ? (
              <Typography variant="caption" sx={{ color: '#b45309', mt: 0.5, display: 'block' }}>
                {munErro} Você ainda pode digitar a cidade manualmente.
              </Typography>
            ) : null}
          </Box>
          {isColaborador ? (
            <Box>
              <FieldLabel htmlFor="ep-perfil">Perfil</FieldLabel>
              <TextField
                id="ep-perfil"
                name="cargo"
                select
                fullWidth
                value={cargo}
                onChange={(e) => setCargo(e.target.value)}
                variant="outlined"
                slotProps={{
                  select: {
                    displayEmpty: true,
                    renderValue: (v: unknown) =>
                      v === '' || v == null ? (
                        <Typography component="span" sx={{ color: '#9ca3af' }}>
                          Selecione o perfil
                        </Typography>
                      ) : (
                        labelPerfilColaborador(String(v))
                      ),
                  },
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <WorkOutlineOutlined sx={{ color: '#9ca3af', fontSize: 22 }} />
                      </InputAdornment>
                    ),
                  },
                }}
                sx={fieldShellSx()}
              >
                <MenuItem value="" disabled sx={{ color: '#9ca3af' }}>
                  Selecione o perfil
                </MenuItem>
                {PERFIS_COLABORADOR.map((p) => (
                  <MenuItem key={p.value} value={p.value}>
                    {p.label}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
          ) : null}

          <Box sx={{ gridColumn: '1 / -1' }}>
            <Accordion
              expanded={enderecoExpandido}
              onChange={(_, exp) => setEnderecoExpandido(exp)}
              elevation={0}
              sx={{
                border: `1px solid ${BORDER}`,
                borderRadius: '12px !important',
                '&:before': { display: 'none' },
                overflow: 'hidden',
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMore sx={{ color: NAVY }} />}
                sx={{
                  px: 2,
                  py: 1,
                  '& .MuiAccordionSummary-content': { my: 1 },
                }}
              >
                <Box>
                  <Typography sx={{ fontWeight: 700, color: '#334155' }}>
                    Mais opções de endereço
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#64748b' }}>
                    CEP, logradouro, número e bairro (preenchimento automático por CEP)
                  </Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails sx={{ px: 2, pb: 2.5, pt: 0 }}>
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                    gap: 2,
                  }}
                >
                  <Box>
                    <FieldLabel htmlFor="ep-cep">CEP</FieldLabel>
                    <TextField
                      id="ep-cep"
                      name="cep"
                      fullWidth
                      value={formatCepDisplay(cepDigits(cep))}
                      onChange={(e) =>
                        setCep(cepDigits(e.target.value))
                      }
                      placeholder="00000-000"
                      variant="outlined"
                      slotProps={{
                        input: {
                          startAdornment: (
                            <InputAdornment position="start">
                              <SignpostOutlined sx={{ color: '#9ca3af', fontSize: 22 }} />
                            </InputAdornment>
                          ),
                        },
                      }}
                      sx={fieldShellSx()}
                    />
                  </Box>
                  <Box>
                    <FieldLabel htmlFor="ep-uf">UF</FieldLabel>
                    <TextField
                      id="ep-uf"
                      name="uf"
                      select
                      fullWidth
                      value={uf || ''}
                      onChange={(e) => setUf(e.target.value)}
                      variant="outlined"
                      slotProps={{
                        input: {
                          startAdornment: (
                            <InputAdornment position="start">
                              <LocationOnOutlined sx={{ color: '#9ca3af', fontSize: 22 }} />
                            </InputAdornment>
                          ),
                        },
                      }}
                      sx={fieldShellSx()}
                    >
                      <MenuItem value="">
                        <em>Selecione</em>
                      </MenuItem>
                      {UFS_BR.map((u) => (
                        <MenuItem key={u} value={u}>
                          {u}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Box>
                  <Box sx={{ gridColumn: { xs: 'span 1', sm: '1 / -1' } }}>
                    <FieldLabel htmlFor="ep-logra">Logradouro</FieldLabel>
                    <TextField
                      id="ep-logra"
                      name="logradouro"
                      fullWidth
                      value={logradouro}
                      onChange={(e) => setLogradouro(e.target.value)}
                      placeholder="Rua, avenida…"
                      variant="outlined"
                      slotProps={{
                        input: {
                          startAdornment: (
                            <InputAdornment position="start">
                              <HomeOutlined sx={{ color: '#9ca3af', fontSize: 22 }} />
                            </InputAdornment>
                          ),
                        },
                      }}
                      sx={fieldShellSx()}
                    />
                  </Box>
                  <Box>
                    <FieldLabel htmlFor="ep-num">Número</FieldLabel>
                    <TextField
                      id="ep-num"
                      name="numero"
                      fullWidth
                      value={numero}
                      onChange={(e) => setNumero(e.target.value)}
                      placeholder="Nº"
                      variant="outlined"
                      sx={fieldShellSx()}
                    />
                  </Box>
                  <Box>
                    <FieldLabel htmlFor="ep-comp">Complemento</FieldLabel>
                    <TextField
                      id="ep-comp"
                      name="complemento"
                      fullWidth
                      value={complemento}
                      onChange={(e) => setComplemento(e.target.value)}
                      placeholder="Apto, bloco…"
                      variant="outlined"
                      sx={fieldShellSx()}
                    />
                  </Box>
                  <Box sx={{ gridColumn: { xs: 'span 1', sm: '1 / -1' } }}>
                    <FieldLabel htmlFor="ep-bairro">Bairro</FieldLabel>
                    <TextField
                      id="ep-bairro"
                      name="bairro"
                      fullWidth
                      value={bairro}
                      onChange={(e) => setBairro(e.target.value)}
                      placeholder="Bairro"
                      variant="outlined"
                      sx={fieldShellSx()}
                    />
                  </Box>
                </Box>
              </AccordionDetails>
            </Accordion>
          </Box>
        </Box>

        <Box sx={{ px: { xs: 2.5, sm: 3 }, pb: 2.5 }}>
          <Box
            sx={{
              border: `1px solid ${BORDER}`,
              borderRadius: '12px',
              px: 2,
              py: 1.75,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 2,
              flexWrap: 'wrap',
            }}
          >
            <Box sx={{ minWidth: 0 }}>
              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: '0.9375rem',
                  color: '#334155',
                }}
              >
                Status do cadastro
              </Typography>
              <Typography variant="body2" sx={{ color: '#64748b', mt: 0.35 }}>
                {ativo
                  ? 'Ativo — pode acessar o sistema.'
                  : 'Inativo — sem acesso ao sistema.'}
              </Typography>
            </Box>
            <Switch
              checked={ativo}
              onChange={(_, v) => setAtivo(v)}
              color="primary"
              slotProps={{ input: { 'aria-label': 'Status ativo' } }}
              sx={{
                '& .MuiSwitch-switchBase.Mui-checked': {
                  color: NAVY,
                },
                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                  bgcolor: `${NAVY} !important`,
                  opacity: 1,
                },
              }}
            />
          </Box>
        </Box>

        <Box
          sx={{
            px: { xs: 2.5, sm: 3 },
            pb: 3,
            pt: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: 1.5,
          }}
        >
          {erroLocal ? (
            <Alert severity="error" onClose={() => setErroLocal(null)}>
              {erroLocal}
            </Alert>
          ) : null}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 2,
              flexWrap: 'wrap',
            }}
          >
            <Button
              type="button"
              variant="outlined"
              onClick={onClose}
              sx={{
                borderRadius: '10px',
                px: 2.5,
                py: 1,
                fontWeight: 600,
                textTransform: 'none',
                color: '#475569',
                borderColor: BORDER,
                '&:hover': { borderColor: '#cbd5e1' },
              }}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="contained"
              sx={{
                borderRadius: '10px',
                px: 2.5,
                py: 1,
                fontWeight: 700,
                textTransform: 'none',
                bgcolor: NAVY,
                '&:hover': { bgcolor: '#162d4a' },
              }}
            >
              Salvar alterações
            </Button>
          </Box>
        </Box>
      </Box>
    </Dialog>
  )
}

function FieldLabel({
  htmlFor,
  children,
}: {
  htmlFor: string
  children: string
}) {
  return (
    <Typography
      component="label"
      htmlFor={htmlFor}
      sx={{
        display: 'block',
        fontSize: '0.875rem',
        fontWeight: 600,
        color: '#475569',
        mb: 0.75,
      }}
    >
      {children}
    </Typography>
  )
}
