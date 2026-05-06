import { useMemo, useState } from 'react'
import ColaboradorFormModal from '../components/ColaboradorFormModal'
import EditarPessoaModal from '../components/EditarPessoaModal'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import Add from '@mui/icons-material/Add'
import ViewSidebarOutlined from '@mui/icons-material/ViewSidebarOutlined'
import DeleteOutlineOutlined from '@mui/icons-material/DeleteOutlineOutlined'
import EditOutlined from '@mui/icons-material/EditOutlined'
import GroupsOutlined from '@mui/icons-material/GroupsOutlined'
import Search from '@mui/icons-material/Search'
import { useSidebarLayout } from '../context/SidebarLayoutContext'
import {
  confirmDeleteRecord,
  toastCadastroSucesso,
  toastSuccess,
} from '../components/showAlert'
import type { EditarPessoaValues } from '../types/editarPessoa'

const NAVY = '#1e3a5f'
const BORDER = '#e2e8f0'
const PAGE_BG = '#f8fafc'

type StatusColaborador = 'ativo' | 'pendente'

type Colaborador = {
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

const CARGOS_DISPONIVEIS = [
  'Cabeleireiro(a)',
  'Manicure',
  'Atendente',
  'Gerente',
  'Recepcionista',
] as const

const COLABORADORES_MOCK: Colaborador[] = [
  {
    id: '1',
    nome: 'Carlos Silva',
    email: 'carlos@empresa.com',
    telefone: '(11) 98765-4321',
    cpf: '123.456.789-09',
    cidade: 'São Paulo - SP',
    cargo: 'Cabeleireiro(a)',
    status: 'ativo',
    cep: '01310100',
    logradouro: 'Av. Paulista',
    numero: '1000',
    complemento: '',
    bairro: 'Bela Vista',
    uf: 'SP',
  },
  {
    id: '2',
    nome: 'Ana Oliveira',
    email: 'ana@empresa.com',
    telefone: '(31) 98765-4321',
    cpf: '123.456.789-09',
    cidade: 'Belo Horizonte - MG',
    cargo: 'Manicure',
    status: 'pendente',
    cep: '30860330',
    logradouro: 'Rua Caitité',
    numero: '1001',
    complemento: 'Apto 101',
    bairro: 'Gloria',
    uf: 'SP',
  },
  {
    id: '3',
    nome: 'Patricia Oliveira',
    email: 'patricia@empresa.com',
    telefone: '(21) 97777-1111',
    cpf: '987.654.321-00',
    cidade: 'Belo Horizonte - MG',
    cargo: 'Atendente',
    status: 'pendente',
    cep: '30860330',
    logradouro: 'Rua Caitité',
    numero: '1001',
    complemento: '',
    bairro: 'Gloria',
    uf: 'MG',
  },
  {
    id: '4',
    nome: 'Ricardo Mendes',
    email: 'ricardo@empresa.com',
    telefone: '(31) 99999-8888',
    cpf: '456.789.123-45',
    cidade: 'Belo Horizonte - MG',
    cargo: 'Gerente',
    status: 'ativo',
    cep: '',
    logradouro: '',
    numero: '',
    complemento: '',
    bairro: '',
    uf: 'MG',
  },
]

function rowToEditValues(row: Colaborador): EditarPessoaValues {
  return {
    nome: row.nome ?? '',
    email: row.email,
    telefone: row.telefone,
    cpf: row.cpf,
    cidade: row.cidade,
    cargo: row.cargo,
    ativo: row.status === 'ativo',
    cep: row.cep,
    logradouro: row.logradouro,
    numero: row.numero,
    complemento: row.complemento,
    bairro: row.bairro,
    uf: row.uf,
  }
}

function StatusBadge({ status }: { status: StatusColaborador }) {
  const isAtivo = status === 'ativo'
  return (
    <Typography
      component="span"
      sx={{
        display: 'inline-block',
        px: 1.5,
        py: 0.5,
        borderRadius: '999px',
        fontSize: '0.8125rem',
        fontWeight: 600,
        bgcolor: isAtivo ? '#dcfce7' : '#fef3c7',
        color: isAtivo ? '#166534' : '#92400e',
      }}
    >
      {isAtivo ? 'Ativo' : 'Pendente'}
    </Typography>
  )
}

export default function GerenciarColaboradorPage() {
  const { sidebarExpanded, toggleSidebar } = useSidebarLayout()
  const [busca, setBusca] = useState('')
  const [colaboradores, setColaboradores] =
    useState<Colaborador[]>(COLABORADORES_MOCK)

  const [conviteOpen, setConviteOpen] = useState(false)
  const [formEmail, setFormEmail] = useState('')
  const [formCargo, setFormCargo] = useState('')

  const [editOpen, setEditOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editInitial, setEditInitial] = useState<EditarPessoaValues>({
    nome: '',
    email: '',
    telefone: '',
    cpf: '',
    cidade: '',
    cargo: '',
    ativo: true,
    cep: '',
    logradouro: '',
    numero: '',
    complemento: '',
    bairro: '',
    uf: '',
  })

  function abrirConvidar() {
    setFormEmail('')
    setFormCargo('')
    setConviteOpen(true)
  }

  function abrirEditar(row: Colaborador) {
    setEditingId(row.id)
    setEditInitial(rowToEditValues(row))
    setEditOpen(true)
  }

  function fecharConvite() {
    setConviteOpen(false)
  }

  function fecharEditar() {
    setEditOpen(false)
    setEditingId(null)
  }

  function handleSubmitConvite() {
    const email = formEmail.trim()
    const cargo = formCargo.trim()
    setColaboradores((prev) => [
      ...prev,
      {
        id: `novo-${Date.now()}`,
        nome: null,
        email,
        telefone: '',
        cpf: '',
        cidade: '',
        cargo,
        status: 'pendente',
        cep: '',
        logradouro: '',
        numero: '',
        complemento: '',
        bairro: '',
        uf: '',
      },
    ])
    fecharConvite()
    toastCadastroSucesso(
      'Convite registrado. O envio por e-mail será integrado à API.',
    )
  }

  function handleSalvarEdicao(data: EditarPessoaValues) {
    if (!editingId) return
    setColaboradores((prev) =>
      prev.map((c) =>
        c.id === editingId
          ? {
              ...c,
              nome: data.nome || null,
              email: data.email,
              telefone: data.telefone,
              cpf: data.cpf,
              cidade: data.cidade,
              cargo: data.cargo,
              status: data.ativo ? 'ativo' : 'pendente',
              cep: data.cep,
              logradouro: data.logradouro,
              numero: data.numero,
              complemento: data.complemento,
              bairro: data.bairro,
              uf: data.uf,
            }
          : c,
      ),
    )
    fecharEditar()
    toastCadastroSucesso('Dados do colaborador atualizados.')
  }

  async function solicitarRemocao(row: Colaborador) {
    const subtitulo = row.nome
      ? `${row.nome} (${row.email}) será removido da lista.`
      : `O convite para ${row.email} será removido.`
    const ok = await confirmDeleteRecord('Remover colaborador?', subtitulo)
    if (!ok) return
    setColaboradores((prev) => prev.filter((c) => c.id !== row.id))
    toastSuccess('Colaborador removido.')
  }

  const filtrados = useMemo(() => {
    const q = busca.trim().toLowerCase()
    if (!q) return colaboradores
    return colaboradores.filter((c) => {
      const nome = (c.nome ?? '').toLowerCase()
      return (
        nome.includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.cargo.toLowerCase().includes(q) ||
        c.cidade.toLowerCase().includes(q)
      )
    })
  }, [busca, colaboradores])

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
          <ViewSidebarOutlined sx={{ fontSize: 26 }} />
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
            <GroupsOutlined sx={{ fontSize: 28, color: NAVY }} />
            <Typography
              variant="h6"
              component="h1"
              sx={{
                fontWeight: 700,
                color: NAVY,
                fontSize: { xs: '1.1rem', sm: '1.25rem' },
                letterSpacing: '-0.02em',
              }}
            >
              Gerenciar Colaboradores
            </Typography>
          </Box>
          <Button
            variant="contained"
            color="primary"
            startIcon={<Add />}
            onClick={abrirConvidar}
            sx={{
              borderRadius: '10px',
              px: 2.5,
              py: 1,
              fontWeight: 700,
              textTransform: 'none',
            }}
          >
            Convidar
          </Button>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 }, py: 3 }}>
        <TextField
          fullWidth
          placeholder="Buscar colaboradores..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
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
            maxWidth: 480,
            mb: 2.5,
            '& .MuiOutlinedInput-root': {
              bgcolor: '#ffffff',
              borderRadius: '10px',
              '& fieldset': { borderColor: BORDER },
            },
          }}
        />

        <TableContainer
          sx={{
            border: `1px solid ${BORDER}`,
            borderRadius: '12px',
            bgcolor: '#ffffff',
            overflow: 'hidden',
          }}
        >
          <Table size="medium" sx={{ tableLayout: 'fixed' }}>
            <TableHead>
              <TableRow
                sx={{
                  bgcolor: '#f1f5f9',
                  '& th': {
                    borderBottom: `1px solid ${BORDER}`,
                    color: '#334155',
                    fontWeight: 700,
                    fontSize: '0.875rem',
                    py: 2,
                    px: 2.5,
                  },
                }}
              >
                <TableCell width="22%">Nome</TableCell>
                <TableCell width="28%">Email</TableCell>
                <TableCell width="20%">Cargo</TableCell>
                <TableCell width="15%">Status</TableCell>
                <TableCell width="15%" align="right">
                  Ações
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtrados.map((row, index) => (
                <TableRow
                  key={row.id}
                  sx={{
                    '&:last-child td': { borderBottom: 0 },
                    '& td': {
                      borderBottom:
                        index < filtrados.length - 1
                          ? `1px solid ${BORDER}`
                          : 'none',
                      py: 2,
                      px: 2.5,
                      verticalAlign: 'middle',
                    },
                  }}
                >
                  <TableCell>
                    <Typography
                      sx={{
                        fontWeight: 700,
                        color: row.nome ? NAVY : '#94a3b8',
                      }}
                    >
                      {row.nome ?? '—'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography sx={{ color: '#64748b', fontSize: '0.9375rem' }}>
                      {row.email}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography sx={{ color: '#64748b', fontSize: '0.9375rem' }}>
                      {row.cargo}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={row.status} />
                  </TableCell>
                  <TableCell align="right">
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        gap: 0.5,
                      }}
                    >
                      <IconButton
                        aria-label="Editar colaborador"
                        size="small"
                        sx={{ color: '#0ea5e9' }}
                        onClick={() => abrirEditar(row)}
                      >
                        <EditOutlined fontSize="small" />
                      </IconButton>
                      <IconButton
                        aria-label="Remover colaborador"
                        size="small"
                        sx={{ color: '#ef4444' }}
                        onClick={() => void solicitarRemocao(row)}
                      >
                        <DeleteOutlineOutlined fontSize="small" />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Typography
          variant="body2"
          sx={{ mt: 2, color: '#94a3b8', fontSize: '0.875rem' }}
        >
          {filtrados.length} colaborador
          {filtrados.length === 1 ? '' : 'es'} encontrado
          {filtrados.length === 1 ? '' : 's'}
        </Typography>
      </Container>

      <ColaboradorFormModal
        open={conviteOpen}
        cargos={CARGOS_DISPONIVEIS}
        email={formEmail}
        cargo={formCargo}
        onEmailChange={setFormEmail}
        onCargoChange={setFormCargo}
        onClose={fecharConvite}
        onSubmit={handleSubmitConvite}
      />

      <EditarPessoaModal
        open={editOpen}
        tipo="colaborador"
        initial={editInitial}
        cargos={CARGOS_DISPONIVEIS}
        onClose={fecharEditar}
        onSave={handleSalvarEdicao}
      />
    </Box>
  )
}
