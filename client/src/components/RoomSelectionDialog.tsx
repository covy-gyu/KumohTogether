import React, { useState } from 'react'
import logo from '../assets/logo.png'
import styled from 'styled-components'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Alert from '@mui/material/Alert'
import Snackbar from '@mui/material/Snackbar'
import { useAppSelector } from '../hooks'

import phaserGame from '../PhaserGame'
import Bootstrap from '../scenes/Bootstrap'
import { InputAdornment, TextField } from '@mui/material'
import { IUser } from '../../../types/Users'
import { Visibility, VisibilityOff } from '@mui/icons-material'

const Backdrop = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  gap: 60px;
  align-items: center;
`

const Wrapper = styled.form`
  background: #222639;
  border-radius: 16px;
  padding: 36px 60px;
  box-shadow: 0px 0px 5px #0000006f;
`

const BackButtonWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
`

const Title = styled.h1`
  font-size: 24px;
  color: #eee;
  text-align: center;
`

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin: 20px 0;
  align-items: center;
  justify-content: center;

  img {
    border-radius: 8px;
    height: 120px;
  }
`

export default function RoomSelectionDialog() {
  const [showSnackbar, setShowSnackbar] = useState(false)
  const lobbyJoined = useAppSelector((state) => state.room.lobbyJoined)
  const [idFieldEmpty, setIdFieldEmpty] = useState<boolean>(false)
  const [pwFieldEmpty, setPwFieldEmpty] = useState<boolean>(false)
  const [showPassword, setShowPassword] = useState(false)

  const [loginResult, setLoginFail] = useState<boolean>(false)

  const [values, setValues] = useState<IUser>({
    id: '',
    password: '',
    result: false,
  })

  const handleChange = (prop: keyof IUser) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [prop]: event.target.value })
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const isValidId = values.id !== ''
    const isValidPassword = values.password !== ''

    if (isValidId === idFieldEmpty) setIdFieldEmpty(!idFieldEmpty)
    if (isValidPassword === pwFieldEmpty)
      setPwFieldEmpty(!pwFieldEmpty)

      if (isValidId && isValidPassword && lobbyJoined) {
        const bootstrap = phaserGame.scene.keys.bootstrap as Bootstrap
        const tryLogin = bootstrap.network.tryLogin(values)
        if (await tryLogin ===true) {
          bootstrap.network
            .joinOrCreatePublic()
            .then(() => bootstrap.launchGame())
            .catch((error) => console.error(error))
        } else {
          setShowSnackbar(true)
        }
      }
  }
  return (
    <>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={showSnackbar}
        autoHideDuration={3000}
        onClose={() => {
          setShowSnackbar(false)
        }}
      >
        <Alert
          severity="error"
          variant="outlined"
          // overwrites the dark theme on render
          style={{ background: '#fdeded', color: '#7d4747' }}
        >
          Trying to connect to server, please try again!
        </Alert>
      </Snackbar>
      <Backdrop >
        <Wrapper onSubmit={handleSubmit}>
          <Title>Welcome to KumohTogether</Title>
          <Content onSubmit={handleSubmit}>
            <img src={logo} alt="logo" />
            <TextField
              autoFocus
              fullWidth
              label="id"
              variant="outlined"
              color="secondary"
              error={idFieldEmpty}
              helperText={idFieldEmpty && 'ID가 필요합니다.'}
              onChange={handleChange('id')}
            />
            <TextField
              type={showPassword ? 'text' : 'password'}
              autoFocus
              fullWidth
              label="password"
              variant="outlined"
              color="secondary"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              error={pwFieldEmpty}
              helperText={pwFieldEmpty && '비밀번호가 필요합니다.'}
              onChange={handleChange('password')}
            />
            <Button variant="contained" color="secondary" type="submit">
              LogIn
            </Button>
          </Content>
        </Wrapper>
      </Backdrop>
    </>
  )
}
