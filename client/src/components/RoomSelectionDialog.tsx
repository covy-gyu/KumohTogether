import React, { useState } from 'react'
import logo from '../assets/logo.png'
import styled from 'styled-components'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import LinearProgress from '@mui/material/LinearProgress'
import Alert from '@mui/material/Alert'
import Snackbar from '@mui/material/Snackbar'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'

import { CustomRoomTable } from './CustomRoomTable'
import { CreateRoomForm } from './CreateRoomForm'
import { useAppSelector } from '../hooks'

import phaserGame from '../PhaserGame'
import Bootstrap from '../scenes/Bootstrap'
import { TextField } from '@mui/material'

import Colyseus from 'colyseus.js'
import Network from '../services/Network'
import { IUser } from '../../../types/Users'



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

const CustomRoomWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
  justify-content: center;

  .tip {
    font-size: 18px;
  }
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

const ProgressBarWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  h3 {
    color: #33ac96;
  }
`

const ProgressBar = styled(LinearProgress)`
  width: 360px;
`

export default function RoomSelectionDialog() {
  const [showCustomRoom, setShowCustomRoom] = useState(false)
  const [showCreateRoomForm, setShowCreateRoomForm] = useState(false)
  const [showSnackbar, setShowSnackbar] = useState(false)
  const lobbyJoined = useAppSelector((state) => state.room.lobbyJoined)

  const [id, setId] = useState<string>('')
  const [idFieldEmpty, setIdFieldEmpty] = useState<boolean>(false)
  const [pw, setPw] = useState<string>('')
  const [pwFieldEmpty, setPwFieldEmpty] = useState<boolean>(false)

  const [loginResult, setLoginFail] = useState<boolean>(false)

  let user: IUser

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (id === '') {
      setIdFieldEmpty(true)
    }
    else if(pw===''){
      setPwFieldEmpty(true)
    }

    

    else if (lobbyJoined) {

      user.ID=id
      user.password=pw

      
      const bootstrap = phaserGame.scene.keys.bootstrap as Bootstrap
      
      const checkLogin = bootstrap.network.checkLogin(user)
      
      if (checkLogin) {
        bootstrap.network
          .joinOrCreatePublic()
          .then(() => bootstrap.launchGame())
          .catch((error) => console.error(error))
      } else {
        setShowSnackbar(true)
      }
    }
    if (id !== '') {
      setIdFieldEmpty(false)
    }
    else if(pw !==''){
      setPwFieldEmpty(false)
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
          {/* {showCreateRoomForm ? (
            <CustomRoomWrapper>
              <Title>Create Custom Room</Title>
              <BackButtonWrapper>
                <IconButton onClick={() => setShowCreateRoomForm(false)}>
                  <ArrowBackIcon />
                </IconButton>
              </BackButtonWrapper>
              <CreateRoomForm />
            </CustomRoomWrapper>
          ) : showCustomRoom ? (
            <CustomRoomWrapper>
              <Title>
                Custom Rooms
                <Tooltip
                  title="We update the results in realtime, no refresh needed!"
                  placement="top"
                >
                  <IconButton>
                    <HelpOutlineIcon className="tip" />
                  </IconButton>
                </Tooltip>
              </Title>
              <BackButtonWrapper>
                <IconButton onClick={() => setShowCustomRoom(false)}>
                  <ArrowBackIcon />
                </IconButton>
              </BackButtonWrapper>
              <CustomRoomTable />
              <Button
                variant="contained"
                color="secondary"
                onClick={() => setShowCreateRoomForm(true)}
              >
                Create new room
              </Button>
            </CustomRoomWrapper>
          ) : ( */}
            {/* <> */}
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
                    onInput={(e) => {
                      setId((e.target as HTMLInputElement).value)
                    }}
                  />
                  <TextField
                    autoFocus
                    fullWidth
                    label="password"
                    variant="outlined"
                    color="secondary"
                    error={pwFieldEmpty}
                    helperText={pwFieldEmpty && '비밀번호가 필요합니다.'}
                    onInput={(e) => {
                      setPw((e.target as HTMLInputElement).value)
                    }}
                  />       
                <Button variant="contained" color="secondary" type="submit">
                  LogIn
                </Button>
                {/* <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => (lobbyJoined ? setShowCustomRoom(true) : setShowSnackbar(true))}
                >
                  Create/find custom rooms
                </Button> */}
              </Content>
            {/* </> */}
          {/* )} */}
        </Wrapper>
        {/* {!lobbyJoined && (
          <ProgressBarWrapper>
            <h3> Connecting to server...</h3>
            <ProgressBar color="secondary" />
          </ProgressBarWrapper>
        )} */}

      </Backdrop>
    </>
  )
}
