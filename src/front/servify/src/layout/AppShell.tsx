import { Outlet } from 'react-router-dom'
import Box from '@mui/material/Box'
import AppSidebar from '../components/AppSidebar'
import { SidebarLayoutProvider } from '../context/SidebarLayoutContext'


/**
 * Layout principal da aplicação.
 * Contém o sidebar e o conteúdo principal.
 * 
 * O SidebarLayoutProvider é um contexto que controla a expansão do sidebar.
 * O AppSidebar é o componente que contém o sidebar.
 * O Outlet é o componente que contém o conteúdo principal da tela.
*/

export default function AppShell() {
  return (
    <SidebarLayoutProvider>
      <Box sx={{ display: 'flex', minHeight: '100vh', width: '100%' }}>
        <AppSidebar />
        <Box
          component="main"
          sx={{
            flex: 1,
            minWidth: 0,
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </SidebarLayoutProvider>
  )
}
