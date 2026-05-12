import { Navigate, RouterProvider, createBrowserRouter } from 'react-router-dom'
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
 * Data Router (`createBrowserRouter`) para suportar APIs como `useBlocker`
 * na tela de completar cadastro do convite.
 */
const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  { path: '/cadastro', element: <RegisterPage /> },
  { path: '/convite/:token', element: <CompletarCadastroConvitePage /> },
  {
    path: '/oauth/google/callback',
    element: <GoogleMailOAuthCallbackPage />,
  },
  {
    path: '/gerenciar-colaborador',
    element: <Navigate to="/colaboradores" replace />,
  },
  {
    element: <RequireAuth />,
    children: [
      {
        element: <AppShell />,
        children: [
          { path: '/agendamentos', element: <AgendamentosPage /> },
          {
            path: '/dashboard',
            element: <PlaceholderPage title="Dashboard" />,
          },
          {
            path: '/servicos',
            element: <PlaceholderPage title="Serviços" />,
          },
          {
            path: '/comissao',
            element: <PlaceholderPage title="Comissão" />,
          },
          {
            path: '/relatorio',
            element: <PlaceholderPage title="Relatório" />,
          },
          {
            path: '/colaboradores',
            element: <GerenciarColaboradorPage />,
          },
          { path: '/clientes', element: <ClientesPage /> },
        ],
      },
    ],
  },
  { path: '/', element: <Navigate to="/agendamentos" replace /> },
])

export default function App() {
  return <RouterProvider router={router} />
}
