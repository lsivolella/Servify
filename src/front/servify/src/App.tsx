import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import AppShell from './layout/AppShell'
import AgendamentosPage from './pages/AgendamentosPage'
import ClientesPage from './pages/ClientesPage'
import GerenciarColaboradorPage from './pages/GerenciarColaboradorPage'
import LoginPage from './pages/LoginPage'
import PlaceholderPage from './pages/PlaceholderPage'
import RegisterPage from './pages/RegisterPage'
import CompletarCadastroConvitePage from './pages/CompletarCadastroConvitePage'
import GoogleMailOAuthCallbackPage from './pages/GoogleMailOAuthCallbackPage'
import RequireAuth from './routes/RequireAuth'

/**
 * Rotas do painel (AppShell) devem ser filtradas no futuro por perfil de acesso
 * após autenticação (login controlando visibilidade de cada tela).
 */
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/cadastro" element={<RegisterPage />} />
        <Route path="/convite/:token" element={<CompletarCadastroConvitePage />} />
        <Route
          path="/oauth/google/callback"
          element={<GoogleMailOAuthCallbackPage />}
        />
        <Route
          path="/gerenciar-colaborador"
          element={<Navigate to="/colaboradores" replace />}
        />
        <Route element={<RequireAuth />}>
          <Route element={<AppShell />}>
            <Route path="/agendamentos" element={<AgendamentosPage />} />
            <Route
              path="/dashboard"
              element={<PlaceholderPage title="Dashboard" />}
            />
            <Route
              path="/servicos"
              element={<PlaceholderPage title="Serviços" />}
            />
            <Route
              path="/comissao"
              element={<PlaceholderPage title="Comissão" />}
            />
            <Route
              path="/relatorio"
              element={<PlaceholderPage title="Relatório" />}
            />
            <Route path="/colaboradores" element={<GerenciarColaboradorPage />} />
            <Route path="/clientes" element={<ClientesPage />} />
          </Route>
        </Route>
        {/* "/" e "/agendamentos" exibem a mesma tela de agendamentos */}
        <Route path="/" element={<Navigate to="/agendamentos" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
