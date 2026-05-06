import type { ReactNode } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import ListItemButton from '@mui/material/ListItemButton'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import AssessmentOutlined from '@mui/icons-material/AssessmentOutlined'
import CalendarMonthOutlined from '@mui/icons-material/CalendarMonthOutlined'
import DesignServicesOutlined from '@mui/icons-material/DesignServicesOutlined'
import GridViewOutlined from '@mui/icons-material/GridViewOutlined'
import GroupsOutlined from '@mui/icons-material/GroupsOutlined'
import LogoutOutlined from '@mui/icons-material/LogoutOutlined'
import PercentOutlined from '@mui/icons-material/PercentOutlined'
import PersonOutlined from '@mui/icons-material/PersonOutlined'
import { useSidebarLayout } from '../context/SidebarLayoutContext'

const BG = '#0B1E3B'
const ACTIVE_BG = '#1E3A5F'
const SECTION = '#708090'

const EXPANDED_W = 280
const COLLAPSED_W = 76

function navButtonSx(collapsed: boolean) {
  return {
    borderRadius: '10px',
    py: 1.25,
    px: collapsed ? 1 : 1.75,
    mb: 0.5,
    color: '#FFFFFF',
    minHeight: 44,
    justifyContent: collapsed ? 'center' : 'space-between',
    '&:hover': {
      bgcolor: 'rgba(255, 255, 255, 0.06)',
    },
    '&.active': {
      bgcolor: ACTIVE_BG,
      fontWeight: 700,
      '& .MuiTypography-root': {
        fontWeight: 700,
      },
    },
    '& .MuiSvgIcon-root': {
      color: '#FFFFFF',
      fontSize: 22,
      opacity: 0.95,
    },
  } as const
}

function SectionLabel({
  children,
  collapsed,
}: {
  children: string
  collapsed: boolean
}) {
  if (collapsed) return null
  return (
    <Typography
      sx={{
        fontSize: '0.6875rem',
        fontWeight: 600,
        letterSpacing: '0.08em',
        color: SECTION,
        textTransform: 'uppercase',
        mb: 1.25,
        mt: 3,
        px: 0.5,
        '&:first-of-type': { mt: 0 },
      }}
    >
      {children}
    </Typography>
  )
}

function NavRow({
  to,
  icon,
  label,
  collapsed,
}: {
  to: string
  icon: ReactNode
  label: string
  collapsed: boolean
}) {
  const button = (
    <ListItemButton
      component={NavLink}
      to={to}
      sx={{
        ...navButtonSx(collapsed),
        display: 'flex',
        alignItems: 'center',
        gap: 1,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: collapsed ? 0 : 1.5,
          minWidth: 0,
          justifyContent: collapsed ? 'center' : 'flex-start',
          flex: collapsed ? undefined : 1,
        }}
      >
        {icon}
        {!collapsed ? (
          <Typography
            sx={{
              fontSize: '0.9375rem',
              fontWeight: 500,
              color: '#FFFFFF',
              lineHeight: 1.3,
            }}
          >
            {label}
          </Typography>
        ) : null}
      </Box>
    </ListItemButton>
  )

  if (collapsed) {
    return (
      <Tooltip title={label} placement="right" arrow enterDelay={400}>
        {button}
      </Tooltip>
    )
  }

  return button
}

export default function AppSidebar() {
  const navigate = useNavigate()
  const { sidebarExpanded } = useSidebarLayout()
  const collapsed = !sidebarExpanded

  return (
    <Box
      component="nav"
      aria-label="Menu principal"
      sx={{
        width: collapsed ? COLLAPSED_W : EXPANDED_W,
        flexShrink: 0,
        minHeight: '100vh',
        bgcolor: BG,
        display: 'flex',
        flexDirection: 'column',
        py: 2.75,
        px: collapsed ? 1 : 2,
        boxSizing: 'border-box',
        transition: 'width 0.22s ease, padding 0.22s ease',
        overflow: 'hidden',
      }}
    >
      <Box sx={{ flex: 1, overflow: 'auto', overflowX: 'hidden' }}>
        <SectionLabel collapsed={collapsed}>Principal</SectionLabel>
        <NavRow
          to="/agendamentos"
          icon={<CalendarMonthOutlined />}
          label="Agendamentos"
          collapsed={collapsed}
        />
        <NavRow
          to="/dashboard"
          icon={<GridViewOutlined />}
          label="Dashboard"
          collapsed={collapsed}
        />

        <SectionLabel collapsed={collapsed}>Operacional</SectionLabel>
        <NavRow
          to="/servicos"
          icon={<DesignServicesOutlined />}
          label="Serviços"
          collapsed={collapsed}
        />
        <NavRow
          to="/comissao"
          icon={<PercentOutlined />}
          label="Comissão"
          collapsed={collapsed}
        />
        <NavRow
          to="/relatorio"
          icon={<AssessmentOutlined />}
          label="Relatório"
          collapsed={collapsed}
        />

        <SectionLabel collapsed={collapsed}>Gestão</SectionLabel>
        <NavRow
          to="/colaboradores"
          icon={<GroupsOutlined />}
          label="Colaboradores"
          collapsed={collapsed}
        />
        <NavRow
          to="/clientes"
          icon={<PersonOutlined />}
          label="Clientes"
          collapsed={collapsed}
        />
      </Box>

      <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.08)', my: 2 }} />

      <Box sx={{ px: collapsed ? 0 : 0.5, alignItems: 'center' }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: collapsed ? 'column' : 'row',
            alignItems: 'center',
            justifyContent: collapsed ? 'center' : 'flex-start',
            gap: collapsed ? 1 : 1.5,
            mb: 2,
          }}
        >
          <Tooltip
            title={collapsed ? 'Waltinho' : ''}
            placement="right"
            disableHoverListener={!collapsed}
            arrow
          >
            <Avatar
              sx={{
                width: 40,
                height: 40,
                bgcolor: ACTIVE_BG,
                color: '#fff',
                fontSize: '0.875rem',
                fontWeight: 700,
              }}
            >
              WA
            </Avatar>
          </Tooltip>
          {!collapsed ? (
            <Box sx={{ minWidth: 0 }}>
              <Typography
                sx={{
                  color: '#FFFFFF',
                  fontWeight: 600,
                  fontSize: '0.9375rem',
                  lineHeight: 1.2,
                }}
              >
                Waltinho
              </Typography>
              <Box
                sx={{
                  mt: 0.75,
                  width: 36,
                  height: 2,
                  borderRadius: 1,
                  bgcolor: 'rgba(255, 255, 255, 0.22)',
                }}
              />
            </Box>
          ) : null}
        </Box>

        {collapsed ? (
          <Tooltip title="Sair" placement="right" arrow enterDelay={400}>
            <IconButton
              onClick={() => navigate('/login')}
              aria-label="Sair"
              sx={{
                width: '100%',
                color: '#fff',
                border: '1px solid rgba(255, 255, 255, 0.35)',
                borderRadius: '10px',
                py: 1,
                '&:hover': {
                  borderColor: 'rgba(255, 255, 255, 0.55)',
                  bgcolor: 'rgba(255, 255, 255, 0.05)',
                },
              }}
            >
              <LogoutOutlined fontSize="small" />
            </IconButton>
          </Tooltip>
        ) : (
          <Button
            fullWidth
            variant="outlined"
            startIcon={
              <LogoutOutlined sx={{ fontSize: 20, color: '#fff !important' }} />
            }
            onClick={() => navigate('/login')}
            sx={{
              borderRadius: '10px',
              py: 1.1,
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '0.9375rem',
              color: '#FFFFFF',
              borderColor: 'rgba(255, 255, 255, 0.35)',
              '&:hover': {
                borderColor: 'rgba(255, 255, 255, 0.55)',
                bgcolor: 'rgba(255, 255, 255, 0.05)',
              },
            }}
          >
            Sair
          </Button>
        )}
      </Box>
    </Box>
  )
}
