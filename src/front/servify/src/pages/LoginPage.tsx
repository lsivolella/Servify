import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Alert from '@mui/material/Alert'
import Link from '@mui/material/Link'
import Stack from '@mui/material/Stack'
import InputAdornment from '@mui/material/InputAdornment'
import PersonOutlined from '@mui/icons-material/PersonOutlined'
import LockOutlined from '@mui/icons-material/LockOutlined'
import ReportProblemOutlined from '@mui/icons-material/ReportProblemOutlined'
import './styles/LoginPage.css'

export default function LoginPage() {
  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const user = login.trim()
    if (!user || !password) {
      setErrorMessage('Preencha usuário e senha.')
      return
    }
    if (user === 'demo' && password === 'demo') {
      setErrorMessage(null)
      return
    }
    setErrorMessage('Usuário ou senha inválidos.')
  }

  function clearError() {
    if (errorMessage) setErrorMessage(null)
  }

  return (
    <Box className="login-page">
      <Card className="login-card" elevation={0} variant="outlined">
        <Typography
          className="login-brand"
          variant="h5"
          component="h1"
          align="center"
        >
          Serviffy
        </Typography>
        <Typography
          className="login-subtitle"
          variant="body2"
          component="p"
          align="center"
          color="text.primary"
        >
          Acesse sua conta para continuar
        </Typography>

        {errorMessage ? (
          <Alert
            severity="error"
            className="login-alert"
            role="alert"
            icon={
              <ReportProblemOutlined
                className="login-alert__icon"
                fontSize="small"
              />
            }
          >
            {errorMessage}
          </Alert>
        ) : null}

        <br />

        <Box
          component="form"
          className="login-form"
          onSubmit={handleSubmit}
          noValidate
        >
          <Stack spacing={4}>
            <Stack spacing={2.5}>
              <Box className="login-field">
                <Typography
                  className="login-label"
                  variant="body2"
                  component="label"
                  htmlFor="login-user"
                  color="text.primary"
                >
                  Login
                </Typography>
                <TextField
                  id="login-user"
                  name="login"
                  className="login-input"
                  fullWidth
                  hiddenLabel
                  variant="outlined"
                  type="text"
                  autoComplete="username"
                  placeholder="Digite seu usuário"
                  value={login}
                  onChange={(ev) => {
                    setLogin(ev.target.value)
                    clearError()
                  }}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonOutlined fontSize="small" />
                        </InputAdornment>
                      ),
                    },
                  }}
                />
              </Box>

              <Box className="login-field">
                <Typography
                  className="login-label"
                  variant="body2"
                  component="label"
                  htmlFor="login-password"
                  color="text.primary"
                >
                  Senha
                </Typography>
                <TextField
                  id="login-password"
                  name="password"
                  className="login-input"
                  fullWidth
                  hiddenLabel
                  variant="outlined"
                  type="password"
                  autoComplete="current-password"
                  placeholder="Digite sua senha"
                  value={password}
                  onChange={(ev) => {
                    setPassword(ev.target.value)
                    clearError()
                  }}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockOutlined fontSize="small" />
                        </InputAdornment>
                      ),
                    },
                  }}
                />
              </Box>
            </Stack>

            <Button
              type="submit"
              color="primary"
              variant="contained"
              fullWidth
              className="login-submit"
            >
              Entrar
            </Button>
          </Stack>
        </Box>

        <br />
        <Typography
          className="login-footer"
          variant="body2"
          component="p"
          align="center"
          color="text.secondary"
        >
          <Box component="span" className="login-footer__muted">
            Não tenho cadastro?
          </Box>
          <Link
            component={RouterLink}
            to="/cadastro"
            underline="hover"
            className="login-footer__link"
          >
            Criar conta
          </Link>
        </Typography>
      </Card>
    </Box>
  )
}
