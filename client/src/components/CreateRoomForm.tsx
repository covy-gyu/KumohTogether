import React, { useState } from 'react'
import styled from 'styled-components'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'

import { IRoomData } from '../../../types/Rooms'
import { useAppDispatch, useAppSelector } from '../hooks'

import phaserGame from '../PhaserGame'
import Bootstrap from '../scenes/Bootstrap'
import Checkbox from '@mui/material/Checkbox'
import { setIsClass } from '../stores/RoomStore'
import { closeDoor, openClass, openConfer, openSquare, setDoorLocation } from '../stores/DoorStore'
import { setLocation } from '../stores/ChatStore'
import { setUserLocation } from '../stores/LogInfoStore'
import Game from '../scenes/Game'
import ClassRoom from '../scenes/ClassRoom'
import Conference from '../scenes/Conference'

const CreateRoomFormWrapper = styled.form`
  display: flex;
  flex-direction: column;
  width: 320px;
  gap: 20px;
`

export const CreateRoomForm = () => {
  const [values, setValues] = useState<IRoomData>({
    name: '',
    description: '',
    password: null,
    autoDispose: true,
  })
  const [showPassword, setShowPassword] = useState(false)
  const [nameFieldEmpty, setNameFieldEmpty] = useState(false)
  const [descriptionFieldEmpty, setDescriptionFieldEmpty] = useState(false)
  const lobbyJoined = useAppSelector((state) => state.room.lobbyJoined)
  const [checked, setChecked] = React.useState(true);
  const dispatch = useAppDispatch()
  const userName = useAppSelector((state) => state.logInfo.userName)
  const userAvatar = useAppSelector((state) => state.logInfo.userAvatar)

  const handleCheckChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };

  const handleChange = (prop: keyof IRoomData) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [prop]: event.target.value })
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const isValidName = values.name !== ''
    const isValidDescription = values.description !== ''

    if (isValidName === nameFieldEmpty) setNameFieldEmpty(!nameFieldEmpty)
    if (isValidDescription === descriptionFieldEmpty)
      setDescriptionFieldEmpty(!descriptionFieldEmpty)

    // create custom room if name and description are not empty
    if (isValidName && isValidDescription && lobbyJoined) {
      const bootstrap = phaserGame.scene.keys.bootstrap as Bootstrap
      const game = phaserGame.scene.keys.game as Game
      const classRoom = phaserGame.scene.keys.classRoom as ClassRoom
      const conference = phaserGame.scene.keys.conference as Conference
      if(checked){
        bootstrap.network
        .createCustom(values)
        .then(() => bootstrap.launchClass())
        .then(()=>{setTimeout(() => {
          dispatch(setDoorLocation('class'))
          dispatch(setLocation('class'))
          dispatch(setUserLocation('class'))
        }, 1000);})
        .then(()=>{setTimeout(() => {
          classRoom.myPlayer.setPlayerName(userName)
          classRoom.myPlayer.setPlayerTexture(userAvatar)
          classRoom.network.readyToConnect()
          classRoom.network.videoConnected()
          // dispatch(openClass())
        }, 1000);})
        .then(()=>{setTimeout(() => {
          dispatch(closeDoor())
           game.scene.stop()
        }, 1000);})
        .catch((error) => console.error(error))
      }
      else{
        bootstrap.network
        .createCustom(values)
        .then(() => conference.scene.start('classRoom',{
          network: bootstrap.network,
          logInfo: bootstrap.logInfo,
         }))
        .then(()=>{setTimeout(() => {
          conference.myPlayer.setPlayerName(userName)
          conference.myPlayer.setPlayerTexture(userAvatar)
          conference.network.readyToConnect()
          conference.network.videoConnected()
          // dispatch(openConfer())
        }, 1000);})
        .then(()=>{setTimeout(() => {
          // dispatch(closeDoor())/
           game.scene.stop()
    
        }, 1000);})
        .catch((error) => console.error(error))
      }
      
    }
  }

  return (
    <CreateRoomFormWrapper onSubmit={handleSubmit}>
      <TextField
        label="제목"
        variant="outlined"
        color="secondary"
        autoFocus
        error={nameFieldEmpty}
        helperText={nameFieldEmpty && '방 제목이 필요합니다'}
        onChange={handleChange('name')}
      />

      <TextField
        label="소개"
        variant="outlined"
        color="secondary"
        error={descriptionFieldEmpty}
        helperText={descriptionFieldEmpty && '방 소개가 필요합니다'}
        multiline
        rows={4}
        onChange={handleChange('description')}
      />

      <TextField
        type={showPassword ? 'text' : 'password'}
        label="비밀번호 (선택사항)"
        onChange={handleChange('password')}
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
      />
      <TextField label='수업방'/>
        <Checkbox
        checked={checked}
        onChange={handleCheckChange}
        inputProps={{ 'aria-label': '수업 방' }}
      />
      <Button variant="contained" color="secondary" type="submit">
        만들기
      </Button>
    </CreateRoomFormWrapper>
  )
}
