import { useCallback, useEffect, useMemo, useState } from 'react'
import AgendamentoFormModal from '../components/AgendamentoFormModal'
import ConfirmarExclusaoAgendamentoModal from '../components/ConfirmarExclusaoAgendamentoModal'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import Add from '@mui/icons-material/Add'
import ArrowBackOutlined from '@mui/icons-material/ArrowBackOutlined'
import CalendarMonthOutlined from '@mui/icons-material/CalendarMonthOutlined'
import ChevronLeft from '@mui/icons-material/ChevronLeft'
import ChevronRight from '@mui/icons-material/ChevronRight'
import Search from '@mui/icons-material/Search'
import { useSidebarLayout } from '../context/SidebarLayoutContext'
import {
  toastCadastroSucesso,
  toastError,
  toastSuccess,
} from '../components/showAlert'
import { mensagemDeErroCapturado } from '../services/api'
import {
  atualizarAgendamento,
  criarAgendamento,
  deleteAgendamentoPorId,
  getAgendamentos,
  type Agendamento,
  type AgendamentoFormPayload,
} from '../services/agendamentos'
import { getClientes, type Cliente } from '../services/clientes'
import { getColaboradores, type Colaborador } from '../services/colaboradores'
import { getServicos, type Servico } from '../services/servicos'

const NAVY = '#1e3a5f'
const BORDER = '#e2e8f0'
const PAGE_BG = '#f8fafc'
const EVENT_BG = '#eff6ff'
const EVENT_BORDER = '#bfdbfe'
const SLOT_HEIGHT = 76
const START_HOUR = 8
const END_HOUR = 18
const horarios = Array.from(
  { length: END_HOUR - START_HOUR + 1 },
  (_, index) => START_HOUR + index,
)
const DIAS_LABEL = ['SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB', 'DOM']

function startOfWeek(date: Date): Date {
  const copy = new Date(date)
  const day = copy.getDay()
  const diff = day === 0 ? -6 : 1 - day
  copy.setDate(copy.getDate() + diff)
  copy.setHours(0, 0, 0, 0)
  return copy
}

function addDays(date: Date, days: number): Date {
  const copy = new Date(date)
  copy.setDate(copy.getDate() + days)
  return copy
}

function toIsoDate(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function formatarDataPeriodo(date: Date): string {
  return date.toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'long',
  })
}

function minutosDesdeInicio(horario: string): number {
  const [hourRaw, minuteRaw] = horario.split(':')
  const hour = Number(hourRaw)
  const minute = Number(minuteRaw)
  if (!Number.isFinite(hour) || !Number.isFinite(minute)) return 0
  return (hour - START_HOUR) * 60 + minute
}

/**
 * Tela principal de agendamentos.
 * Mesma instância é montada ao acessar "/" (redirect) ou "/agendamentos".
 */
export default function AgendamentosPage() {
  const { sidebarExpanded, toggleSidebar } = useSidebarLayout()
  const [busca, setBusca] = useState('')
  const [semanaInicio, setSemanaInicio] = useState(() => startOfWeek(new Date()))
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([])
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [colaboradores, setColaboradores] = useState<Colaborador[]>([])
  const [servicos, setServicos] = useState<Servico[]>([])
  const [loading, setLoading] = useState(true)
  const [formOpen, setFormOpen] = useState(false)
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create')
  const [selected, setSelected] = useState<Agendamento | undefined>()
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [excluindo, setExcluindo] = useState(false)

  const diasDaSemana = useMemo(
    () =>
      DIAS_LABEL.map((label, index) => {
        const data = addDays(semanaInicio, index)
        return { label, data, iso: toIsoDate(data), dia: data.getDate() }
      }),
    [semanaInicio],
  )

  const semanaFim = useMemo(() => addDays(semanaInicio, 6), [semanaInicio])

  const carregarDados = useCallback(async () => {
    setLoading(true)
    try {
      const [agendaData, clientesData, colaboradoresData, servicosData] =
        await Promise.all([
          getAgendamentos({
            inicio: `${toIsoDate(semanaInicio)}T00:00:00`,
            fim: `${toIsoDate(semanaFim)}T23:59:59`,
            status: 'AGENDADO',
          }),
          getClientes(),
          getColaboradores(),
          getServicos(),
        ])

      setAgendamentos(agendaData)
      setClientes(clientesData.filter((cliente) => cliente.ativo))
      setColaboradores(
        colaboradoresData.filter((colaborador) => colaborador.status === 'ativo'),
      )
      setServicos(servicosData.filter((servico) => servico.ativo))
    } catch (e: unknown) {
      toastError(
        mensagemDeErroCapturado(e, 'Não foi possível carregar os agendamentos.'),
      )
    } finally {
      setLoading(false)
    }
  }, [semanaFim, semanaInicio])

  useEffect(() => {
    void carregarDados()
  }, [carregarDados])

  const agendamentosFiltrados = useMemo(() => {
    const q = busca.trim().toLowerCase()
    if (!q) return agendamentos

    return agendamentos.filter((agendamento) =>
      [
        agendamento.servicoNome,
        agendamento.clienteNome,
        agendamento.colaboradorNome,
      ].some((campo) => campo.toLowerCase().includes(q)),
    )
  }, [agendamentos, busca])

  function abrirAdicionar() {
    setFormMode('create')
    setSelected(undefined)
    setFormOpen(true)
  }

  function abrirEditar(agendamento: Agendamento) {
    setFormMode('edit')
    setSelected(agendamento)
    setFormOpen(true)
  }

  function fecharForm() {
    setFormOpen(false)
    setSelected(undefined)
  }

  async function handleSalvar(payload: AgendamentoFormPayload) {
    try {
      if (formMode === 'create') {
        await criarAgendamento(payload)
        toastCadastroSucesso('Agendamento cadastrado com sucesso.')
      } else if (selected) {
        await atualizarAgendamento(selected.id, payload)
        toastCadastroSucesso('Agendamento atualizado com sucesso.')
      }
      await carregarDados()
      fecharForm()
    } catch (e: unknown) {
      throw new Error(
        mensagemDeErroCapturado(e, 'Não foi possível salvar o agendamento.'),
      )
    }
  }

  async function handleConfirmarExclusao() {
    if (!selected) return
    setExcluindo(true)
    try {
      await deleteAgendamentoPorId(selected.id)
      await carregarDados()
      setDeleteOpen(false)
      fecharForm()
      toastSuccess('Agendamento excluído com sucesso.')
    } catch (e: unknown) {
      toastError(
        mensagemDeErroCapturado(e, 'Não foi possível excluir o agendamento.'),
      )
    } finally {
      setExcluindo(false)
    }
  }

  const periodoLabel = `${formatarDataPeriodo(semanaInicio)} - ${formatarDataPeriodo(
    semanaFim,
  )} de ${semanaFim.getFullYear()}`

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: PAGE_BG }}>
      <Box
        sx={{
          bgcolor: '#ffffff',
          borderBottom: `1px solid ${BORDER}`,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <IconButton
          edge="start"
          aria-label={
            sidebarExpanded ? 'Fechar menu lateral' : 'Abrir menu lateral'
          }
          aria-expanded={sidebarExpanded}
          onClick={toggleSidebar}
          sx={{
            color: NAVY,
            alignSelf: 'center',
            ml: { xs: 0.75, sm: 1 },
            borderRadius: 1,
          }}
        >
          <ArrowBackOutlined sx={{ fontSize: 26 }} />
        </IconButton>
        <Container
          maxWidth="lg"
          sx={{
            flex: 1,
            py: 2.5,
            pr: { xs: 2, sm: 3 },
            pl: { xs: 1, sm: 2 },
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 2,
            minWidth: 0,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 0 }}>
            <CalendarMonthOutlined sx={{ fontSize: 28, color: NAVY }} />
            <Typography
              variant="h6"
              component="h1"
              sx={{
                fontWeight: 700,
                color: NAVY,
                fontSize: { xs: '1.1rem', sm: '1.25rem' },
                letterSpacing: '-0.02em',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              Gerenciar Agendamentos
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={abrirAdicionar}
            sx={{
              borderRadius: '10px',
              px: 2.5,
              py: 1,
              fontWeight: 700,
              textTransform: 'none',
              bgcolor: NAVY,
              flexShrink: 0,
              '&:hover': { bgcolor: '#162d4a' },
            }}
          >
            Adicionar
          </Button>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 }, py: 3 }}>
        <TextField
          placeholder="Buscar agendamentos..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          disabled={loading}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ color: '#9ca3af', fontSize: 22 }} />
                </InputAdornment>
              ),
            },
          }}
          sx={{
            width: { xs: '100%', sm: 380 },
            mb: 2,
            '& .MuiOutlinedInput-root': {
              bgcolor: '#ffffff',
              borderRadius: '10px',
              '& fieldset': { borderColor: BORDER },
            },
          }}
        />

        <Box
          sx={{
            bgcolor: '#ffffff',
            border: `1px solid ${BORDER}`,
            borderRadius: '12px',
            boxShadow: '0 1px 2px rgba(15, 23, 42, 0.04)',
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              minHeight: 64,
              px: { xs: 1.5, sm: 2 },
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: `1px solid ${BORDER}`,
            }}
          >
            <IconButton
              aria-label="Semana anterior"
              onClick={() => setSemanaInicio((current) => addDays(current, -7))}
              sx={{ color: NAVY }}
            >
              <ChevronLeft />
            </IconButton>
            <Typography
              sx={{
                fontWeight: 700,
                color: '#0f172a',
                textAlign: 'center',
                fontSize: { xs: '0.875rem', sm: '0.9375rem' },
              }}
            >
              {periodoLabel}
            </Typography>
            <IconButton
              aria-label="Próxima semana"
              onClick={() => setSemanaInicio((current) => addDays(current, 7))}
              sx={{ color: NAVY }}
            >
              <ChevronRight />
            </IconButton>
          </Box>

          <Box sx={{ overflowX: 'auto' }}>
            <Box sx={{ minWidth: 860 }}>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: '72px repeat(7, 1fr)',
                  borderBottom: `1px solid ${BORDER}`,
                  bgcolor: '#f8fafc',
                }}
              >
                <Box sx={{ borderRight: `1px solid ${BORDER}` }} />
                {diasDaSemana.map((dia) => (
                  <Box
                    key={dia.label}
                    sx={{
                      minHeight: 58,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRight: `1px solid ${BORDER}`,
                      '&:last-child': { borderRight: 0 },
                    }}
                  >
                    <Typography
                      sx={{
                        color: '#94a3b8',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        letterSpacing: '0.04em',
                      }}
                    >
                      {dia.label}
                    </Typography>
                    <Typography
                      sx={{
                        color: '#0f172a',
                        fontWeight: 700,
                        fontSize: '0.875rem',
                      }}
                    >
                      {dia.dia}
                    </Typography>
                  </Box>
                ))}
              </Box>

              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: '72px repeat(7, 1fr)',
                  position: 'relative',
                }}
              >
                <Box>
                  {horarios.map((hora) => (
                    <Box
                      key={hora}
                      sx={{
                        height: SLOT_HEIGHT,
                        borderRight: `1px solid ${BORDER}`,
                        borderBottom: `1px solid ${BORDER}`,
                        px: 1.5,
                        py: 1,
                        color: '#64748b',
                        fontSize: '0.8125rem',
                      }}
                    >
                      {hora}:00
                    </Box>
                  ))}
                </Box>

                {diasDaSemana.map((dia) => (
                  <Box
                    key={dia.label}
                    sx={{
                      position: 'relative',
                      borderRight: `1px solid ${BORDER}`,
                      '&:last-child': { borderRight: 0 },
                    }}
                  >
                    {horarios.map((hora) => (
                      <Box
                        key={`${dia.label}-${hora}`}
                        sx={{
                          height: SLOT_HEIGHT,
                          borderBottom: `1px solid ${BORDER}`,
                        }}
                      />
                    ))}

                    {agendamentosFiltrados
                      .filter((agendamento) => agendamento.data === dia.iso)
                      .map((agendamento) => (
                        <Box
                          key={agendamento.id}
                          role="button"
                          tabIndex={0}
                          onClick={() => abrirEditar(agendamento)}
                          onKeyDown={(event) => {
                            if (event.key === 'Enter' || event.key === ' ') {
                              abrirEditar(agendamento)
                            }
                          }}
                          sx={{
                            position: 'absolute',
                            top:
                              (minutosDesdeInicio(agendamento.horarioInicio) / 60) *
                                SLOT_HEIGHT +
                              8,
                            left: 8,
                            right: 8,
                            height: Math.max(
                              42,
                              (agendamento.duracaoMinutos / 60) * SLOT_HEIGHT - 12,
                            ),
                            bgcolor: EVENT_BG,
                            border: `1px solid ${EVENT_BORDER}`,
                            borderRadius: '2px',
                            p: 1,
                            overflow: 'hidden',
                            cursor: 'pointer',
                            '&:hover': {
                              borderColor: '#60a5fa',
                              boxShadow: '0 4px 12px rgba(59, 130, 246, 0.15)',
                            },
                          }}
                        >
                          <Typography
                            sx={{
                              color: NAVY,
                              fontWeight: 700,
                              fontSize: '0.75rem',
                              lineHeight: 1.2,
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                            }}
                            title={agendamento.servicoNome}
                          >
                            {agendamento.servicoNome}
                          </Typography>
                          <Typography
                            sx={{
                              color: '#475569',
                              fontSize: '0.6875rem',
                              lineHeight: 1.25,
                              mt: 0.35,
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                            }}
                            title={agendamento.clienteNome}
                          >
                            {agendamento.clienteNome}
                          </Typography>
                          <Typography
                            sx={{
                              color: '#475569',
                              fontSize: '0.6875rem',
                              lineHeight: 1.25,
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                            }}
                            title={agendamento.colaboradorNome}
                          >
                            Prestador: {agendamento.colaboradorNome}
                          </Typography>
                          <Typography
                            sx={{
                              color: '#475569',
                              fontSize: '0.6875rem',
                              lineHeight: 1.25,
                            }}
                          >
                            {agendamento.horarioInicio}
                          </Typography>
                        </Box>
                      ))}
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        </Box>

        <Typography
          variant="body2"
          sx={{ mt: 2, color: '#94a3b8', fontSize: '0.875rem' }}
        >
          {loading
            ? 'Carregando agendamentos...'
            : `${agendamentosFiltrados.length} agendamento${agendamentosFiltrados.length === 1 ? '' : 's'} encontrado${agendamentosFiltrados.length === 1 ? '' : 's'}`}
        </Typography>
      </Container>

      <AgendamentoFormModal
        open={formOpen}
        mode={formMode}
        initial={selected}
        clientes={clientes}
        colaboradores={colaboradores}
        servicos={servicos}
        onClose={fecharForm}
        onSubmit={handleSalvar}
        onRequestDelete={
          formMode === 'edit' ? () => setDeleteOpen(true) : undefined
        }
      />

      <ConfirmarExclusaoAgendamentoModal
        open={deleteOpen}
        nomeServico={selected?.servicoNome ?? ''}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleConfirmarExclusao}
        excluindo={excluindo}
      />
    </Box>
  )
}
