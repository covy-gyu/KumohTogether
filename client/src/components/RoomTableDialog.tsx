import React, { useState } from 'react'
import styled from 'styled-components'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'

import { useAppSelector, useAppDispatch } from '../hooks'
import { closeComputerDialog } from '../stores/ComputerStore'

import Video from './Video'
import { Alert, Snackbar, Tooltip } from '@mui/material'
import { closeRoomTableDialog } from '../stores/PrivateRoomStore'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { CustomRoomTable } from './CustomRoomTable'
import { CreateRoomForm } from './CreateRoomForm'

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

const Wrapper = styled.div`
  background: #222639;
  border-radius: 16px;
  padding: 36px 60px;
  box-shadow: 0px 0px 5px #0000006f;
  .close {
    position: absolute;
    top: 16px;
    right: 16px;
  }
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
const Title = styled.h1`
  font-size: 24px;
  color: #eee;
  text-align: center;
`
const BackButtonWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
`

export default function RoomTableDialog() {
  const dispatch = useAppDispatch()
  const [showCustomRoom, setShowCustomRoom] = useState(false)
  const [showCreateRoomForm, setShowCreateRoomForm] = useState(false)
  const [showRoomTable, setShowRoomTable] = useState(false)
  const [showSnackbar, setShowSnackbar] = useState(false)

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
          네트워크 에러, 다시 시도해 보세요!
        </Alert>
      </Snackbar>
    <Backdrop>  
      <Wrapper>
        <IconButton
          aria-label="close dialog"
          className="close"
          onClick={() => dispatch((closeRoomTableDialog()))}
        >
          <CloseIcon />
        </IconButton>
        {showCreateRoomForm ? (
            <CustomRoomWrapper>
              <Title>
                방 만들기
              </Title>
              <BackButtonWrapper>
                <IconButton onClick={() => setShowCreateRoomForm(false)}>
                  <ArrowBackIcon />
                </IconButton>
              </BackButtonWrapper>
              <CreateRoomForm />
            </CustomRoomWrapper>
        ) :  (
            <CustomRoomWrapper>
            <Title>
              방 목록
            </Title>
            <CustomRoomTable />
            <Button
              variant="contained"
              color="secondary"
              onClick={() => setShowCreateRoomForm(true)}
            >
              방 만들기
            </Button>
          </CustomRoomWrapper>
        )}
      </Wrapper>
    </Backdrop>
    </>
  )
}
