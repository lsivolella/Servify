import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CalendarMonthOutlined from '@mui/icons-material/CalendarMonthOutlined'
import ViewSidebarOutlined from '@mui/icons-material/ViewSidebarOutlined'
import { useSidebarLayout } from '../context/SidebarLayoutContext'

const NAVY = '#1e3a5f'
const BORDER = '#e2e8f0'
const PAGE_BG = '#f8fafc'

/**
 * Tela principal de agendamentos.
 * Mesma instância é montada ao acessar "/" (redirect) ou "/agendamentos".
 * Futuro: filtro por perfil de acesso via contexto de autenticação.
 */
export default function AgendamentosPage() {
  const { sidebarExpanded, toggleSidebar } = useSidebarLayout()

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
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <CalendarMonthOutlined sx={{ fontSize: 28, color: NAVY }} />
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
              Agendamentos
            </Typography>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 }, py: 4 }}>
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 560 }}>
          Área de agendamentos. A integração com backend e regras por perfil de
          usuário serão adicionadas nas próximas etapas.
        </Typography>
      </Container>
    </Box>
  )
}
